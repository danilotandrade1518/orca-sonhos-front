import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { UpdateAccountRequestDto, UpdateAccountResponseDto } from '../../dtos/account';

export interface IUpdateAccountPort {
  updateAccount(
    request: UpdateAccountRequestDto
  ): Promise<Either<ApplicationError, UpdateAccountResponseDto>>;
}
