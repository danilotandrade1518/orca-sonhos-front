import { Either } from '../../../../shared/core/either/either';
import { ReconcileAccountRequestDto } from '../../../dtos/account/request/reconcile-account-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { AccountRequestMapper } from '../../../mappers/account/account-request-mapper/account-request-mapper';
import { IReconcileAccountPort } from '../../../ports/account/reconcile-account.port';
import { ReconcileAccountResponseDto } from '../../../dtos/account/response/reconcile-account-response.dto';

export class ReconcileAccountUseCase {
  constructor(private readonly reconcileAccountPort: IReconcileAccountPort) {}

  async execute(
    request: ReconcileAccountRequestDto
  ): Promise<Either<ApplicationError, ReconcileAccountResponseDto>> {
    try {
      const validationResult = AccountRequestMapper.validateReconcileRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const httpResult = await this.reconcileAccountPort.reconcileAccount(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('account reconciliation', error));
    }
  }
}
