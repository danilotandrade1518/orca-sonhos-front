import { Either } from '../../shared/core/either/either';
import { ApplicationError } from '../errors';
import { AddParticipantRequestDto } from '../dtos';

export interface IAddParticipantToBudgetPort {
  addParticipant(request: AddParticipantRequestDto): Promise<Either<ApplicationError, void>>;
}