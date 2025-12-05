import { Routes } from '@angular/router';

export const ENVELOPES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/envelopes/envelopes.page').then((m) => m.EnvelopesPage),
    title: 'Envelopes',
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/envelope-form/envelope-form.page').then((m) => m.EnvelopeFormPage),
    title: 'Novo Envelope',
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/envelope-form/envelope-form.page').then((m) => m.EnvelopeFormPage),
    title: 'Editar Envelope',
  },
];
