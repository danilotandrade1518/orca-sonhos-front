export type CategoryType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export type CategoryKind = 'PRESET' | 'CUSTOM';

export interface CategoryDto {
  id: string;
  budgetId: string;
  name: string;
  description?: string;
  type: CategoryType;
  kind: CategoryKind;
  color?: string;
  icon?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  order?: number;
}


