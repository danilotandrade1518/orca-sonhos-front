import { Either } from '../../shared/core/either/either';
import { ApplicationError } from '../errors';
import { DeleteBudgetRequestDto } from '../dtos';

export interface IDeleteBudgetPort {
  deleteBudget(request: DeleteBudgetRequestDto): Promise<Either<ApplicationError, void>>;
}