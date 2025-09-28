import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { DeleteBudgetRequestDto } from '../../dtos/budget';

export type BudgetResponse = { id: string };

export interface IDeleteBudgetPort {
  deleteBudget(request: DeleteBudgetRequestDto): Promise<Either<ApplicationError, BudgetResponse>>;
}
