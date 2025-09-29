import { Either } from '../../../../shared/core/either/either';
import { RemoveAmountFromGoalRequestDto } from '../../../dtos/goal/request/remove-amount-from-goal-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { GoalRequestMapper } from '../../../mappers/goal/goal-request-mapper/goal-request-mapper';
import { IRemoveAmountFromGoalPort } from '../../../ports/goal/remove-amount-from-goal.port';
import { RemoveAmountFromGoalResponseDto } from '../../../dtos/goal/response/remove-amount-from-goal-response.dto';

export class RemoveAmountFromGoalUseCase {
  constructor(private readonly removeAmountFromGoalPort: IRemoveAmountFromGoalPort) {}

  async execute(
    request: RemoveAmountFromGoalRequestDto
  ): Promise<Either<ApplicationError, RemoveAmountFromGoalResponseDto>> {
    try {
      const validationResult = GoalRequestMapper.validateRemoveAmountRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const normalizedRequest = GoalRequestMapper.normalizeRemoveAmountRequest(request);

      const httpResult = await this.removeAmountFromGoalPort.removeAmountFromGoal(
        normalizedRequest
      );

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('remove amount from goal', error));
    }
  }
}
