import { delay, http, HttpResponse } from 'msw';

export const creditCardHandlers = [
  http.post('/api/credit-card/create-credit-card', async () => {
    await delay(90);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/credit-card/update-credit-card', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/credit-card/delete-credit-card', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
];
