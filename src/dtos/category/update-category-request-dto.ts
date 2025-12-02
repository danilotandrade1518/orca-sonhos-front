import type { CategoryKind, CategoryType } from './category-types';

export interface UpdateCategoryRequestDto {
  id: string;
  userId: string;
  name?: string;
  type?: CategoryType;
  kind?: CategoryKind;
  description?: string;
  color?: string;
  icon?: string;
  active?: boolean;
  order?: number;
}

export interface UpdateCategoryResponseDto {
  success: boolean;
}


