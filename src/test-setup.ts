// Test setup: start MSW worker in Karma before specs run
// This file is referenced as a polyfill in angular.json test options.

import { ENV } from './app/env';

(async () => {
  if (ENV.MSW_ENABLED) {
    const { worker } = await import('./mocks/browser');
    // In Karma, base href is '/', so worker script will be served from '/mockServiceWorker.js'
    await worker.start({ serviceWorker: { url: '/mockServiceWorker.js' } });
  }
})();
