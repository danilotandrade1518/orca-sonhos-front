import { FetchHttpClient } from '@adapters/http/FetchHttpClient';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpAccountMutationsPort } from '@infra/http/account/HttpAccountMutationsPort';
import { HttpBudgetMutationsPort } from '@infra/http/budget/HttpBudgetMutationsPort';
import { HttpCategoryMutationsPort } from '@infra/http/category/HttpCategoryMutationsPort';
import { HttpCreditCardBillMutationsPort } from '@infra/http/credit-card-bill/HttpCreditCardBillMutationsPort';
import { HttpCreditCardMutationsPort } from '@infra/http/credit-card/HttpCreditCardMutationsPort';
import { HttpEnvelopeMutationsPort } from '@infra/http/envelope/HttpEnvelopeMutationsPort';
import { HttpEnvelopeQueriesPort } from '@infra/http/envelope/HttpEnvelopeQueriesPort';
import { HttpGoalMutationsPort } from '@infra/http/goal/HttpGoalMutationsPort';
import { HttpClient } from '@infra/http/HttpClient';
import { HttpTransactionMutationsPort } from '@infra/http/transaction/HttpTransactionMutationsPort';

import { routes } from './app.routes';
import { AuthService } from './auth/auth.service';
import { ENV } from './env';
import { ACCOUNT_MUTATIONS } from './tokens/account.tokens';
import { BUDGET_MUTATIONS } from './tokens/budget.tokens';
import { CATEGORY_MUTATIONS } from './tokens/category.tokens';
import { CREDIT_CARD_BILL_MUTATIONS } from './tokens/credit-card-bill.tokens';
import { CREDIT_CARD_MUTATIONS } from './tokens/credit-card.tokens';
import { ENVELOPE_MUTATIONS, ENVELOPE_QUERIES } from './tokens/envelope.tokens';
import { GOAL_MUTATIONS } from './tokens/goal.tokens';
import { HTTP_CLIENT } from './tokens/http-client.tokens';
import { TRANSACTION_MUTATIONS } from './tokens/transaction.tokens';

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
      provide: BUDGET_MUTATIONS,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpBudgetMutationsPort(http),
    },
    {
      provide: ACCOUNT_MUTATIONS,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpAccountMutationsPort(http),
    },
    {
      provide: CATEGORY_MUTATIONS,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpCategoryMutationsPort(http),
    },
    {
      provide: CREDIT_CARD_MUTATIONS,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpCreditCardMutationsPort(http),
    },
    {
      provide: CREDIT_CARD_BILL_MUTATIONS,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpCreditCardBillMutationsPort(http),
    },
    {
      provide: GOAL_MUTATIONS,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpGoalMutationsPort(http),
    },
    {
      provide: TRANSACTION_MUTATIONS,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpTransactionMutationsPort(http),
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
