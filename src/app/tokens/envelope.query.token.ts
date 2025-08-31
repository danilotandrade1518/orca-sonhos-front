import { InjectionToken } from '@angular/core';
import { IEnvelopeQueryPort } from '@application/ports/envelope/IEnvelopeQueryPort';

export const ENVELOPE_QUERY = new InjectionToken<IEnvelopeQueryPort>('ENVELOPE_QUERY');
