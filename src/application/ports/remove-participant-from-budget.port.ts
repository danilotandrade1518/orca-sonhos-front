import { Either } from '../../shared/core/either';
import { RemoveParticipantRequestDto } from '../dtos/request';
import { BudgetResponseDto } from '../dtos/response';
import { ApplicationError } from '../errors';

/**
 * Port for removing a participant from a budget
 * Segregated interface following Single Responsibility Principle
 */
export interface RemoveParticipantFromBudgetPort {
  removeParticipant(request: RemoveParticipantRequestDto): Promise<Either<ApplicationError, BudgetResponseDto>>;
}