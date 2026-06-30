import { Component, inject, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';

interface Mood {
  value: string;
  emoji: string;
  label: string;
}

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkin.html',
  styleUrl: './checkin.scss',
})
export class Checkin {
  private authService = inject(AuthService);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private injector = inject(Injector);

  step = 1;
  totalSteps = 4;

  moods: Mood[] = [
    { value: 'одлично', emoji: '😄', label: 'Одлично' },
    { value: 'добро', emoji: '🙂', label: 'Добро' },
    { value: 'средно', emoji: '😐', label: 'Средно' },
    { value: 'лошо', emoji: '😔', label: 'Лошо' },
    { value: 'многу лошо', emoji: '😢', label: 'Многу лошо' }
  ];

  selectedMood = '';
  stressLevel = 3;
  sleepQuality = 3;
  socialConnection = 3;
  note = '';

  loading = false;
  submitted = false;

  selectMood(mood: string) {
    this.selectedMood = mood;
  }

  nextStep() {
    if (this.step < this.totalSteps) this.step++;
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  canProceed(): boolean {
    if (this.step === 1) return !!this.selectedMood;
    return true;
  }

  async submitCheckin() {
    this.loading = true;
    try {
      const currentUser = this.authService.currentUser;
      if (currentUser) {
        await runInInjectionContext(this.injector, () =>
          addDoc(collection(this.firestore, 'checkins'), {
            userId: currentUser.uid,
            mood: this.selectedMood,
            stressLevel: this.stressLevel,
            sleepQuality: this.sleepQuality,
            socialConnection: this.socialConnection,
            note: this.note,
            createdAt: serverTimestamp()
          })
        );
        this.submitted = true;
      } else {
        console.error('No user logged in');
      }
    } catch (e) {
      console.error('Error saving checkin:', e);
    } finally {
      this.loading = false;
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  get selectedMoodEmoji(): string {
    return this.moods.find(m => m.value === this.selectedMood)?.emoji || '😊';
  }

  getMotivationalMessage(): string {
    const messages: any = {
      'одлично': 'Прекрасно! Продолжи да го одржуваш ова позитивно расположение! 🌟',
      'добро': 'Одлично е дека се чувствуваш добро денес! 💚',
      'средно': 'Во ред е да се чувствуваш просечно понекогаш. Биди нежен/на кон себе. 🌿',
      'лошо': 'Жал ни е што не се чувствуваш добро. Земи си момент за себе денес. 🤗',
      'многу лошо': 'Тука сме за тебе. Ако ти треба некој со кого да разговараш, побарај поддршка. 💙'
    };
    return messages[this.selectedMood] || 'Благодариме за твојата искреност!';
  }
}
