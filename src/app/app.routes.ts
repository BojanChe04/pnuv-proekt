import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Checkin } from './pages/checkin/checkin';
import { Dashboard } from './pages/dashboard/dashboard';
import { Stats } from './pages/stats/stats';
import { Challenges } from './pages/challenges/challenges';
import { Auth } from './pages/auth/auth';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'checkin', component: Checkin },
  { path: 'dashboard', component: Dashboard },
  { path: 'stats', component: Stats },
  { path: 'challenges', component: Challenges },
  { path: 'auth', component: Auth },
  { path: '**', redirectTo: '' }
];
