import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Checkin } from './pages/checkin/checkin';
import { Dashboard } from './pages/dashboard/dashboard';
import { StatsComponent } from './pages/stats/stats';
import { Challenges } from './pages/challenges/challenges';
import { AuthComponent } from './pages/auth/auth';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'checkin', component: Checkin },
  { path: 'dashboard', component: Dashboard },
  { path: 'stats', component: StatsComponent },
  { path: 'challenges', component: Challenges },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: '' }
];
