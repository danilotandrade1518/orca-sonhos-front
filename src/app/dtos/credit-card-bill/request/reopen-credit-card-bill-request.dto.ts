import { BaseRequestDto } from '@dtos/common';

export interface ReopenCreditCardBillRequestDto extends BaseRequestDto {
  userId: string;
  billId: string;
  reason?: string;
}
