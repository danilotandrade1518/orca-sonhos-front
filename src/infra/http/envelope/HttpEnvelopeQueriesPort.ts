import {
  EnvelopeView,
  IEnvelopeQueriesPort,
  ListEnvelopesQuery,
} from '@application/ports/envelope/IEnvelopeQueriesPort';

import { HttpClient } from '../HttpClient';

export class HttpEnvelopeQueriesPort implements IEnvelopeQueriesPort {
  constructor(private readonly http: HttpClient) {}

  async listEnvelopes(q: ListEnvelopesQuery): Promise<EnvelopeView[]> {
    const params = new URLSearchParams({
      userId: q.userId.toString(),
      budgetId: q.budgetId.toString(),
    });
    return this.http.get<EnvelopeView[]>(`/envelope/list?${params.toString()}`);
  }
}
