import { envelopeHandlers } from './context/envelopeHandlers';
import { testHandlers } from './context/testHandlers';

export const handlers = [...envelopeHandlers, ...testHandlers];
