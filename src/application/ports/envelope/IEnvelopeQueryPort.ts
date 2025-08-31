import { Uuid } from '@models/shared/value-objects/Uuid';

export interface EnvelopeView {
  id: string;
  budgetId: string;
  categoryId: string;
  name: string;
  monthlyLimit: number; // in cents
  balance: number; // in cents
}

export interface ListEnvelopesQuery {
  userId: Uuid;
  budgetId: Uuid;
}

export interface IEnvelopeQueryPort {
  listEnvelopes(q: ListEnvelopesQuery): Promise<EnvelopeView[]>;
}
