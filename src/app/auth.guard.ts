import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, filter, take } from 'rxjs/operators';

export const authGuard = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Promise(resolve => {
    auth.onAuthStateChanged(user => {
      console.log('onAuthStateChanged:', user);
      if (user) {
        resolve(true);
      } else {
        router.navigate(['/auth']);
        resolve(false);
      }
    });
  });
};
