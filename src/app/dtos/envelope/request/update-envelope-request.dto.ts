import { BaseRequestDto } from '@dtos/common';

export interface UpdateEnvelopeRequestDto extends BaseRequestDto {
  userId: string;
  envelopeId: string;
  budgetId?: string;
  name?: string;
  amount?: number;
  description?: string;
}
