import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { CreateCategoryRequestDto, CreateCategoryResponseDto } from '../../dtos/category';

export interface ICreateCategoryPort {
  createCategory(
    request: CreateCategoryRequestDto
  ): Promise<Either<ApplicationError, CreateCategoryResponseDto>>;
}
