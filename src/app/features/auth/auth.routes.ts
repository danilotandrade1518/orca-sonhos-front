import { Routes } from '@angular/router';

import { guestGuard } from '@core/guards/guest/guest.guard';
import { completeProfileGuard } from '@core/guards/complete-profile/complete-profile.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
    canActivate: [guestGuard],
  },
  {
    path: 'complete-profile',
    loadComponent: () =>
      import('./pages/register/complete-profile/complete-profile.page').then((m) => m.CompleteProfilePage),
    canActivate: [completeProfileGuard],
  },
];
