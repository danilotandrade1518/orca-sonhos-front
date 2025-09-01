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
import { ENVELOPE_MUTATIONS, ENVELOPE_QUERIES } from './tokens/envelope.tokens';
import { HTTP_CLIENT } from './tokens/http-client.tokens';

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
      provide: ENVELOPE_MUTATIONS,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpEnvelopeMutationsPort(http),
    },
    {
      provide: ENVELOPE_QUERIES,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpEnvelopeQueriesPort(http),
    },
  ],
};
