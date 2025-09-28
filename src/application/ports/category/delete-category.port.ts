import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { DeleteCategoryRequestDto, DeleteCategoryResponseDto } from '../../dtos/category';

export interface IDeleteCategoryPort {
  deleteCategory(
    request: DeleteCategoryRequestDto
  ): Promise<Either<ApplicationError, DeleteCategoryResponseDto>>;
}
