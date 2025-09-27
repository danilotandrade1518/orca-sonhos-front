import { Either } from '../../../shared/core/either/either';
import { CreateBudgetRequestDto } from '../../dtos/request/create-budget-request.dto';
import { ApplicationError } from '../../errors/application-error';
import { UnexpectedError } from '../../errors/unexpected-error';
import { BudgetRequestMapper } from '../../mappers/budget-request-mapper/budget-request-mapper';
import { BudgetResponse, ICreateBudgetPort } from '../../ports/create-budget.port';

export class CreateBudgetUseCase {
  constructor(private readonly createBudgetPort: ICreateBudgetPort) {}

  async execute(
    request: CreateBudgetRequestDto
  ): Promise<Either<ApplicationError, BudgetResponse>> {
    try {
      const budgetResult = BudgetRequestMapper.fromCreateRequestToBudget(request);

      if (budgetResult.hasError) {
        return Either.errors(budgetResult.errors);
      }

      const httpResult = await this.createBudgetPort.createBudget(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('budget creation', error));
    }
  }
}
