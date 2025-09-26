import { Either } from '../../shared/core/either';
import { UpdateBudgetRequestDto } from '../dtos/request';
import { BudgetResponseDto } from '../dtos/response';
import { ApplicationError } from '../errors';

/**
 * Port for updating a budget
 * Segregated interface following Single Responsibility Principle
 */
export interface UpdateBudgetPort {
  update(request: UpdateBudgetRequestDto): Promise<Either<ApplicationError, BudgetResponseDto>>;
}