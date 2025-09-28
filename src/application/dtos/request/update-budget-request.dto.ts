export interface UpdateBudgetRequestDto {
  budgetId: string;
  name?: string;
  limitInCents?: number;
  description?: string;
  isActive?: boolean;
}
