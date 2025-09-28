import { Either } from '../../../../shared/core/either/either';
import { CreateTransactionRequestDto } from '../../../dtos/transaction/request/create-transaction-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { TransactionRequestMapper } from '../../../mappers/transaction/transaction-request-mapper/transaction-request-mapper';
import { ICreateTransactionPort } from '../../../ports/transaction/create-transaction.port';
import { CreateTransactionResponseDto } from '../../../dtos/transaction/response/create-transaction-response.dto';

export class CreateTransactionUseCase {
  constructor(private readonly createTransactionPort: ICreateTransactionPort) {}

  async execute(
    request: CreateTransactionRequestDto
  ): Promise<Either<ApplicationError, CreateTransactionResponseDto>> {
    try {
      const transactionResult = TransactionRequestMapper.fromCreateRequestToTransaction(request);

      if (transactionResult.hasError) {
        return Either.errors(transactionResult.errors);
      }

      const httpResult = await this.createTransactionPort.createTransaction(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('transaction creation', error));
    }
  }
}
