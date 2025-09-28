import { Either } from '../../../../shared/core/either/either';
import { ListAccountsQueryRequestDto } from '../../../dtos/account/request/list-accounts-query-request.dto';
import { ListAccountsQueryResponseDto } from '../../../dtos/account/response/list-accounts-query-response.dto';
import { IListAccountsPort } from '../../../ports/account/list-accounts.port';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

export class ListAccountsQueryHandler {
  constructor(private readonly listAccountsPort: IListAccountsPort) {}

  async execute(
    request: ListAccountsQueryRequestDto
  ): Promise<Either<ApplicationError, ListAccountsQueryResponseDto>> {
    try {
      if (!request.budgetId || request.budgetId.trim() === '') {
        return Either.error(new ValidationError('budgetId', 'Budget ID is required'));
      }

      if (!request.userId || request.userId.trim() === '') {
        return Either.error(new ValidationError('userId', 'User ID is required'));
      }

      const httpResult = await this.listAccountsPort.listAccounts(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('list accounts', error));
    }
  }
}
