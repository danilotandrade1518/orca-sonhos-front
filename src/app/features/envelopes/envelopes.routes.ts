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
      import('./pages/envelopes/envelopes.page').then((m) => m.EnvelopesPage),
    title: 'Novo Envelope',
    data: { modalMode: 'create' },
  },
];

