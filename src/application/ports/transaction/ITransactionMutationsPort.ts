import { Money } from '@models/shared/value-objects/Money';
import { Uuid } from '@models/shared/value-objects/Uuid';

export interface CreateTransactionDTO {
  userId: Uuid;
  budgetId: Uuid;
  accountId: Uuid;
  categoryId: Uuid;
  description: string;
  amount: Money;
  transactionDate: Date;
}

export interface UpdateTransactionDTO {
  transactionId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
  description?: string;
  amount?: Money;
  transactionDate?: Date;
}

export interface DeleteTransactionDTO {
  transactionId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
}

export interface MarkTransactionLateDTO {
  transactionId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
  lateDate: Date;
}

export interface CancelScheduledTransactionDTO {
  transactionId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
}

export interface ITransactionMutationsPort {
  createTransaction(dto: CreateTransactionDTO): Promise<void>;
  updateTransaction(dto: UpdateTransactionDTO): Promise<void>;
  deleteTransaction(dto: DeleteTransactionDTO): Promise<void>;
  markTransactionLate(dto: MarkTransactionLateDTO): Promise<void>;
  cancelScheduledTransaction(dto: CancelScheduledTransactionDTO): Promise<void>;
}
