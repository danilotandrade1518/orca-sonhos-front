import { PaginatedResponseDto } from '../../common';
import { AccountResponseDto } from './account-response.dto';

/**
 * DTO for account list response
 */
export interface AccountListResponseDto extends PaginatedResponseDto<AccountResponseDto> {
  readonly _type: 'account-list';
}

/**
 * DTO for account summary response
 */
export interface AccountSummaryResponseDto {
  totalAccounts: number;
  activeAccounts: number;
  totalBalance: number;
  balanceByType: Record<string, number>;
  currency: string;
}
