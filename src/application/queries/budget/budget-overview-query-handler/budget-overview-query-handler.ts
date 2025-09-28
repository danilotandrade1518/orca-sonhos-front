import { Either } from '../../../../shared/core/either/either';
import { BudgetOverviewQueryRequestDto } from '../../../dtos/budget/request/budget-overview-query-request.dto';
import { BudgetOverviewQueryResponseDto } from '../../../dtos/budget/response/budget-overview-query-response.dto';
import { IBudgetOverviewPort } from '../../../ports/budget/budget-overview.port';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

export class BudgetOverviewQueryHandler {
  constructor(private readonly budgetOverviewPort: IBudgetOverviewPort) {}

  async execute(
    request: BudgetOverviewQueryRequestDto
  ): Promise<Either<ApplicationError, BudgetOverviewQueryResponseDto>> {
    try {
      if (!request.budgetId || request.budgetId.trim() === '') {
        return Either.error(new ValidationError('budgetId', 'Budget ID is required'));
      }

      if (!request.userId || request.userId.trim() === '') {
        return Either.error(new ValidationError('userId', 'User ID is required'));
      }

      const httpResult = await this.budgetOverviewPort.getBudgetOverview(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('budget overview', error));
    }
  }
}
