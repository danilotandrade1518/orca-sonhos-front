import { CategoryType } from '@models/shared/enums/category-type';

export interface CreateCategoryRequestDto {
  name: string;
  type: CategoryType;
  budgetId: string;
  description?: string;
  color?: string;
  icon?: string;
}
