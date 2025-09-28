import { Either } from '../../../../shared/core/either/either';
import { UpdateAccountRequestDto } from '../../../dtos/account/request/update-account-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { AccountRequestMapper } from '../../../mappers/account/account-request-mapper/account-request-mapper';
import { IUpdateAccountPort } from '../../../ports/account/update-account.port';
import { UpdateAccountResponseDto } from '../../../dtos/account/response/update-account-response.dto';

export class UpdateAccountUseCase {
  constructor(private readonly updateAccountPort: IUpdateAccountPort) {}

  async execute(
    request: UpdateAccountRequestDto
  ): Promise<Either<ApplicationError, UpdateAccountResponseDto>> {
    try {
      const validationResult = AccountRequestMapper.validateUpdateRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const httpResult = await this.updateAccountPort.updateAccount(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('account update', error));
    }
  }
}
