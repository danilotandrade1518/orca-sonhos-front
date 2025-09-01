import {
  AddParticipantToBudgetDTO,
  CreateBudgetDTO,
  DeleteBudgetDTO,
  IBudgetMutationsPort,
  RemoveParticipantFromBudgetDTO,
  UpdateBudgetDTO,
} from '@application/ports/budget/IBudgetMutationsPort';
import { HttpClient } from '../HttpClient';

export class HttpBudgetMutationsPort implements IBudgetMutationsPort {
  constructor(private readonly http: HttpClient) {}

  async createBudget(dto: CreateBudgetDTO): Promise<void> {
    await this.http.post('/budget/create-budget', {
      ownerUserId: dto.ownerUserId.toString(),
      name: dto.name,
      shared: !!dto.shared,
    });
  }

  async updateBudget(dto: UpdateBudgetDTO): Promise<void> {
    await this.http.post('/budget/update-budget', {
      budgetId: dto.budgetId.toString(),
      userId: dto.userId.toString(),
      name: dto.name,
    });
  }

  async deleteBudget(dto: DeleteBudgetDTO): Promise<void> {
    await this.http.post('/budget/delete-budget', {
      budgetId: dto.budgetId.toString(),
      userId: dto.userId.toString(),
    });
    return;
  }

  async addParticipant(dto: AddParticipantToBudgetDTO): Promise<void> {
    await this.http.post('/budget/add-participant', {
      budgetId: dto.budgetId.toString(),
      userId: dto.userId.toString(),
      participantUserId: dto.participantUserId.toString(),
    });
  }

  async removeParticipant(dto: RemoveParticipantFromBudgetDTO): Promise<void> {
    await this.http.post('/budget/remove-participant', {
      budgetId: dto.budgetId.toString(),
      userId: dto.userId.toString(),
      participantUserId: dto.participantUserId.toString(),
    });
  }
}
