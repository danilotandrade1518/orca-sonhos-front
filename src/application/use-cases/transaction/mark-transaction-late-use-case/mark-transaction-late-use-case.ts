import { Either } from '../../../../shared/core/either/either';
import { MarkTransactionLateRequestDto } from '../../../dtos/transaction/request/mark-transaction-late-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { TransactionRequestMapper } from '../../../mappers/transaction/transaction-request-mapper/transaction-request-mapper';
import { IMarkTransactionLatePort } from '../../../ports/transaction/mark-transaction-late.port';
import { MarkTransactionLateResponseDto } from '../../../dtos/transaction/response/mark-transaction-late-response.dto';

export class MarkTransactionLateUseCase {
  constructor(private readonly markTransactionLatePort: IMarkTransactionLatePort) {}

  async execute(
    request: MarkTransactionLateRequestDto
  ): Promise<Either<ApplicationError, MarkTransactionLateResponseDto>> {
    try {
      const validationResult = TransactionRequestMapper.validateMarkLateRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const normalizedRequest = TransactionRequestMapper.normalizeMarkLateRequest(request);

      const httpResult = await this.markTransactionLatePort.markTransactionLate(normalizedRequest);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('transaction late marking', error));
    }
  }
}
