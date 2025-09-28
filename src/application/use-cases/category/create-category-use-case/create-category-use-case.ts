import { Either } from '../../../../shared/core/either/either';
import { CreateCategoryRequestDto } from '../../../dtos/category/request/create-category-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { CategoryRequestMapper } from '../../../mappers/category/category-request-mapper/category-request-mapper';
import { ICreateCategoryPort } from '../../../ports/category/create-category.port';
import { CreateCategoryResponseDto } from '../../../dtos/category/response/create-category-response.dto';

export class CreateCategoryUseCase {
  constructor(private readonly createCategoryPort: ICreateCategoryPort) {}

  async execute(
    request: CreateCategoryRequestDto
  ): Promise<Either<ApplicationError, CreateCategoryResponseDto>> {
    try {
      const categoryResult = CategoryRequestMapper.fromCreateRequestToCategory(request);

      if (categoryResult.hasError) {
        return Either.errors(categoryResult.errors);
      }

      const httpResult = await this.createCategoryPort.createCategory(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('category creation', error));
    }
  }
}
