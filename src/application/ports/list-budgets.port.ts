import { Either } from '../../shared/core/either/either';
import { ApplicationError } from '../errors';
import { ListBudgetsQueryDto, BudgetListResponseDto } from '../dtos';

export interface IListBudgetsPort {
  listBudgets(query: ListBudgetsQueryDto): Promise<Either<ApplicationError, BudgetListResponseDto>>;
}