import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { UpdateCategoryRequestDto, UpdateCategoryResponseDto } from '../../dtos/category';

export interface IUpdateCategoryPort {
  updateCategory(
    request: UpdateCategoryRequestDto
  ): Promise<Either<ApplicationError, UpdateCategoryResponseDto>>;
}
