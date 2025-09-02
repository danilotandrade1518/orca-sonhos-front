import {
  AddAmountToGoalDTO,
  CreateGoalDTO,
  DeleteGoalDTO,
  IGoalMutationsPort,
  UpdateGoalDTO,
} from '@application/ports/goal/IGoalMutationsPort';
import { MoneyMapper } from '@models/shared/mappers/MoneyMapper';

import { HttpClient } from '../HttpClient';

export class HttpGoalMutationsPort implements IGoalMutationsPort {
  constructor(private readonly http: HttpClient) {}

  async createGoal(dto: CreateGoalDTO): Promise<void> {
    await this.http.post('/goal/create-goal', {
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      name: dto.name,
      target: MoneyMapper.toApi(dto.target),
    });
  }

  async updateGoal(dto: UpdateGoalDTO): Promise<void> {
    await this.http.post('/goal/update-goal', {
      goalId: dto.goalId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      name: dto.name,
      target: dto.target ? MoneyMapper.toApi(dto.target) : undefined,
    });
  }

  async deleteGoal(dto: DeleteGoalDTO): Promise<void> {
    await this.http.post('/goal/delete-goal', {
      goalId: dto.goalId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
    });
  }

  async addAmount(dto: AddAmountToGoalDTO): Promise<void> {
    await this.http.post('/goal/add-amount-to-goal', {
      goalId: dto.goalId.toString(),
      userId: dto.userId.toString(),
      budgetId: dto.budgetId.toString(),
      amount: MoneyMapper.toApi(dto.amount),
    });
  }
}
