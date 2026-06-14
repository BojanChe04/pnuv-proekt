import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChallengesService } from '../../services/challenges';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'физичко' | 'ментално' | 'социјално' | 'сон';
  icon: string;
  points: number;
}

@Component({
  selector: 'app-challenges',
  imports: [CommonModule, RouterModule],
  templateUrl: './challenges.html',
  styleUrl: './challenges.scss',
  standalone: true,
})
export class Challenges implements OnInit {
  private challengesService = inject(ChallengesService);

  streak = 0;
  badges: string[] = [];
  completedChallenges: string[] = [];
  selectedCategory = 'сите';
  todayCompleted = false;
  loading = false;

  categories = ['сите', 'физичко', 'ментално', 'социјално', 'сон'];

  allChallenges: Challenge[] = [
    { id: 'c1', title: 'Утринска шетање', description: 'Направи 10 минути шетање наутро', category: 'физичко', icon: '🚶', points: 10 },
    { id: 'c2', title: 'Длабоко дишење', description: 'Вежбај длабоко дишење 5 минути', category: 'ментално', icon: '🧘', points: 10 },
    { id: 'c3', title: 'Порака до пријател', description: 'Испрати порака до некој близок', category: 'социјално', icon: '💬', points: 10 },
    { id: 'c4', title: 'Без екран пред спиење', description: 'Избегни екрани 30 мин пред спиење', category: 'сон', icon: '😴', points: 10 },
    { id: 'c5', title: 'Благодарност', description: 'Напиши 3 работи за кои си благодарен', category: 'ментално', icon: '📝', points: 15 },
    { id: 'c6', title: 'Вода', description: 'Испиј 8 чаши вода денес', category: 'физичко', icon: '💧', points: 10 },
    { id: 'c7', title: 'Комплимент', description: 'Дај комплимент на некого денес', category: 'социјално', icon: '❤️', points: 15 },
    { id: 'c8', title: 'Рано легнување', description: 'Легни пред полноќ', category: 'сон', icon: '🌙', points: 10 },
  ];

  get todayChallenge(): Challenge {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return this.allChallenges[dayOfYear % this.allChallenges.length];
  }

  get filteredChallenges(): Challenge[] {
    if (this.selectedCategory === 'сите') return this.allChallenges;
    return this.allChallenges.filter(c => c.category === this.selectedCategory);
  }

  get badgeList() {
    return [
      { id: '3days', label: '3 дена', icon: '🥉', unlocked: this.badges.includes('3days') },
      { id: '7days', label: '7 дена', icon: '🥈', unlocked: this.badges.includes('7days') },
      { id: '14days', label: '14 дена', icon: '🥇', unlocked: this.badges.includes('14days') },
      { id: '30days', label: '30 дена', icon: '🏆', unlocked: this.badges.includes('30days') },
    ];
  }

  async ngOnInit() {
    const data = await this.challengesService.getUserProgress();
    if (data) {
      this.streak = data['streak'] || 0;
      this.badges = data['badges'] || [];
      this.completedChallenges = data['completedChallenges'] || [];
      const today = new Date().toISOString().split('T')[0];
      this.todayCompleted = data['lastCheckin'] === today;
    }
  }

  async completeToday() {
    if (this.todayCompleted || this.loading) return;
    this.loading = true;
    const result = await this.challengesService.completeChallenge(this.todayChallenge.id);
    if (result) {
      this.streak = result.streak;
      this.badges = result.badges;
      this.todayCompleted = true;
      if (!this.completedChallenges.includes(this.todayChallenge.id)) {
        this.completedChallenges.push(this.todayChallenge.id);
      }
    }
    this.loading = false;
  }

  isCompleted(id: string): boolean {
    return this.completedChallenges.includes(id);
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
  }
}
