import { TransactionType } from '@models/shared/enums/transaction-type';
import { MoneyDto } from '../../shared/money.dto';

export interface GetTransactionByIdQueryResponseDto {
  transaction: TransactionDetailDto;
}

export interface TransactionDetailDto {
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
  budgetId: string;
  isLate: boolean;
  lateDate?: string;
}
