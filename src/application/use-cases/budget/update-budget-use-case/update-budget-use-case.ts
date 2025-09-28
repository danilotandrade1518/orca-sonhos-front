import { Either } from '../../../../shared/core/either/either';
import { UpdateBudgetRequestDto } from '../../../dtos/budget/request/update-budget-request.dto';
import { IUpdateBudgetPort, BudgetResponse } from '../../../ports/budget/update-budget.port';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { BudgetRequestMapper } from '../../../mappers/budget/budget-request-mapper/budget-request-mapper';

export class UpdateBudgetUseCase {
  constructor(private readonly updateBudgetPort: IUpdateBudgetPort) {}

  async execute(
    request: UpdateBudgetRequestDto
  ): Promise<Either<ApplicationError, BudgetResponse>> {
    try {
      const validationResult = BudgetRequestMapper.validateUpdateRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const httpResult = await this.updateBudgetPort.updateBudget(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('budget update', error));
    }
  }
}
