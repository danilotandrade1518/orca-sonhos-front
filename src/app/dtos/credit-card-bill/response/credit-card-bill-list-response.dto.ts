import { BaseResponseDto, PaginatedResponseDto } from '@dtos/common';
import { CreditCardBillResponseDto } from './credit-card-bill-response.dto';

export interface CreditCardBillListResponseDto
  extends PaginatedResponseDto<CreditCardBillResponseDto> {
  readonly _type: 'credit-card-bill-list';
}

export interface CreditCardBillSummaryResponseDto {
  totalBills: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  overdueAmount: number;
}
