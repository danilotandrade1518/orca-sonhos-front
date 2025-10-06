import { BaseRequestDto } from '@dtos/common';

export interface CreateCreditCardBillRequestDto extends BaseRequestDto {
  userId: string;
  creditCardId: string;
  amount: number;
  dueDate: Date;
  description?: string;
}
