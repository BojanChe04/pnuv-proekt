import { Component, OnInit, inject, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Firestore, collection, query, where, orderBy, limit, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private injector = inject(Injector);

  userName = '';
  today = new Date();
  lastMood = '';
  lastMoodEmoji = '';
  streak = 0;
  completedChallenges = 0;
  recentCheckins: any[] = [];
  loading = true;

  moods = [
    { value: 'одлично', emoji: '😄' },
    { value: 'добро', emoji: '🙂' },
    { value: 'средно', emoji: '😐' },
    { value: 'лошо', emoji: '😔' },
    { value: 'многу лошо', emoji: '😢' }
  ];

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        runInInjectionContext(this.injector, async () => {
          try {
            const profile = await this.authService.getUserProfile(user.uid);
            this.userName = profile?.['name'] || user.email || 'Корисник';

            await this.loadRecentCheckins(user.uid);
            await this.loadChallengeProgress(user.uid);
          } catch (e) {
            console.error('Error loading dashboard data:', e);
          } finally {
            this.loading = false;
          }
        });
      } else {
        this.loading = false;
      }
    });
  }

  async loadRecentCheckins(uid: string) {
    try {
      const q = query(
        collection(this.firestore, 'checkins'),
        where('userId', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const snap = await getDocs(q);
      this.recentCheckins = snap.docs.map(d => d.data());

      if (this.recentCheckins.length > 0) {
        const last = this.recentCheckins[0];
        this.lastMood = last['mood'];
        this.lastMoodEmoji = this.moods.find(m => m.value === last['mood'])?.emoji || '😐';
      }
    } catch (e) {
      console.error('Error loading recent checkins:', e);
    }
  }

  async loadChallengeProgress(uid: string) {
    try {
      const q = query(
        collection(this.firestore, 'userProgress'),
        where('userId', '==', uid)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data();
        this.streak = data['streak'] || 0;
        this.completedChallenges = (data['completedChallenges'] || []).length;
      }
    } catch (e) {
      console.error('Error loading challenge progress:', e);
    }
  }

  getDayName(): string {
    const days = ['Недела', 'Понеделник', 'Вторник', 'Среда', 'Четврток', 'Петок', 'Сабота'];
    return days[this.today.getDay()];
  }

  getGreeting(): string {
    const hour = this.today.getHours();
    if (hour < 12) return 'Добро утро';
    if (hour < 18) return 'Добар ден';
    return 'Добра вечер';
  }
}
