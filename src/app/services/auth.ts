import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  currentUser$ = user(this.auth);

  get currentUser() {
    return this.auth.currentUser;
  }

  async register(email: string, password: string, name: string) {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);

    await setDoc(doc(this.firestore, 'users', credential.user.uid), {
      name: name,
      email: email,
      createdAt: new Date()
    });

    return credential;
  }

  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/auth']);
  }

  async getUserProfile(uid: string) {
    const docRef = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  }
}
