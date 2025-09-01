import { envelopeHandlers } from './context/envelopeHandlers';
import { budgetHandlers } from './context/budgetHandlers';
import { testHandlers } from './context/testHandlers';

export const handlers = [...envelopeHandlers, ...budgetHandlers, ...testHandlers];
