import { Either } from '../../../../shared/core/either/either';
import { ListTransactionsQueryRequestDto } from '../../../dtos/transaction/request/list-transactions-query-request.dto';
import { ListTransactionsQueryResponseDto } from '../../../dtos/transaction/response/list-transactions-query-response.dto';
import { IListTransactionsPort } from '../../../ports/transaction/list-transactions.port';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

export class ListTransactionsQueryHandler {
  constructor(private readonly listTransactionsPort: IListTransactionsPort) {}

  async execute(
    request: ListTransactionsQueryRequestDto
  ): Promise<Either<ApplicationError, ListTransactionsQueryResponseDto>> {
    try {
      if (!request.budgetId || request.budgetId.trim() === '') {
        return Either.error(new ValidationError('budgetId', 'Budget ID is required'));
      }

      const httpResult = await this.listTransactionsPort.listTransactions(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('list transactions', error));
    }
  }
}
