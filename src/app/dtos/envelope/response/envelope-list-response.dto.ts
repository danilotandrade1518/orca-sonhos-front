import { BaseResponseDto, PaginatedResponseDto } from '@dtos/common';
import { EnvelopeResponseDto } from './envelope-response.dto';

export interface EnvelopeListResponseDto extends PaginatedResponseDto<EnvelopeResponseDto> {
  readonly _type: 'envelope-list';
}

export interface EnvelopeSummaryResponseDto {
  totalEnvelopes: number;
  totalAmount: number;
  averageAmount: number;
}
