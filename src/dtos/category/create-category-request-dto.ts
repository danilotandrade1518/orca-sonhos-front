import type { CategoryKind, CategoryType } from './category-types';

export interface CreateCategoryRequestDto {
  userId: string;
  budgetId: string;
  name: string;
  type: CategoryType;
  kind: CategoryKind;
  description?: string;
  color?: string;
  icon?: string;
  order?: number;
}

export interface CreateCategoryResponseDto {
  id: string;
}
