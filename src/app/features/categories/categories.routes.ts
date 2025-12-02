import { Routes } from '@angular/router';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/categories-page/categories-page.component').then((m) => m.CategoriesPage),
    title: 'Categorias',
  },
];


