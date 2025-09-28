import { Either } from '../../../../shared/core/either/either';
import { UpdateGoalRequestDto } from '../../../dtos/goal/request/update-goal-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { GoalRequestMapper } from '../../../mappers/goal/goal-request-mapper/goal-request-mapper';
import { IUpdateGoalPort } from '../../../ports/goal/update-goal.port';
import { UpdateGoalResponseDto } from '../../../dtos/goal/response/update-goal-response.dto';

export class UpdateGoalUseCase {
  constructor(private readonly updateGoalPort: IUpdateGoalPort) {}

  async execute(
    request: UpdateGoalRequestDto
  ): Promise<Either<ApplicationError, UpdateGoalResponseDto>> {
    try {
      const validationResult = GoalRequestMapper.validateUpdateRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const normalizedRequest = GoalRequestMapper.normalizeUpdateRequest(request);

      const httpResult = await this.updateGoalPort.updateGoal(normalizedRequest);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('goal update', error));
    }
  }
}
