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
    path: 'bills/:id/pay',
    loadComponent: () =>
      import('./pages/pay-bill/pay-bill.page').then((m) => m.PayBillPage),
    title: 'Pagar Fatura',
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/credit-card-detail/credit-card-detail.page').then(
        (m) => m.CreditCardDetailPage
      ),
    title: 'Detalhes do Cartão de Crédito',
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/credit-card-detail/credit-card-detail.page').then(
        (m) => m.CreditCardDetailPage
      ),
    title: 'Editar Cartão',
    data: { modalMode: 'edit' },
  },
];
