import { Either } from '../../../../shared/core/either/either';
import { TransferBetweenAccountsRequestDto } from '../../../dtos/account/request/transfer-between-accounts-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { AccountRequestMapper } from '../../../mappers/account/account-request-mapper/account-request-mapper';
import { ITransferBetweenAccountsPort } from '../../../ports/account/transfer-between-accounts.port';
import { TransferBetweenAccountsResponseDto } from '../../../dtos/account/response/transfer-between-accounts-response.dto';

export class TransferBetweenAccountsUseCase {
  constructor(private readonly transferBetweenAccountsPort: ITransferBetweenAccountsPort) {}

  async execute(
    request: TransferBetweenAccountsRequestDto
  ): Promise<Either<ApplicationError, TransferBetweenAccountsResponseDto>> {
    try {
      const validationResult = AccountRequestMapper.validateTransferRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const httpResult = await this.transferBetweenAccountsPort.transferBetweenAccounts(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('account transfer', error));
    }
  }
}
