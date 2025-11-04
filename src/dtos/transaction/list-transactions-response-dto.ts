import type { TransactionDto } from './transaction-types';

export interface ListTransactionsResponseDto {
  data: TransactionDto[];
  meta: {
    page: number;
    pageSize: number;
    hasNext: boolean;
  };
}
