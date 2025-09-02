import {
  CancelScheduledTransactionDTO,
  CreateTransactionDTO,
  DeleteTransactionDTO,
  ITransactionMutationsPort,
  MarkTransactionLateDTO,
  UpdateTransactionDTO,
} from '@application/ports/transaction/ITransactionMutationsPort';
import { MoneyMapper } from '@models/shared/mappers/MoneyMapper';

import { HttpClient } from '../HttpClient';

export class HttpTransactionMutationsPort implements ITransactionMutationsPort {
  constructor(private readonly http: HttpClient) {}

  async createTransaction(dto: CreateTransactionDTO): Promise<void> {
    await this.http.post('/transaction/create-transaction', {
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      accountId: dto.accountId.toString(),
      categoryId: dto.categoryId.toString(),
      description: dto.description,
      amount: MoneyMapper.toApi(dto.amount),
      transactionDate: dto.transactionDate.toISOString(),
    });
  }

  async updateTransaction(dto: UpdateTransactionDTO): Promise<void> {
    await this.http.post('/transaction/update-transaction', {
      transactionId: dto.transactionId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      description: dto.description,
      amount: dto.amount ? MoneyMapper.toApi(dto.amount) : undefined,
      transactionDate: dto.transactionDate ? dto.transactionDate.toISOString() : undefined,
    });
  }

  async deleteTransaction(dto: DeleteTransactionDTO): Promise<void> {
    await this.http.post('/transaction/delete-transaction', {
      transactionId: dto.transactionId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
    });
  }

  async markTransactionLate(dto: MarkTransactionLateDTO): Promise<void> {
    await this.http.post('/transaction/mark-transaction-late', {
      transactionId: dto.transactionId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      lateDate: dto.lateDate.toISOString(),
    });
  }

  async cancelScheduledTransaction(dto: CancelScheduledTransactionDTO): Promise<void> {
    await this.http.post('/transaction/cancel-scheduled-transaction', {
      transactionId: dto.transactionId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
    });
  }
}
