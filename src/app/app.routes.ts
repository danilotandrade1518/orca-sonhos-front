import { Routes } from '@angular/router';

import { authGuard } from './auth/auth.guard';
import { HomePage } from './home.page.js';
import { DashboardPage } from './pages/dashboard/dashboard.page';

export const routes: Routes = [
  { path: '', canActivate: [authGuard], component: HomePage },
  { path: 'dashboard', canActivate: [authGuard], component: DashboardPage },
];
