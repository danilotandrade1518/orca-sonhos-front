import { Money } from '@models/shared/value-objects/Money';
import { Uuid } from '@models/shared/value-objects/Uuid';

export interface CreateAccountDTO {
  userId: Uuid;
  budgetId: Uuid;
  name: string;
}

export interface UpdateAccountDTO {
  accountId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
  name?: string;
}

export interface DeleteAccountDTO {
  accountId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
}

export interface ReconcileAccountDTO {
  accountId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
  balance: Money;
  statementDate: Date;
}

export interface TransferBetweenAccountsDTO {
  sourceAccountId: Uuid;
  targetAccountId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
  amount: Money;
}

export interface IAccountMutationsPort {
  createAccount(dto: CreateAccountDTO): Promise<void>;
  updateAccount(dto: UpdateAccountDTO): Promise<void>;
  deleteAccount(dto: DeleteAccountDTO): Promise<void>;
  reconcileAccount(dto: ReconcileAccountDTO): Promise<void>;
  transferBetweenAccounts(dto: TransferBetweenAccountsDTO): Promise<void>;
}
