import { Routes } from '@angular/router';

export const CREDIT_CARDS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/credit-cards/credit-cards.page').then((m) => m.CreditCardsPage),
    title: 'Cartões de Crédito',
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/credit-cards/credit-cards.page').then((m) => m.CreditCardsPage),
    title: 'Novo Cartão',
    data: { modalMode: 'create' },
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/credit-cards/credit-cards.page').then((m) => m.CreditCardsPage),
    title: 'Editar Cartão',
    data: { modalMode: 'edit' },
  },
];
