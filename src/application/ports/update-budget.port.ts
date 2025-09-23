import { Either } from '../../shared/core/either/either';
import { ApplicationError } from '../errors';
import { UpdateBudgetRequestDto } from '../dtos';

export interface IUpdateBudgetPort {
  updateBudget(request: UpdateBudgetRequestDto): Promise<Either<ApplicationError, void>>;
}