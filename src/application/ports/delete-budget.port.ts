import { Either } from '../../shared/core/either';
import { DeleteBudgetRequestDto } from '../dtos/request';
import { ApplicationError } from '../errors';

/**
 * Port for deleting a budget
 * Segregated interface following Single Responsibility Principle
 */
export interface DeleteBudgetPort {
  delete(request: DeleteBudgetRequestDto): Promise<Either<ApplicationError, void>>;
}