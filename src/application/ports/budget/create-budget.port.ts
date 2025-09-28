import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { CreateBudgetRequestDto } from '../../dtos/budget';

export type BudgetResponse = { id: string };

export interface ICreateBudgetPort {
  createBudget(request: CreateBudgetRequestDto): Promise<Either<ApplicationError, BudgetResponse>>;
}
