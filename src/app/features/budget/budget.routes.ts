import { Routes } from '@angular/router';
import { BudgetListPage } from './pages/budget-list/budget-list.page';
import { BudgetDetailPage } from './pages/budget-detail/budget-detail.page';

export const BUDGET_ROUTES: Routes = [
  {
    path: '',
    component: BudgetListPage,
    title: 'Orçamentos',
  },
  {
    path: 'new',
    component: BudgetListPage,
    title: 'Novo Orçamento',
    data: { modalMode: 'create' },
  },
  {
    path: ':id',
    component: BudgetDetailPage,
    title: 'Detalhes do Orçamento',
  },
  {
    path: ':id/edit',
    component: BudgetDetailPage,
    title: 'Editar Orçamento',
    data: { modalMode: 'edit' },
  },
];
