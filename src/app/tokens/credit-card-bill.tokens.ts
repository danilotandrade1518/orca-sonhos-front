import { InjectionToken } from '@angular/core';
import { ICreditCardBillMutationsPort } from '@application/ports/credit-card-bill/ICreditCardBillMutationsPort';

export const CREDIT_CARD_BILL_MUTATIONS = new InjectionToken<ICreditCardBillMutationsPort>(
  'CREDIT_CARD_BILL_MUTATIONS'
);
