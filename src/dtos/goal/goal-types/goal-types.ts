export interface GoalDto {
  id: string;
  name: string;
  totalAmount: number;
  accumulatedAmount: number;
  deadline: string | null;
  budgetId: string;
  sourceAccountId?: string;
  status: 'on-track' | 'overdue' | 'ahead' | 'completed';
}
