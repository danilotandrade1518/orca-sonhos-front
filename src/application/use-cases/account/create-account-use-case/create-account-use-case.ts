import { Either } from '../../../../shared/core/either/either';
import { CreateAccountRequestDto } from '../../../dtos/account/request/create-account-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { AccountRequestMapper } from '../../../mappers/account/account-request-mapper/account-request-mapper';
import { ICreateAccountPort } from '../../../ports/account/create-account.port';
import { CreateAccountResponseDto } from '../../../dtos/account/response/create-account-response.dto';

export class CreateAccountUseCase {
  constructor(private readonly createAccountPort: ICreateAccountPort) {}

  async execute(
    request: CreateAccountRequestDto
  ): Promise<Either<ApplicationError, CreateAccountResponseDto>> {
    try {
      const accountResult = AccountRequestMapper.fromCreateRequestToAccount(request);

      if (accountResult.hasError) {
        return Either.errors(accountResult.errors);
      }

      const httpResult = await this.createAccountPort.createAccount(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('account creation', error));
    }
  }
}
