import { Routes } from '@angular/router';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/categories-page/categories-page.component').then((m) => m.CategoriesPage),
    title: 'Categorias',
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/categories-create/categories-create.page').then(
        (m) => m.CategoriesCreatePage
      ),
    title: 'Nova Categoria',
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/categories-edit/categories-edit.page').then((m) => m.CategoriesEditPage),
    title: 'Editar Categoria',
  },
];
