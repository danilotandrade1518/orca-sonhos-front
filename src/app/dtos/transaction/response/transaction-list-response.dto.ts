import { PaginatedResponseDto } from '../../common';
import { TransactionResponseDto } from './transaction-response.dto';

/**
 * DTO for transaction list response
 */
export interface TransactionListResponseDto extends PaginatedResponseDto<TransactionResponseDto> {
  readonly _type: 'transaction-list';
}

/**
 * DTO for transaction summary response
 */
export interface TransactionSummaryResponseDto {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
  period: {
    startDate: Date;
    endDate: Date;
  };
}
