import { Uuid } from '@models/shared/value-objects/Uuid';
import { Money } from '@models/shared/value-objects/Money';

export interface CreateEnvelopeDTO {
  name: string;
  monthlyLimit: Money;
  budgetId: Uuid;
  categoryId: Uuid;
  userId: Uuid;
}

export interface UpdateEnvelopeDTO {
  envelopeId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
  name?: string;
  monthlyLimit?: Money;
}

export interface DeleteEnvelopeDTO {
  envelopeId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
}

export interface AddAmountEnvelopeDTO {
  envelopeId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
  amount: Money;
}

export interface RemoveAmountEnvelopeDTO {
  envelopeId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
  amount: Money;
}

export interface TransferBetweenEnvelopesDTO {
  sourceEnvelopeId: Uuid;
  targetEnvelopeId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
  amount: Money;
}

export interface IEnvelopeServicePort {
  createEnvelope(dto: CreateEnvelopeDTO): Promise<void>;
  updateEnvelope(dto: UpdateEnvelopeDTO): Promise<void>;
  deleteEnvelope(dto: DeleteEnvelopeDTO): Promise<void>;
  addAmount(dto: AddAmountEnvelopeDTO): Promise<void>;
  removeAmount(dto: RemoveAmountEnvelopeDTO): Promise<void>;
  transferBetweenEnvelopes(dto: TransferBetweenEnvelopesDTO): Promise<void>;
}
