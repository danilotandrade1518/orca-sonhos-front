import { BaseRequestDto } from '@dtos/common';

/**
 * DTO for creating a new transaction
 */
export interface CreateTransactionRequestDto extends BaseRequestDto {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
  budgetId?: string;
  accountId: string;
  date: Date;
  tags?: string[];
  notes?: string;
}
