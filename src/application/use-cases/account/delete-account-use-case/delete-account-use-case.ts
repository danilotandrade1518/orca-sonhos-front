import { Either } from '../../../../shared/core/either/either';
import { DeleteAccountRequestDto } from '../../../dtos/account/request/delete-account-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { AccountRequestMapper } from '../../../mappers/account/account-request-mapper/account-request-mapper';
import { IDeleteAccountPort } from '../../../ports/account/delete-account.port';
import { DeleteAccountResponseDto } from '../../../dtos/account/response/delete-account-response.dto';

export class DeleteAccountUseCase {
  constructor(private readonly deleteAccountPort: IDeleteAccountPort) {}

  async execute(
    request: DeleteAccountRequestDto
  ): Promise<Either<ApplicationError, DeleteAccountResponseDto>> {
    try {
      const validationResult = AccountRequestMapper.validateDeleteRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const httpResult = await this.deleteAccountPort.deleteAccount(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('account deletion', error));
    }
  }
}
