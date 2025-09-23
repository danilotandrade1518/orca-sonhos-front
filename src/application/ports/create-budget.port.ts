import { Either } from '../../shared/core/either/either';
import { ApplicationError } from '../errors';
import { CreateBudgetRequestDto } from '../dtos';

export interface ICreateBudgetPort {
  createBudget(request: CreateBudgetRequestDto): Promise<Either<ApplicationError, void>>;
}