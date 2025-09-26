import { Either } from '../../shared/core/either';
import { ListBudgetsRequestDto } from '../dtos/request';
import { BudgetListResponseDto } from '../dtos/response';
import { ApplicationError } from '../errors';

/**
 * Port for listing budgets with pagination
 * Segregated interface following Single Responsibility Principle
 */
export interface ListBudgetsPort {
  list(request: ListBudgetsRequestDto): Promise<Either<ApplicationError, BudgetListResponseDto>>;
}