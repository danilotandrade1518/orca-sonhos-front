import { delay, http, HttpResponse } from 'msw';

export const categoryHandlers = [
  http.post('/api/category/create-category', async () => {
    await delay(90);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/category/update-category', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
  http.post('/api/category/delete-category', async () => {
    await delay(80);
    return HttpResponse.json({ ok: true });
  }),
];
