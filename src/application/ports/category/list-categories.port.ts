import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { ListCategoriesQueryRequestDto, ListCategoriesQueryResponseDto } from '../../dtos/category';

export interface IListCategoriesPort {
  listCategories(
    request: ListCategoriesQueryRequestDto
  ): Promise<Either<ApplicationError, ListCategoriesQueryResponseDto>>;
}
