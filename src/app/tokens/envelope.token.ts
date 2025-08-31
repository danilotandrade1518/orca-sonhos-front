import { InjectionToken } from '@angular/core';
import type { IEnvelopeServicePort } from '@application/ports/envelope/IEnvelopeServicePort';

export const ENVELOPE_SERVICE = new InjectionToken<IEnvelopeServicePort>('ENVELOPE_SERVICE');
