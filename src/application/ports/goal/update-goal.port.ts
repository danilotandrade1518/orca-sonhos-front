import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { UpdateGoalRequestDto, UpdateGoalResponseDto } from '../../dtos/goal';

export interface IUpdateGoalPort {
  updateGoal(
    request: UpdateGoalRequestDto
  ): Promise<Either<ApplicationError, UpdateGoalResponseDto>>;
}
