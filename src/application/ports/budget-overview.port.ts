import { Either } from '../../shared/core/either/either';
import { ApplicationError } from '../errors';
import { BudgetOverviewQueryRequestDto, BudgetOverviewQueryResponseDto } from '../dtos';

export interface IBudgetOverviewPort {
  getBudgetOverview(
    request: BudgetOverviewQueryRequestDto
  ): Promise<Either<ApplicationError, BudgetOverviewQueryResponseDto>>;
}
