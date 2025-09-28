import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { RemoveAmountFromGoalRequestDto, RemoveAmountFromGoalResponseDto } from '../../dtos/goal';

export interface IRemoveAmountFromGoalPort {
  removeAmountFromGoal(
    request: RemoveAmountFromGoalRequestDto
  ): Promise<Either<ApplicationError, RemoveAmountFromGoalResponseDto>>;
}
