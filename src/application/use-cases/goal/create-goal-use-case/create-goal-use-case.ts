import { Either } from '../../../../shared/core/either/either';
import { CreateGoalRequestDto } from '../../../dtos/goal/request/create-goal-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { GoalRequestMapper } from '../../../mappers/goal/goal-request-mapper/goal-request-mapper';
import { ICreateGoalPort } from '../../../ports/goal/create-goal.port';
import { CreateGoalResponseDto } from '../../../dtos/goal/response/create-goal-response.dto';

export class CreateGoalUseCase {
  constructor(private readonly createGoalPort: ICreateGoalPort) {}

  async execute(
    request: CreateGoalRequestDto
  ): Promise<Either<ApplicationError, CreateGoalResponseDto>> {
    try {
      const goalResult = GoalRequestMapper.fromCreateRequestToGoal(request);

      if (goalResult.hasError) {
        return Either.errors(goalResult.errors);
      }

      const httpResult = await this.createGoalPort.createGoal(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('goal creation', error));
    }
  }
}
