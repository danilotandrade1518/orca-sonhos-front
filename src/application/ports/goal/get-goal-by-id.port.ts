import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { GetGoalByIdQueryRequestDto, GetGoalByIdQueryResponseDto } from '../../dtos/goal';

export interface IGetGoalByIdPort {
  getGoalById(
    request: GetGoalByIdQueryRequestDto
  ): Promise<Either<ApplicationError, GetGoalByIdQueryResponseDto>>;
}
