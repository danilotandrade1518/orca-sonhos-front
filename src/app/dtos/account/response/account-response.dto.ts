import { BaseResponseDto } from '@dtos/common';

/**
 * DTO for account response
 */
export interface AccountResponseDto extends BaseResponseDto {
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'credit' | 'cash';
  balance: number;
  currency: string;
  description?: string;
  isActive: boolean;
  transactionCount: number;
  lastTransactionDate?: Date;
}
