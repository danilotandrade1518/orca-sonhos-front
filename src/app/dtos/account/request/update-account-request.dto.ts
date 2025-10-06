import { BaseRequestDto } from '@dtos/common';

export interface UpdateAccountRequestDto extends BaseRequestDto {
  userId: string;
  accountId: string;
  name?: string;
  type?: string;
  budgetId?: string;
  description?: string;
}
