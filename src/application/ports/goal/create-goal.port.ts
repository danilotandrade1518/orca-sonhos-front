import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { CreateGoalRequestDto, CreateGoalResponseDto } from '../../dtos/goal';

export interface ICreateGoalPort {
  createGoal(
    request: CreateGoalRequestDto
  ): Promise<Either<ApplicationError, CreateGoalResponseDto>>;
}
