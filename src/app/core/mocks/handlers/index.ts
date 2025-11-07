// MSW handlers for development
// This file will be populated with handlers for all 30+ endpoints

import { authHandlers } from './auth.handlers';
import { budgetHandlers } from './budgets.handlers';
import { accountHandlers } from './accounts.handlers';
import { transactionHandlers } from './transactions.handlers';
import { goalHandlers } from './goals.handlers';
import { categoryHandlers } from './categories.handlers';
import { envelopeHandlers } from './envelopes.handlers';
import { creditCardHandlers } from './credit-cards.handlers';
import { sharingHandlers } from './sharing.handlers';

export const handlers = [
  ...authHandlers,
  ...budgetHandlers,
  ...accountHandlers,
  ...transactionHandlers,
  ...goalHandlers,
  ...categoryHandlers,
  ...envelopeHandlers,
  ...creditCardHandlers,
  ...sharingHandlers,
];
