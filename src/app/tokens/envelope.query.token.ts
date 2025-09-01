import { InjectionToken } from '@angular/core';
import { IEnvelopeQueriesPort } from '@application/ports/envelope/IEnvelopeQueriesPort';

export const ENVELOPE_QUERY = new InjectionToken<IEnvelopeQueriesPort>('ENVELOPE_QUERY');
