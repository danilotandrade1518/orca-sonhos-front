import { Either } from '../../shared/core/either';
import { BudgetOverviewRequestDto } from '../dtos/request';
import { BudgetOverviewResponseDto } from '../dtos/response';
import { ApplicationError } from '../errors';

/**
 * Port for getting budget overview
 * Segregated interface following Single Responsibility Principle
 */
export interface BudgetOverviewPort {
  getOverview(request: BudgetOverviewRequestDto): Promise<Either<ApplicationError, BudgetOverviewResponseDto>>;
}