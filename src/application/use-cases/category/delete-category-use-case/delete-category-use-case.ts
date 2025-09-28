import { Either } from '../../../../shared/core/either/either';
import { DeleteCategoryRequestDto } from '../../../dtos/category/request/delete-category-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { CategoryRequestMapper } from '../../../mappers/category/category-request-mapper/category-request-mapper';
import { IDeleteCategoryPort } from '../../../ports/category/delete-category.port';
import { DeleteCategoryResponseDto } from '../../../dtos/category/response/delete-category-response.dto';

export class DeleteCategoryUseCase {
  constructor(private readonly deleteCategoryPort: IDeleteCategoryPort) {}

  async execute(
    request: DeleteCategoryRequestDto
  ): Promise<Either<ApplicationError, DeleteCategoryResponseDto>> {
    try {
      const validationResult = CategoryRequestMapper.validateDeleteRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const normalizedRequest = CategoryRequestMapper.normalizeDeleteRequest(request);

      const httpResult = await this.deleteCategoryPort.deleteCategory(normalizedRequest);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('category deletion', error));
    }
  }
}
