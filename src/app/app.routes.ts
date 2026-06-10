import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CheckinComponent } from './pages/checkin/checkin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StatsComponent } from './pages/stats/stats.component';
import { ChallengesComponent } from './pages/challenges/challenges.component';
import { AuthComponent } from './pages/auth/auth.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'checkin', component: CheckinComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'challenges', component: ChallengesComponent },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: '' }
];
