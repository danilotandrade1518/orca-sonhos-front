export interface CreateGoalDto {
  name: string;
  totalAmount: number;
  accumulatedAmount?: number;
  deadline?: string;
  budgetId: string;
  sourceAccountId: string;
}

export interface CreateGoalResponseDto {
  id: string;
}
