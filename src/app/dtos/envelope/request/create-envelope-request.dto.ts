import { BaseRequestDto } from '@dtos/common';

export interface CreateEnvelopeRequestDto extends BaseRequestDto {
  userId: string;
  budgetId: string;
  name: string;
  amount: number;
  description?: string;
}
