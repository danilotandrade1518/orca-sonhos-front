import { setupWorker } from 'msw/browser';
import { http } from 'msw';

import { handlers } from './handlers';

// Simple request log for tests (Karma) to assert what was called
const requestLog: Array<{ method: string; url: string; body?: any }> = [];
export const getRequestLog = () => requestLog;

// Probe handler to reset/inspect from tests if needed
const testProbeHandlers = [
  http.post('/__msw_test__/reset', () => {
    requestLog.length = 0;
    return new Response(null, { status: 204 });
  }),
];

// Wrap all handlers to push to log
const tracedHandlers = handlers.map((h: any) => {
  // Only wrap http.[get|post|...] handlers; they expose a .resolver
  return new Proxy(h, {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver);
    },
    apply(target: any, thisArg: any, argArray?: any): any {
      return target.apply(thisArg, argArray);
    },
  });
});

export const worker = setupWorker(...tracedHandlers, ...testProbeHandlers);
