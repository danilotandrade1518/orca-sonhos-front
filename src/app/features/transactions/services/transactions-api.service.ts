import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api/api.service';
import type {
  CreateTransactionRequestDto,
  CreateTransactionResponseDto,
  DeleteTransactionRequestDto,
  DeleteTransactionResponseDto,
  ListTransactionsResponseDto,
  UpdateTransactionRequestDto,
  UpdateTransactionResponseDto,
} from '../../../../dtos/transaction';

export interface ListTransactionsParams {
  budgetId: string;
  page?: number;
  pageSize?: number;
  accountId?: string;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
}

@Injectable({ providedIn: 'root' })
export class TransactionsApiService {
  private readonly api = inject(ApiService);

  list(params: ListTransactionsParams) {
    const query = new URLSearchParams();
    query.set('budgetId', params.budgetId);
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    if (params.accountId) query.set('accountId', params.accountId);
    if (params.categoryId) query.set('categoryId', params.categoryId);
    if (params.dateFrom) query.set('dateFrom', params.dateFrom);
    if (params.dateTo) query.set('dateTo', params.dateTo);

    return this.api.get<ListTransactionsResponseDto>(`transactions?${query.toString()}`);
  }

  create(body: CreateTransactionRequestDto) {
    return this.api.post<CreateTransactionResponseDto>('transaction/create-transaction', body);
  }

  update(body: UpdateTransactionRequestDto) {
    return this.api.post<UpdateTransactionResponseDto>('transaction/update-transaction', body);
  }

  delete(body: DeleteTransactionRequestDto) {
    return this.api.post<DeleteTransactionResponseDto>('transaction/delete-transaction', body);
  }

  cancelScheduled(body: {
    userId: string;
    budgetId: string;
    transactionId: string;
    cancellationReason: string;
  }) {
    return this.api.post<UpdateTransactionResponseDto>(
      'transaction/cancel-scheduled-transaction',
      body
    );
  }

  markLate(body: { transactionId: string }) {
    return this.api.post<UpdateTransactionResponseDto>('transaction/mark-transaction-late', body);
  }
}
