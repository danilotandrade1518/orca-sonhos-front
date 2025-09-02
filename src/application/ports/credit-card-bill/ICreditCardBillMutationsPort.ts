import { Money } from '@models/shared/value-objects/Money';
import { Uuid } from '@models/shared/value-objects/Uuid';

export interface CreateCreditCardBillDTO {
  userId: Uuid;
  budgetId: Uuid;
  creditCardId: Uuid;
  dueDate: Date;
}

export interface UpdateCreditCardBillDTO {
  creditCardBillId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
  dueDate?: Date;
}

export interface DeleteCreditCardBillDTO {
  creditCardBillId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
}

export interface PayCreditCardBillDTO {
  creditCardBillId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
  amount: Money;
}

export interface ReopenCreditCardBillDTO {
  creditCardBillId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
}

export interface ICreditCardBillMutationsPort {
  createCreditCardBill(dto: CreateCreditCardBillDTO): Promise<void>;
  updateCreditCardBill(dto: UpdateCreditCardBillDTO): Promise<void>;
  deleteCreditCardBill(dto: DeleteCreditCardBillDTO): Promise<void>;
  payCreditCardBill(dto: PayCreditCardBillDTO): Promise<void>;
  reopenCreditCardBill(dto: ReopenCreditCardBillDTO): Promise<void>;
}
