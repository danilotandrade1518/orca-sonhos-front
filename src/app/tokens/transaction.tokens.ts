import { InjectionToken } from '@angular/core';
import { ITransactionMutationsPort } from '@application/ports/transaction/ITransactionMutationsPort';
import { ITransactionQueriesPort } from '@application/ports/transaction/ITransactionQueriesPort';

export const TRANSACTION_MUTATIONS = new InjectionToken<ITransactionMutationsPort>(
  'TRANSACTION_MUTATIONS'
);
export const TRANSACTION_QUERIES = new InjectionToken<ITransactionQueriesPort>(
  'TRANSACTION_QUERIES'
);
