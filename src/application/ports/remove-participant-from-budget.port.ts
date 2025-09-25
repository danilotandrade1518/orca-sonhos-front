import { Either } from '../../shared/core/either/either';
import { ApplicationError } from '../errors';
import { RemoveParticipantRequestDto } from '../dtos';

export interface IRemoveParticipantFromBudgetPort {
  removeParticipant(request: RemoveParticipantRequestDto): Promise<Either<ApplicationError, void>>;
}