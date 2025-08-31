import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpEnvelopeQueryAdapter } from '@infra/http/envelope/HttpEnvelopeQueryAdapter';
import { HttpEnvelopeServiceAdapter } from '@infra/http/envelope/HttpEnvelopeServiceAdapter';
import { HttpClient } from '@infra/http/HttpClient';

import { routes } from './app.routes';
import { AuthService } from './auth/auth.service';
import { ENV } from './env';
import { ENVELOPE_QUERY } from './tokens/envelope.query.token';
import { ENVELOPE_SERVICE } from './tokens/envelope.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    // Init Firebase Auth on app bootstrap
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.init().catch(() => undefined);
    }),
    // Provide a shared HttpClient configured with API base and token getter
    {
      provide: HttpClient,
      deps: [AuthService],
      useFactory: (auth: AuthService) =>
        new HttpClient({
          baseUrl: ENV.API_BASE_URL,
          getAccessToken: () => auth.getAccessToken(),
        }),
    },
    // Example: bind envelope port to HTTP adapter using factory (no reflection needed)
    {
      provide: ENVELOPE_SERVICE,
      deps: [HttpClient],
      useFactory: (http: HttpClient) => new HttpEnvelopeServiceAdapter(http),
    },
    {
      provide: ENVELOPE_QUERY,
      deps: [HttpClient],
      useFactory: (http: HttpClient) => new HttpEnvelopeQueryAdapter(http),
    },
  ],
};
