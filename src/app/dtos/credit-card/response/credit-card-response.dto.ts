import { BaseResponseDto } from '@dtos/common';

/**
 * DTO for credit card response
 */
export interface CreditCardResponseDto extends BaseResponseDto {
  name: string;
  cardNumber: string;
  limit: number;
  currentBalance: number;
  availableLimit: number;
  dueDate: number; // Day of the month
  interestRate: number;
  description?: string;
  isActive: boolean;
  utilizationPercentage: number;
  nextDueDate: Date;
  minimumPayment: number;
}
