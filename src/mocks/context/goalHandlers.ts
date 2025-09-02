import { delay, http, HttpResponse } from 'msw';

export const goalHandlers = [
  http.post('/api/goal/create-goal', async () => {
    await delay(90);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/goal/update-goal', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/goal/delete-goal', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/goal/add-amount-to-goal', async () => {
    await delay(120);
    return HttpResponse.json({ ok: true });
  }),
];
