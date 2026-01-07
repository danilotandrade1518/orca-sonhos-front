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
      import('./pages/credit-cards-create/credit-cards-create.page').then(
        (m) => m.CreditCardsCreatePage
      ),
    title: 'Novo Cartão',
  },
  {
    path: 'bills/new',
    loadComponent: () =>
      import('./pages/credit-card-bills-create/credit-card-bills-create.page').then(
        (m) => m.CreditCardBillsCreatePage
      ),
    title: 'Nova Fatura',
  },
  {
    path: 'bills/:id/pay',
    loadComponent: () => import('./pages/pay-bill/pay-bill.page').then((m) => m.PayBillPage),
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
      import('./pages/credit-cards-edit/credit-cards-edit.page').then((m) => m.CreditCardsEditPage),
    title: 'Editar Cartão',
  },
];
