import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// MSW setup for development
if (typeof window !== 'undefined') {
  import('./app/core/mocks/browser').then(({ worker }) => {
    worker
      .start({
        onUnhandledRequest: 'warn',
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      })
      .then(() => {
        console.log('MSW started successfully');
      })
      .catch((error) => {
        console.error('MSW failed to start:', error);
      });
  });
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
