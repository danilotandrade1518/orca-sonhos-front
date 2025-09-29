import { Either } from '../../../../shared/core/either/either';
import { GetGoalByIdQueryRequestDto } from '../../../dtos/goal/request/get-goal-by-id-query-request.dto';
import { GetGoalByIdQueryResponseDto } from '../../../dtos/goal/response/get-goal-by-id-query-response.dto';
import { IGetGoalByIdPort } from '../../../ports/goal/get-goal-by-id.port';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

export class GetGoalByIdQueryHandler {
  constructor(private readonly getGoalByIdPort: IGetGoalByIdPort) {}

  async execute(
    request: GetGoalByIdQueryRequestDto
  ): Promise<Either<ApplicationError, GetGoalByIdQueryResponseDto>> {
    try {
      if (!request.goalId || request.goalId.trim() === '') {
        return Either.error(new ValidationError('goalId', 'Goal ID is required'));
      }

      const httpResult = await this.getGoalByIdPort.getGoalById(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('get goal by id', error));
    }
  }
}
