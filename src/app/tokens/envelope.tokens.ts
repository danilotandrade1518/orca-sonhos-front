import { InjectionToken } from '@angular/core';
import { IEnvelopeQueriesPort } from '@application/ports/envelope/IEnvelopeQueriesPort';

export const ENVELOPE_QUERIES = new InjectionToken<IEnvelopeQueriesPort>('ENVELOPE_QUERIES');
export const ENVELOPE_MUTATIONS = new InjectionToken('ENVELOPE_MUTATIONS');
