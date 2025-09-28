import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { UpdateBudgetRequestDto } from '../../dtos/budget';

export type BudgetResponse = { id: string };

export interface IUpdateBudgetPort {
  updateBudget(request: UpdateBudgetRequestDto): Promise<Either<ApplicationError, BudgetResponse>>;
}
