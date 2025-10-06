import { PaginatedResponseDto } from '../../common';
import { CreditCardResponseDto } from './credit-card-response.dto';

/**
 * DTO for credit card list response
 */
export interface CreditCardListResponseDto extends PaginatedResponseDto<CreditCardResponseDto> {
  readonly _type: 'credit-card-list';
}

/**
 * DTO for credit card summary response
 */
export interface CreditCardSummaryResponseDto {
  totalCards: number;
  activeCards: number;
  totalLimit: number;
  totalBalance: number;
  totalAvailableLimit: number;
  averageUtilization: number;
  totalMinimumPayment: number;
}
