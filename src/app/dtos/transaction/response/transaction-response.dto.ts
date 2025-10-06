import { BaseResponseDto } from '@dtos/common';

/**
 * DTO for transaction response
 */
export interface TransactionResponseDto extends BaseResponseDto {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  categoryName: string;
  budgetId?: string;
  budgetName?: string;
  accountId: string;
  accountName: string;
  date: Date;
  tags: string[];
  notes?: string;
}
