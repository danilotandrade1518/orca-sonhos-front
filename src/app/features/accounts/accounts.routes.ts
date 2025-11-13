import { Routes } from '@angular/router';

export const ACCOUNTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/accounts/accounts.page').then((m) => m.AccountsPage),
    title: 'Contas',
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/accounts/accounts.page').then((m) => m.AccountsPage),
    title: 'Nova Conta',
    data: { modalMode: 'create' },
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/account-detail/account-detail.page').then((m) => m.AccountDetailPage),
    title: 'Detalhes da Conta',
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/account-detail/account-detail.page').then((m) => m.AccountDetailPage),
    title: 'Editar Conta',
    data: { modalMode: 'edit' },
  },
];
