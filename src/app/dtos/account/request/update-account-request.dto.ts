import { BaseRequestDto } from '@dtos/common';

/**
 * DTO for updating an existing account
 */
export interface UpdateAccountRequestDto extends BaseRequestDto {
  name?: string;
  type?: 'checking' | 'savings' | 'investment' | 'credit' | 'cash';
  balance?: number;
  currency?: string;
  description?: string;
  isActive?: boolean;
}
