import { TransactionType } from '@models/shared/enums/transaction-type';
import { MoneyDto } from '../../shared/money.dto';

export interface ListTransactionsQueryResponseDto {
  transactions: TransactionSummaryDto[];
  pagination: PaginationDto;
}

export interface TransactionSummaryDto {
  id: string;
  amount: MoneyDto;
  type: TransactionType;
  accountId: string;
  categoryId: string;
  description: string;
  executedAt: string;
  isRecurring: boolean;
  createdAt: string;
  accountName: string;
  categoryName: string;
}

export interface PaginationDto {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
