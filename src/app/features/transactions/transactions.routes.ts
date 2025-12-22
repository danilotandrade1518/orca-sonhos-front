import { Routes } from '@angular/router';

export const TRANSACTIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/transactions/transactions.page').then((m) => m.TransactionsPage),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/transactions-create/transactions-create.page').then(
        (m) => m.TransactionsCreatePage
      ),
    title: 'Nova Transação',
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/transactions-edit/transactions-edit.page').then(
        (m) => m.TransactionsEditPage
      ),
    title: 'Editar Transação',
  },
];
