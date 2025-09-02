import { delay, http, HttpResponse } from 'msw';

export const accountHandlers = [
  http.post('/api/account/create-account', async () => {
    await delay(90);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/account/update-account', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/account/delete-account', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/account/reconcile-account', async () => {
    await delay(120);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/account/transfer-between-accounts', async () => {
    await delay(120);
    return HttpResponse.json({ ok: true });
  }),
];
