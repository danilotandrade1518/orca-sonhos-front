import { Either } from '../../../../shared/core/either/either';
import { DeleteTransactionRequestDto } from '../../../dtos/transaction/request/delete-transaction-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { TransactionRequestMapper } from '../../../mappers/transaction/transaction-request-mapper/transaction-request-mapper';
import { IDeleteTransactionPort } from '../../../ports/transaction/delete-transaction.port';
import { DeleteTransactionResponseDto } from '../../../dtos/transaction/response/delete-transaction-response.dto';

export class DeleteTransactionUseCase {
  constructor(private readonly deleteTransactionPort: IDeleteTransactionPort) {}

  async execute(
    request: DeleteTransactionRequestDto
  ): Promise<Either<ApplicationError, DeleteTransactionResponseDto>> {
    try {
      const validationResult = TransactionRequestMapper.validateDeleteRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const normalizedRequest = TransactionRequestMapper.normalizeDeleteRequest(request);

      const httpResult = await this.deleteTransactionPort.deleteTransaction(normalizedRequest);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('transaction deletion', error));
    }
  }
}
