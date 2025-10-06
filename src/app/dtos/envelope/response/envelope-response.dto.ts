import { BaseResponseDto } from '@dtos/common';

export interface EnvelopeResponseDto extends BaseResponseDto {
  name: string;
  budgetId: string;
  amount: number;
  description?: string;
}
