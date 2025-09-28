import { Either } from '../../shared/core/either/either';
import { ApplicationError } from '../errors';
import { RemoveParticipantRequestDto } from '../dtos';

export type BudgetResponse = { id: string };

export interface IRemoveParticipantFromBudgetPort {
  removeParticipantFromBudget(
    request: RemoveParticipantRequestDto,
  ): Promise<Either<ApplicationError, BudgetResponse>>;
}
