import { Either } from '../../shared/core/either';
import { CreateBudgetRequestDto } from '../dtos/request';
import { BudgetResponseDto } from '../dtos/response';
import { ApplicationError } from '../errors';

/**
 * Port for creating a budget
 * Segregated interface following Single Responsibility Principle
 */
export interface CreateBudgetPort {
  create(request: CreateBudgetRequestDto): Promise<Either<ApplicationError, BudgetResponseDto>>;
}