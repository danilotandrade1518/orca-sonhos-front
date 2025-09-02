import {
  CreateAccountDTO,
  DeleteAccountDTO,
  IAccountMutationsPort,
  ReconcileAccountDTO,
  TransferBetweenAccountsDTO,
  UpdateAccountDTO,
} from '@application/ports/account/IAccountMutationsPort';
import { MoneyMapper } from '@models/shared/mappers/MoneyMapper';

import { HttpClient } from '../HttpClient';

export class HttpAccountMutationsPort implements IAccountMutationsPort {
  constructor(private readonly http: HttpClient) {}

  async createAccount(dto: CreateAccountDTO): Promise<void> {
    await this.http.post('/account/create-account', {
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      name: dto.name,
    });
  }

  async updateAccount(dto: UpdateAccountDTO): Promise<void> {
    await this.http.post('/account/update-account', {
      accountId: dto.accountId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      name: dto.name,
    });
  }

  async deleteAccount(dto: DeleteAccountDTO): Promise<void> {
    await this.http.post('/account/delete-account', {
      accountId: dto.accountId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
    });
  }

  async reconcileAccount(dto: ReconcileAccountDTO): Promise<void> {
    await this.http.post('/account/reconcile-account', {
      accountId: dto.accountId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      balance: MoneyMapper.toApi(dto.balance),
      statementDate: dto.statementDate.toISOString(),
    });
  }

  async transferBetweenAccounts(dto: TransferBetweenAccountsDTO): Promise<void> {
    await this.http.post('/account/transfer-between-accounts', {
      sourceAccountId: dto.sourceAccountId.toString(),
      targetAccountId: dto.targetAccountId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      amount: MoneyMapper.toApi(dto.amount),
    });
  }
}
