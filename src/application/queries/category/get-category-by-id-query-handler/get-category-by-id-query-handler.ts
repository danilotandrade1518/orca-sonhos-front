import { Either } from '../../../../shared/core/either/either';
import { GetCategoryByIdQueryRequestDto } from '../../../dtos/category/request/get-category-by-id-query-request.dto';
import { GetCategoryByIdQueryResponseDto } from '../../../dtos/category/response/get-category-by-id-query-response.dto';
import { IGetCategoryByIdPort } from '../../../ports/category/get-category-by-id.port';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

export class GetCategoryByIdQueryHandler {
  constructor(private readonly getCategoryByIdPort: IGetCategoryByIdPort) {}

  async execute(
    request: GetCategoryByIdQueryRequestDto
  ): Promise<Either<ApplicationError, GetCategoryByIdQueryResponseDto>> {
    try {
      if (!request.categoryId || request.categoryId.trim() === '') {
        return Either.error(new ValidationError('categoryId', 'Category ID is required'));
      }

      const httpResult = await this.getCategoryByIdPort.getCategoryById(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('get category by id', error));
    }
  }
}
