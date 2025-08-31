import {
  EnvelopeView,
  IEnvelopeQueryPort,
  ListEnvelopesQuery,
} from '@application/ports/envelope/IEnvelopeQueryPort';

import { HttpClient } from '../HttpClient';

export class HttpEnvelopeQueryAdapter implements IEnvelopeQueryPort {
  constructor(private readonly http: HttpClient) {}

  async listEnvelopes(q: ListEnvelopesQuery): Promise<EnvelopeView[]> {
    const params = new URLSearchParams({
      userId: q.userId.toString(),
      budgetId: q.budgetId.toString(),
    });
    return this.http.get<EnvelopeView[]>(`/envelope/list?${params.toString()}`);
  }
}
