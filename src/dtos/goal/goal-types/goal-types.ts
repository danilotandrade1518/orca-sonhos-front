export interface GoalDto {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  dueDate: string | null;
  budgetId: string;
  sourceAccountId: string;
}

