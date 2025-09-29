import { Either } from '../../../../shared/core/either/either';
import { GetTransactionByIdQueryRequestDto } from '../../../dtos/transaction/request/get-transaction-by-id-query-request.dto';
import { GetTransactionByIdQueryResponseDto } from '../../../dtos/transaction/response/get-transaction-by-id-query-response.dto';
import { IGetTransactionByIdPort } from '../../../ports/transaction/get-transaction-by-id.port';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

export class GetTransactionByIdQueryHandler {
  constructor(private readonly getTransactionByIdPort: IGetTransactionByIdPort) {}

  async execute(
    request: GetTransactionByIdQueryRequestDto
  ): Promise<Either<ApplicationError, GetTransactionByIdQueryResponseDto>> {
    try {
      if (!request.transactionId || request.transactionId.trim() === '') {
        return Either.error(new ValidationError('transactionId', 'Transaction ID is required'));
      }

      const httpResult = await this.getTransactionByIdPort.getTransactionById(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('get transaction by id', error));
    }
  }
}
