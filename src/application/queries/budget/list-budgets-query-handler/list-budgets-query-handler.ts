import { Either } from '../../../../shared/core/either/either';
import { ListBudgetsQueryRequestDto } from '../../../dtos/budget/request/list-budgets-query-request.dto';
import { ListBudgetsQueryResponseDto } from '../../../dtos/budget/response/list-budgets-query-response.dto';
import { IListBudgetsPort } from '../../../ports/budget/list-budgets.port';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

export class ListBudgetsQueryHandler {
  constructor(private readonly listBudgetsPort: IListBudgetsPort) {}

  async execute(
    request: ListBudgetsQueryRequestDto
  ): Promise<Either<ApplicationError, ListBudgetsQueryResponseDto[]>> {
    try {
      if (!request.userId || request.userId.trim() === '') {
        return Either.error(new ValidationError('userId', 'User ID is required'));
      }

      const httpResult = await this.listBudgetsPort.listBudgets(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('list budgets', error));
    }
  }
}
