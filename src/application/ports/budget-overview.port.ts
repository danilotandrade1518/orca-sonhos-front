import { Either } from '../../shared/core/either/either';
import { ApplicationError } from '../errors';
import { BudgetOverviewQueryDto, BudgetOverviewResponseDto } from '../dtos';

export interface IBudgetOverviewPort {
  getBudgetOverview(query: BudgetOverviewQueryDto): Promise<Either<ApplicationError, BudgetOverviewResponseDto>>;
}