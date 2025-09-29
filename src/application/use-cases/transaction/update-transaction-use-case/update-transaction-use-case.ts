import { Either } from '../../../../shared/core/either/either';
import { UpdateTransactionRequestDto } from '../../../dtos/transaction/request/update-transaction-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { TransactionRequestMapper } from '../../../mappers/transaction/transaction-request-mapper/transaction-request-mapper';
import { IUpdateTransactionPort } from '../../../ports/transaction/update-transaction.port';
import { UpdateTransactionResponseDto } from '../../../dtos/transaction/response/update-transaction-response.dto';

export class UpdateTransactionUseCase {
  constructor(private readonly updateTransactionPort: IUpdateTransactionPort) {}

  async execute(
    request: UpdateTransactionRequestDto
  ): Promise<Either<ApplicationError, UpdateTransactionResponseDto>> {
    try {
      const validationResult = TransactionRequestMapper.validateUpdateRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const normalizedRequest = TransactionRequestMapper.normalizeUpdateRequest(request);

      const httpResult = await this.updateTransactionPort.updateTransaction(normalizedRequest);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('transaction update', error));
    }
  }
}
