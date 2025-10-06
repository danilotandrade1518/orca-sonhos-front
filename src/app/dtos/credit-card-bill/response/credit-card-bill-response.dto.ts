import { BaseResponseDto } from '@dtos/common';

export interface CreditCardBillResponseDto extends BaseResponseDto {
  creditCardId: string;
  amount: number;
  dueDate: Date;
  paidAmount: number;
  remainingAmount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  description?: string;
  paymentDate?: Date;
}
