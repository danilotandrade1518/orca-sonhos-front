import { Either } from '../../shared/core/either/either';
import { ApplicationError } from '../errors';
import { ListBudgetsQueryRequestDto, ListBudgetsQueryResponseDto } from '../dtos';

export interface IListBudgetsPort {
  listBudgets(
    request: ListBudgetsQueryRequestDto,
  ): Promise<Either<ApplicationError, ListBudgetsQueryResponseDto[]>>;
}
