import { Either } from '../../../../shared/core/either/either';
import { ListCategoriesQueryRequestDto } from '../../../dtos/category/request/list-categories-query-request.dto';
import { ListCategoriesQueryResponseDto } from '../../../dtos/category/response/list-categories-query-response.dto';
import { IListCategoriesPort } from '../../../ports/category/list-categories.port';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

export class ListCategoriesQueryHandler {
  constructor(private readonly listCategoriesPort: IListCategoriesPort) {}

  async execute(
    request: ListCategoriesQueryRequestDto
  ): Promise<Either<ApplicationError, ListCategoriesQueryResponseDto>> {
    try {
      if (!request.budgetId || request.budgetId.trim() === '') {
        return Either.error(new ValidationError('budgetId', 'Budget ID is required'));
      }

      const httpResult = await this.listCategoriesPort.listCategories(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('list categories', error));
    }
  }
}
