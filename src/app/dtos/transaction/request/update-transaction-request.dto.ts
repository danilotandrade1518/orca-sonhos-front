import { BaseRequestDto } from '@dtos/common';

/**
 * DTO for updating an existing transaction
 */
export interface UpdateTransactionRequestDto extends BaseRequestDto {
  description?: string;
  amount?: number;
  type?: 'income' | 'expense';
  categoryId?: string;
  budgetId?: string;
  accountId?: string;
  date?: Date;
  tags?: string[];
  notes?: string;
}
