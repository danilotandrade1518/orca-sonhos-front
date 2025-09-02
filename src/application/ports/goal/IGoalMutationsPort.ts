import { Money } from '@models/shared/value-objects/Money';
import { Uuid } from '@models/shared/value-objects/Uuid';

export interface CreateGoalDTO {
  userId: Uuid;
  budgetId: Uuid;
  name: string;
  target: Money;
}

export interface UpdateGoalDTO {
  goalId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
  name?: string;
  target?: Money;
}

export interface DeleteGoalDTO {
  goalId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
}

export interface AddAmountToGoalDTO {
  goalId: Uuid;
  userId: Uuid;
  budgetId: Uuid;
  amount: Money;
}

export interface IGoalMutationsPort {
  createGoal(dto: CreateGoalDTO): Promise<void>;
  updateGoal(dto: UpdateGoalDTO): Promise<void>;
  deleteGoal(dto: DeleteGoalDTO): Promise<void>;
  addAmount(dto: AddAmountToGoalDTO): Promise<void>;
}
