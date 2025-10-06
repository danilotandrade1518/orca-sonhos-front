import { BaseRequestDto } from '@dtos/common';

export interface TransferBetweenAccountsRequestDto extends BaseRequestDto {
  userId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
}
