import { BaseRequestDto } from '@dtos/common';

/**
 * DTO for updating an existing credit card
 */
export interface UpdateCreditCardRequestDto extends BaseRequestDto {
  name?: string;
  cardNumber?: string;
  limit?: number;
  currentBalance?: number;
  availableLimit?: number;
  dueDate?: number; // Day of the month
  interestRate?: number;
  description?: string;
  isActive?: boolean;
}
