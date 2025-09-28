import { Either } from '../../../../shared/core/either/either';
import { CancelScheduledTransactionRequestDto } from '../../../dtos/transaction/request/cancel-scheduled-transaction-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { TransactionRequestMapper } from '../../../mappers/transaction/transaction-request-mapper/transaction-request-mapper';
import { ICancelScheduledTransactionPort } from '../../../ports/transaction/cancel-scheduled-transaction.port';
import { CancelScheduledTransactionResponseDto } from '../../../dtos/transaction/response/cancel-scheduled-transaction-response.dto';

export class CancelScheduledTransactionUseCase {
  constructor(private readonly cancelScheduledTransactionPort: ICancelScheduledTransactionPort) {}

  async execute(
    request: CancelScheduledTransactionRequestDto
  ): Promise<Either<ApplicationError, CancelScheduledTransactionResponseDto>> {
    try {
      const validationResult = TransactionRequestMapper.validateCancelScheduledRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const normalizedRequest = TransactionRequestMapper.normalizeCancelScheduledRequest(request);

      const httpResult = await this.cancelScheduledTransactionPort.cancelScheduledTransaction(
        normalizedRequest
      );

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('scheduled transaction cancellation', error));
    }
  }
}
