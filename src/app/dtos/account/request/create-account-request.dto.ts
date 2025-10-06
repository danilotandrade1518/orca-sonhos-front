import { BaseRequestDto } from '@dtos/common';

export interface CreateAccountRequestDto extends BaseRequestDto {
  userId: string;
  name: string;
  type: string;
  budgetId: string;
  initialBalance?: number;
  description?: string;
}
