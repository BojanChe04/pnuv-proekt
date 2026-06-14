import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class ChallengesService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  async getUserProgress() {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return null;

    const docRef = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
}
  async completeChallenge(challengeId: string) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    const today = new Date().toISOString().split('T')[0];
    const docRef = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data() || {};

    const lastCheckin = data['lastCheckin'];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let streak = data['streak'] || 0;
    if (lastCheckin === yesterdayStr) {
      streak += 1;
    } else if (lastCheckin !== today) {
      streak = 1;
    }

    const completed = data['completedChallenges'] || [];
    if (!completed.includes(challengeId)) {
      completed.push(challengeId);
    }

    const badges = data['badges'] || [];
    if (streak >= 3 && !badges.includes('3days')) badges.push('3days');
    if (streak >= 7 && !badges.includes('7days')) badges.push('7days');
    if (streak >= 14 && !badges.includes('14days')) badges.push('14days');
    if (streak >= 30 && !badges.includes('30days')) badges.push('30days');

    await setDoc(docRef, {
      ...data,
      streak,
      lastCheckin: today,
      completedChallenges: completed,
      badges
    }, { merge: true });

    return { streak, badges };
  }
}
