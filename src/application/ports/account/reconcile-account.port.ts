import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { ReconcileAccountRequestDto, ReconcileAccountResponseDto } from '../../dtos/account';

export interface IReconcileAccountPort {
  reconcileAccount(
    request: ReconcileAccountRequestDto
  ): Promise<Either<ApplicationError, ReconcileAccountResponseDto>>;
}
