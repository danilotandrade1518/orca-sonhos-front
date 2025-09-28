import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { DeleteGoalRequestDto, DeleteGoalResponseDto } from '../../dtos/goal';

export interface IDeleteGoalPort {
  deleteGoal(
    request: DeleteGoalRequestDto
  ): Promise<Either<ApplicationError, DeleteGoalResponseDto>>;
}
