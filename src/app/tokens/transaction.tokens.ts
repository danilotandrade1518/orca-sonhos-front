import { InjectionToken } from '@angular/core';
import { ITransactionMutationsPort } from '@application/ports/transaction/ITransactionMutationsPort';

export const TRANSACTION_MUTATIONS = new InjectionToken<ITransactionMutationsPort>(
  'TRANSACTION_MUTATIONS'
);
