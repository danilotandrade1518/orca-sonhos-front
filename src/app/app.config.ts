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
import { HttpAccountQueriesPort } from '@infra/http/account/HttpAccountQueriesPort';
import { HttpBudgetMutationsPort } from '@infra/http/budget/HttpBudgetMutationsPort';
import { HttpBudgetQueriesPort } from '@infra/http/budget/HttpBudgetQueriesPort';
import { HttpCategoryMutationsPort } from '@infra/http/category/HttpCategoryMutationsPort';
import { HttpCategoryQueriesPort } from '@infra/http/category/HttpCategoryQueriesPort';
import { HttpCreditCardBillMutationsPort } from '@infra/http/credit-card-bill/HttpCreditCardBillMutationsPort';
import { HttpCreditCardMutationsPort } from '@infra/http/credit-card/HttpCreditCardMutationsPort';
import { HttpEnvelopeMutationsPort } from '@infra/http/envelope/HttpEnvelopeMutationsPort';
import { HttpEnvelopeQueriesPort } from '@infra/http/envelope/HttpEnvelopeQueriesPort';
import { HttpGoalMutationsPort } from '@infra/http/goal/HttpGoalMutationsPort';
import { HttpGoalQueriesPort } from '@infra/http/goal/HttpGoalQueriesPort';
import { HttpClient } from '@infra/http/HttpClient';
import { HttpTransactionMutationsPort } from '@infra/http/transaction/HttpTransactionMutationsPort';
import { HttpTransactionQueriesPort } from '@infra/http/transaction/HttpTransactionQueriesPort';

import { routes } from './app.routes';
import { AuthService } from './auth/auth.service';
import { ENV } from './env';
import { ACCOUNT_MUTATIONS, ACCOUNT_QUERIES } from './tokens/account.tokens';
import { BUDGET_MUTATIONS, BUDGET_QUERIES } from './tokens/budget.tokens';
import { CATEGORY_MUTATIONS, CATEGORY_QUERIES } from './tokens/category.tokens';
import { CREDIT_CARD_BILL_MUTATIONS } from './tokens/credit-card-bill.tokens';
import { CREDIT_CARD_MUTATIONS } from './tokens/credit-card.tokens';
import { ENVELOPE_MUTATIONS, ENVELOPE_QUERIES } from './tokens/envelope.tokens';
import { GOAL_MUTATIONS, GOAL_QUERIES } from './tokens/goal.tokens';
import { HTTP_CLIENT } from './tokens/http-client.tokens';
import { TRANSACTION_MUTATIONS, TRANSACTION_QUERIES } from './tokens/transaction.tokens';

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
      provide: BUDGET_QUERIES,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpBudgetQueriesPort(http),
    },
    {
      provide: ACCOUNT_MUTATIONS,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpAccountMutationsPort(http),
    },
    {
      provide: ACCOUNT_QUERIES,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpAccountQueriesPort(http),
    },
    {
      provide: CATEGORY_MUTATIONS,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpCategoryMutationsPort(http),
    },
    {
      provide: CATEGORY_QUERIES,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpCategoryQueriesPort(http),
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
      provide: GOAL_QUERIES,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpGoalQueriesPort(http),
    },
    {
      provide: TRANSACTION_MUTATIONS,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpTransactionMutationsPort(http),
    },
    {
      provide: TRANSACTION_QUERIES,
      deps: [HTTP_CLIENT],
      useFactory: (http: HttpClient) => new HttpTransactionQueriesPort(http),
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
