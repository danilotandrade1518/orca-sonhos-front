import { Either } from '../../../../shared/core/either/either';
import { ListGoalsQueryRequestDto } from '../../../dtos/goal/request/list-goals-query-request.dto';
import { ListGoalsQueryResponseDto } from '../../../dtos/goal/response/list-goals-query-response.dto';
import { IListGoalsPort } from '../../../ports/goal/list-goals.port';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

export class ListGoalsQueryHandler {
  constructor(private readonly listGoalsPort: IListGoalsPort) {}

  async execute(
    request: ListGoalsQueryRequestDto
  ): Promise<Either<ApplicationError, ListGoalsQueryResponseDto>> {
    try {
      if (!request.budgetId || request.budgetId.trim() === '') {
        return Either.error(new ValidationError('budgetId', 'Budget ID is required'));
      }

      const httpResult = await this.listGoalsPort.listGoals(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('list goals', error));
    }
  }
}
