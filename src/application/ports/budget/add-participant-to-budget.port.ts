import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { AddParticipantRequestDto } from '../../dtos/budget';

export type BudgetResponse = { id: string };

export interface IAddParticipantToBudgetPort {
  addParticipantToBudget(
    request: AddParticipantRequestDto
  ): Promise<Either<ApplicationError, BudgetResponse>>;
}
