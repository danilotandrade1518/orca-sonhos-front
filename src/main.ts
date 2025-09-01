import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { ENV } from './app/env';

async function enableMocksIfNeeded() {
  const shouldMock = ENV.MSW_ENABLED === true;
  if (!shouldMock) return;
  const { worker } = await import('./mocks/browser');
  await worker.start({ serviceWorker: { url: '/mockServiceWorker.js' } });
}

enableMocksIfNeeded()
  .then(() => bootstrapApplication(App, appConfig))
  .catch((err) => console.error(err));
