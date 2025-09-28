import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { DeleteAccountRequestDto, DeleteAccountResponseDto } from '../../dtos/account';

export interface IDeleteAccountPort {
  deleteAccount(
    request: DeleteAccountRequestDto
  ): Promise<Either<ApplicationError, DeleteAccountResponseDto>>;
}
