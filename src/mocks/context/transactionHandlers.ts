import { delay, http, HttpResponse } from 'msw';

export const transactionHandlers = [
  http.post('/api/transaction/create-transaction', async () => {
    await delay(90);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/transaction/update-transaction', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/transaction/delete-transaction', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/transaction/mark-transaction-late', async () => {
    await delay(120);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/transaction/cancel-scheduled-transaction', async () => {
    await delay(120);
    return HttpResponse.json({ ok: true });
  }),
];
