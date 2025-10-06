import { BaseRequestDto } from '@dtos/common';

export interface AddAmountToEnvelopeRequestDto extends BaseRequestDto {
  userId: string;
  envelopeId: string;
  amount: number;
  description?: string;
}
