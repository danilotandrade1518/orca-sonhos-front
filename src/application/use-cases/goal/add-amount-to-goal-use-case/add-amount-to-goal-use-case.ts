import { Either } from '../../../../shared/core/either/either';
import { AddAmountToGoalRequestDto } from '../../../dtos/goal/request/add-amount-to-goal-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { GoalRequestMapper } from '../../../mappers/goal/goal-request-mapper/goal-request-mapper';
import { IAddAmountToGoalPort } from '../../../ports/goal/add-amount-to-goal.port';
import { AddAmountToGoalResponseDto } from '../../../dtos/goal/response/add-amount-to-goal-response.dto';

export class AddAmountToGoalUseCase {
  constructor(private readonly addAmountToGoalPort: IAddAmountToGoalPort) {}

  async execute(
    request: AddAmountToGoalRequestDto
  ): Promise<Either<ApplicationError, AddAmountToGoalResponseDto>> {
    try {
      const validationResult = GoalRequestMapper.validateAddAmountRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const normalizedRequest = GoalRequestMapper.normalizeAddAmountRequest(request);

      const httpResult = await this.addAmountToGoalPort.addAmountToGoal(normalizedRequest);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('add amount to goal', error));
    }
  }
}
