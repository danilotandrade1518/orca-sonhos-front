import { BaseRequestDto } from '@dtos/common';

/**
 * DTO for creating a new credit card
 */
export interface CreateCreditCardRequestDto extends BaseRequestDto {
  name: string;
  cardNumber: string;
  limit: number;
  currentBalance: number;
  availableLimit: number;
  dueDate: number; // Day of the month
  interestRate: number;
  description?: string;
  isActive: boolean;
}
