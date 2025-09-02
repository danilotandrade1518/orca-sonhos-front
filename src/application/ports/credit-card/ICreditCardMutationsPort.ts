import { Uuid } from '@models/shared/value-objects/Uuid';

export interface CreateCreditCardDTO {
  userId: Uuid;
  budgetId: Uuid;
  name: string;
}

export interface UpdateCreditCardDTO {
  creditCardId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
  name?: string;
}

export interface DeleteCreditCardDTO {
  creditCardId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
}

export interface ICreditCardMutationsPort {
  createCreditCard(dto: CreateCreditCardDTO): Promise<void>;
  updateCreditCard(dto: UpdateCreditCardDTO): Promise<void>;
  deleteCreditCard(dto: DeleteCreditCardDTO): Promise<void>;
}
