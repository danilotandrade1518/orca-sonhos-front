import { Either } from '../../../../shared/core/either/either';
import { UpdateCategoryRequestDto } from '../../../dtos/category/request/update-category-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { CategoryRequestMapper } from '../../../mappers/category/category-request-mapper/category-request-mapper';
import { IUpdateCategoryPort } from '../../../ports/category/update-category.port';
import { UpdateCategoryResponseDto } from '../../../dtos/category/response/update-category-response.dto';

export class UpdateCategoryUseCase {
  constructor(private readonly updateCategoryPort: IUpdateCategoryPort) {}

  async execute(
    request: UpdateCategoryRequestDto
  ): Promise<Either<ApplicationError, UpdateCategoryResponseDto>> {
    try {
      const validationResult = CategoryRequestMapper.validateUpdateRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const normalizedRequest = CategoryRequestMapper.normalizeUpdateRequest(request);

      const httpResult = await this.updateCategoryPort.updateCategory(normalizedRequest);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('category update', error));
    }
  }
}
