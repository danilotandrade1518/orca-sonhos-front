import { delay, http, HttpResponse } from 'msw';

export const creditCardBillHandlers = [
  http.post('/api/credit-card-bill/create-credit-card-bill', async () => {
    await delay(90);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/credit-card-bill/update-credit-card-bill', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/credit-card-bill/delete-credit-card-bill', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/credit-card-bill/pay-credit-card-bill', async () => {
    await delay(120);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/credit-card-bill/reopen-bill', async () => {
    await delay(120);
    return HttpResponse.json({ ok: true });
  }),
];
