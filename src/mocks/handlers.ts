import { accountHandlers } from './context/accountHandlers';
import { budgetHandlers } from './context/budgetHandlers';
import { categoryHandlers } from './context/categoryHandlers';
import { creditCardBillHandlers } from './context/creditCardBillHandlers';
import { creditCardHandlers } from './context/creditCardHandlers';
import { envelopeHandlers } from './context/envelopeHandlers';
import { goalHandlers } from './context/goalHandlers';
import { testHandlers } from './context/testHandlers';
import { transactionHandlers } from './context/transactionHandlers';

export const handlers = [
  ...envelopeHandlers,
  ...budgetHandlers,
  ...accountHandlers,
  ...categoryHandlers,
  ...creditCardHandlers,
  ...creditCardBillHandlers,
  ...goalHandlers,
  ...transactionHandlers,
  ...testHandlers,
];
