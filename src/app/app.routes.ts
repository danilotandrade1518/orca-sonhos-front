import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/components/dashboard-page/dashboard-page.component').then(
            (m) => m.DashboardPageComponent
          ),
        title: 'Dashboard - Orça Sonhos',
      },
      {
        path: 'budgets',
        loadComponent: () =>
          import('./features/budgets/components/budgets-page/budgets-page.component').then(
            (m) => m.BudgetsPageComponent
          ),
        title: 'Orçamentos - Orça Sonhos',
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import(
            './features/transactions/components/transactions-page/transactions-page.component'
          ).then((m) => m.TransactionsPageComponent),
        title: 'Transações - Orça Sonhos',
      },
      {
        path: 'goals',
        loadComponent: () =>
          import('./features/goals/components/goals-page/goals-page.component').then(
            (m) => m.GoalsPageComponent
          ),
        title: 'Metas - Orça Sonhos',
      },
      {
        path: 'accounts',
        loadComponent: () =>
          import('./features/accounts/components/accounts-page/accounts-page.component').then(
            (m) => m.AccountsPageComponent
          ),
        title: 'Contas - Orça Sonhos',
      },
      {
        path: 'credit-cards',
        loadComponent: () =>
          import(
            './features/credit-cards/components/credit-cards-page/credit-cards-page.component'
          ).then((m) => m.CreditCardsPageComponent),
        title: 'Cartões de Crédito - Orça Sonhos',
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/components/reports-page/reports-page.component').then(
            (m) => m.ReportsPageComponent
          ),
        title: 'Relatórios - Orça Sonhos',
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    children: [
      {
        path: 'onboarding',
        loadComponent: () =>
          import('./features/onboarding/components/onboarding-page/onboarding-page.component').then(
            (m) => m.OnboardingPageComponent
          ),
        title: 'Bem-vindo - Orça Sonhos',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];
