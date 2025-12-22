import { Routes } from '@angular/router';
import { BudgetListPage } from './pages/budget-list/budget-list.page';
import { BudgetDetailPage } from './pages/budget-detail/budget-detail.page';
import { BudgetCreatePage } from './pages/budget-create/budget-create.page';
import { BudgetEditPage } from './pages/budget-edit/budget-edit.page';

export const BUDGET_ROUTES: Routes = [
  {
    path: '',
    component: BudgetListPage,
    title: 'Orçamentos',
  },
  {
    path: 'new',
    component: BudgetCreatePage,
    title: 'Novo Orçamento',
  },
  {
    path: ':id',
    component: BudgetDetailPage,
    title: 'Detalhes do Orçamento',
  },
  {
    path: ':id/edit',
    component: BudgetEditPage,
    title: 'Editar Orçamento',
  },
];
