import { Either } from '../../shared/core/either';
import { AddParticipantRequestDto } from '../dtos/request';
import { BudgetResponseDto } from '../dtos/response';
import { ApplicationError } from '../errors';

/**
 * Port for adding a participant to a budget
 * Segregated interface following Single Responsibility Principle
 */
export interface AddParticipantToBudgetPort {
  addParticipant(request: AddParticipantRequestDto): Promise<Either<ApplicationError, BudgetResponseDto>>;
}