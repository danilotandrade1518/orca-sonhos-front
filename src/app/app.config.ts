import { FetchHttpClient } from '@adapters/http/FetchHttpClient';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpEnvelopeMutationsPort } from '@infra/http/envelope/HttpEnvelopeMutationsPort';
import { HttpEnvelopeQueriesPort } from '@infra/http/envelope/HttpEnvelopeQueriesPort';
import { HttpClient } from '@infra/http/HttpClient';

import { routes } from './app.routes';
import { AuthService } from './auth/auth.service';
import { ENV } from './env';
import { ENVELOPE_QUERY } from './tokens/envelope.query.token';
import { ENVELOPE_SERVICE } from './tokens/envelope.token';
import { HTTP_CLIENT } from './tokens/http-client.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.init().catch(() => undefined);
    }),
    {
      provide: HTTP_CLIENT,
      deps: [AuthService],
      useFactory: (auth: AuthService) =>
        new FetchHttpClient({
          baseUrl: ENV.API_BASE_URL,
          getAccessToken: () => auth.getAccessToken(),
        }),
    },
    {
      provide: ENVELOPE_SERVICE,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpEnvelopeMutationsPort(http),
    },
    {
      provide: ENVELOPE_QUERY,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpEnvelopeQueriesPort(http),
    },
  ],
};
