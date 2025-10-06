import { BaseRequestDto } from '@dtos/common';

export interface UpdateCreditCardBillRequestDto extends BaseRequestDto {
  userId: string;
  billId: string;
  creditCardId?: string;
  amount?: number;
  dueDate?: Date;
  description?: string;
}
