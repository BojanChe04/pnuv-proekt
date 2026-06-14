import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Checkin } from './pages/checkin/checkin';
import { Dashboard } from './pages/dashboard/dashboard';
import { StatsComponent } from './pages/stats/stats';
import { Challenges } from './pages/challenges/challenges';
import { AuthComponent } from './pages/auth/auth';
import { About } from './pages/about/about';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'checkin', component: Checkin },
  { path: 'dashboard', component: Dashboard },
  { path: 'stats', component: StatsComponent },
  { path: 'challenges', component: Challenges, canActivate: [authGuard] },
  { path: 'auth', component: AuthComponent },
  { path: 'about', component: About },
  { path: '**', redirectTo: '' }
];
