import { Either } from '../../../../shared/core/either/either';
import { DeleteGoalRequestDto } from '../../../dtos/goal/request/delete-goal-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { GoalRequestMapper } from '../../../mappers/goal/goal-request-mapper/goal-request-mapper';
import { IDeleteGoalPort } from '../../../ports/goal/delete-goal.port';
import { DeleteGoalResponseDto } from '../../../dtos/goal/response/delete-goal-response.dto';

export class DeleteGoalUseCase {
  constructor(private readonly deleteGoalPort: IDeleteGoalPort) {}

  async execute(
    request: DeleteGoalRequestDto
  ): Promise<Either<ApplicationError, DeleteGoalResponseDto>> {
    try {
      const validationResult = GoalRequestMapper.validateDeleteRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const normalizedRequest = GoalRequestMapper.normalizeDeleteRequest(request);

      const httpResult = await this.deleteGoalPort.deleteGoal(normalizedRequest);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('goal deletion', error));
    }
  }
}
