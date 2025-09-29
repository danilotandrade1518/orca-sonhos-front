import { CategoryType } from '@models/shared/enums/category-type';
import { MoneyDto } from '../../shared/money.dto';

export interface GetCategoryByIdQueryResponseDto {
  category: CategoryDetailDto;
}

export interface CategoryDetailDto {
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
  totalAmount: MoneyDto;
  lastTransactionDate?: string;
}
