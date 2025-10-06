import { BaseResponseDto, PaginatedResponseDto } from '@dtos/common';
import { CategoryResponseDto } from './category-response.dto';

export interface CategoryListResponseDto extends PaginatedResponseDto<CategoryResponseDto> {
  readonly _type: 'category-list';
}

export interface CategorySummaryResponseDto {
  totalCategories: number;
  mostUsedCategory: string;
  leastUsedCategory: string;
}
