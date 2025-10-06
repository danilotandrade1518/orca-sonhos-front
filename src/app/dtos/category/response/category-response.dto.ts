import { BaseResponseDto } from '@dtos/common';

export interface CategoryResponseDto extends BaseResponseDto {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  transactionCount: number;
}
