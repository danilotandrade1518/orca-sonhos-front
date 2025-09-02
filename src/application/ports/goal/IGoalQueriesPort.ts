import { Uuid } from '@models/shared/value-objects/Uuid';

export interface ListGoalsQuery {
  userId: Uuid;
  budgetId: Uuid;
}

export interface GoalListItem {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  percentAchieved: number;
  dueDate: string | null;
}

export interface IGoalQueriesPort {
  listGoals(q: ListGoalsQuery): Promise<GoalListItem[]>;
}
