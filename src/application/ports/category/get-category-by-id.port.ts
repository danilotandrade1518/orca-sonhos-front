import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import {
  GetCategoryByIdQueryRequestDto,
  GetCategoryByIdQueryResponseDto,
} from '../../dtos/category';

export interface IGetCategoryByIdPort {
  getCategoryById(
    request: GetCategoryByIdQueryRequestDto
  ): Promise<Either<ApplicationError, GetCategoryByIdQueryResponseDto>>;
}
