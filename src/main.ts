import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// MSW setup for development
if (typeof window !== 'undefined') {
  import('./app/core/mocks/browser').then(({ worker }) => {
    worker.start({
      onUnhandledRequest: 'bypass',
    });
  });
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
