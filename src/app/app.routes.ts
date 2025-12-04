import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'register',
    redirectTo: '/auth',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/app-layout.component').then((m) => m.AppLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard.page').then(
            (m) => m.DashboardPage
          ),
      },
      {
        path: 'budgets',
        loadChildren: () => import('./features/budget/budget.routes').then((m) => m.BUDGET_ROUTES),
      },
      {
        path: 'transactions',
        loadChildren: () =>
          import('./features/transactions/transactions.routes').then((m) => m.TRANSACTIONS_ROUTES),
      },
      {
        path: 'goals',
        loadChildren: () => import('./features/goals/goals.routes').then((m) => m.GOALS_ROUTES),
      },
      {
        path: 'accounts',
        loadChildren: () => import('./features/accounts/accounts.routes').then((m) => m.ACCOUNTS_ROUTES),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./features/categories/categories.routes').then((m) => m.CATEGORIES_ROUTES),
      },
      {
        path: 'envelopes',
        loadChildren: () =>
          import('./features/envelopes/envelopes.routes').then((m) => m.ENVELOPES_ROUTES),
      },
      {
        path: 'credit-cards',
        loadChildren: () =>
          import('./features/credit-cards/credit-cards.routes').then((m) => m.CREDIT_CARDS_ROUTES),
      },
      {
        path: 'reports',
        loadChildren: () => import('./features/reports/reports.routes').then((m) => m.REPORTS_ROUTES),
      },
    ],
  },
];
