import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import type { CreateBudgetRequestDto } from '../../dtos';
import type { ICreateBudgetPort } from '../../ports/create-budget.port';
import { BudgetRequestMapper } from '../../mappers/budget-request-mapper/budget-request-mapper';

export class CreateBudgetUseCase {
  constructor(private readonly httpPort: ICreateBudgetPort) { }

  async execute(request: CreateBudgetRequestDto): Promise<Either<ApplicationError, true>> {
    const budgetModelEither = BudgetRequestMapper.fromCreateRequestToBudget(request);

    if (budgetModelEither.hasError) {
      return Either.errors(budgetModelEither.errors as ApplicationError[]);
    }

    const createResult = await this.httpPort.createBudget(request);
    if (createResult.hasError) {
      return Either.errors(createResult.errors as ApplicationError[]);
    }

    return Either.success(true);
  }
}

