import { BaseRequestDto } from '@dtos/common';

export interface TransferBetweenEnvelopesRequestDto extends BaseRequestDto {
  userId: string;
  fromEnvelopeId: string;
  toEnvelopeId: string;
  amount: number;
  description?: string;
}
