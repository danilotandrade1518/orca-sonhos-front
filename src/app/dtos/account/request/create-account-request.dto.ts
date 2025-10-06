import { BaseRequestDto } from '@dtos/common';

/**
 * DTO for creating a new account
 */
export interface CreateAccountRequestDto extends BaseRequestDto {
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'credit' | 'cash';
  balance: number;
  currency: string;
  description?: string;
  isActive: boolean;
}
