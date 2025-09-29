import { Either } from '../../../../shared/core/either/either';
import { GetAccountByIdQueryRequestDto } from '../../../dtos/account/request/get-account-by-id-query-request.dto';
import { GetAccountByIdQueryResponseDto } from '../../../dtos/account/response/get-account-by-id-query-response.dto';
import { IGetAccountByIdPort } from '../../../ports/account/get-account-by-id.port';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

export class GetAccountByIdQueryHandler {
  constructor(private readonly getAccountByIdPort: IGetAccountByIdPort) {}

  async execute(
    request: GetAccountByIdQueryRequestDto
  ): Promise<Either<ApplicationError, GetAccountByIdQueryResponseDto>> {
    try {
      if (!request.accountId || request.accountId.trim() === '') {
        return Either.error(new ValidationError('accountId', 'Account ID is required'));
      }

      if (!request.userId || request.userId.trim() === '') {
        return Either.error(new ValidationError('userId', 'User ID is required'));
      }

      const httpResult = await this.getAccountByIdPort.getAccountById(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('get account by id', error));
    }
  }
}
