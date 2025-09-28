export interface CreateGoalRequestDto {
  name: string;
  totalAmount: number;
  accumulatedAmount?: number;
  deadline?: string;
  budgetId: string;
  description?: string;
}
