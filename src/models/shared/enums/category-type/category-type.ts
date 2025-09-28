export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export const CategoryTypeValues = Object.values(CategoryType);

export const CategoryTypeLabels: Record<CategoryType, string> = {
  [CategoryType.INCOME]: 'Receita',
  [CategoryType.EXPENSE]: 'Despesa',
};

export function isValidCategoryType(value: string): value is CategoryType {
  return CategoryTypeValues.includes(value as CategoryType);
}

export function getCategoryTypeLabel(type: CategoryType): string {
  return CategoryTypeLabels[type];
}
