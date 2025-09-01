import { Uuid } from '@models/shared/value-objects/Uuid';

export interface CreateBudgetDTO {
  ownerUserId: Uuid;
  name: string;
  shared?: boolean;
}

export interface UpdateBudgetDTO {
  budgetId: Uuid;
  userId: Uuid;
  name?: string;
}

export interface DeleteBudgetDTO {
  budgetId: Uuid;
  userId: Uuid;
}

export interface AddParticipantToBudgetDTO {
  budgetId: Uuid;
  userId: Uuid; // quem executa a ação
  participantUserId: Uuid;
}

export interface RemoveParticipantFromBudgetDTO {
  budgetId: Uuid;
  userId: Uuid; // quem executa a ação
  participantUserId: Uuid;
}

export interface IBudgetMutationsPort {
  createBudget(dto: CreateBudgetDTO): Promise<void>;
  updateBudget(dto: UpdateBudgetDTO): Promise<void>;
  deleteBudget(dto: DeleteBudgetDTO): Promise<void>;
  addParticipant(dto: AddParticipantToBudgetDTO): Promise<void>;
  removeParticipant(dto: RemoveParticipantFromBudgetDTO): Promise<void>;
}
