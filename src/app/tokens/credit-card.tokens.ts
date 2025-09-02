import { InjectionToken } from '@angular/core';
import { ICreditCardMutationsPort } from '@application/ports/credit-card/ICreditCardMutationsPort';

export const CREDIT_CARD_MUTATIONS = new InjectionToken<ICreditCardMutationsPort>(
  'CREDIT_CARD_MUTATIONS'
);
