import { BaseRequestDto } from '@dtos/common';

export interface ReconcileAccountRequestDto extends BaseRequestDto {
  userId: string;
  accountId: string;
  reconciledBalance: number;
}
