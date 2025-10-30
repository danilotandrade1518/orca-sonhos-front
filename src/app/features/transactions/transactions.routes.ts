import { Routes } from '@angular/router';

export const TRANSACTIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/transactions/transactions.page').then((m) => m.TransactionsPage),
  },
];
