import type { CategoryDto } from './category-types';

export interface ListCategoriesResponseDto {
  data: CategoryDto[];
  meta: {
    count: number;
  };
}


