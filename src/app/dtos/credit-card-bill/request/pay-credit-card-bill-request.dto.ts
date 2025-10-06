import { BaseRequestDto } from '@dtos/common';

export interface PayCreditCardBillRequestDto extends BaseRequestDto {
  userId: string;
  billId: string;
  amount: number;
  paymentDate: Date;
  description?: string;
}
