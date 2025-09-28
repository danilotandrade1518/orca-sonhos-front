import { CategoryType } from '@models/shared/enums/category-type';

export interface ListCategoriesQueryResponseDto {
  categories: CategorySummaryDto[];
}

export interface CategorySummaryDto {
  id: string;
  name: string;
  type: CategoryType;
  budgetId: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
  transactionCount: number;
}
