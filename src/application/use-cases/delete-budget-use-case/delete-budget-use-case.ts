import { Either } from '../../../shared/core/either/either';
import { DeleteBudgetRequestDto } from '../../dtos/request/delete-budget-request.dto';
import { IDeleteBudgetPort, BudgetResponse } from '../../ports/delete-budget.port';
import { ApplicationError } from '../../errors/application-error';
import { UnexpectedError } from '../../errors/unexpected-error';
import { BudgetRequestMapper } from '../../mappers/budget-request-mapper/budget-request-mapper';

export class DeleteBudgetUseCase {
  constructor(private readonly deleteBudgetPort: IDeleteBudgetPort) {}

  async execute(
    request: DeleteBudgetRequestDto,
  ): Promise<Either<ApplicationError, BudgetResponse>> {
    try {
      const validationResult = BudgetRequestMapper.validateDeleteRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const httpResult = await this.deleteBudgetPort.deleteBudget(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('budget deletion', error));
    }
  }
}
