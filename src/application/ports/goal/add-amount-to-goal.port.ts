import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { AddAmountToGoalRequestDto, AddAmountToGoalResponseDto } from '../../dtos/goal';

export interface IAddAmountToGoalPort {
  addAmountToGoal(
    request: AddAmountToGoalRequestDto
  ): Promise<Either<ApplicationError, AddAmountToGoalResponseDto>>;
}
