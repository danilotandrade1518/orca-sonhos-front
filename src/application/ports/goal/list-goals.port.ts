import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { ListGoalsQueryRequestDto, ListGoalsQueryResponseDto } from '../../dtos/goal';

export interface IListGoalsPort {
  listGoals(
    request: ListGoalsQueryRequestDto
  ): Promise<Either<ApplicationError, ListGoalsQueryResponseDto>>;
}
