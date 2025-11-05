import { Routes } from '@angular/router';

export const GOALS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/goals/goals.page').then((m) => m.GoalsPage),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/goals-new/goals-new.page').then((m) => m.GoalsNewPage),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/goal-detail/goal-detail.page').then((m) => m.GoalDetailPage),
  },
];
