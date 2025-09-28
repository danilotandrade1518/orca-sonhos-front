import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { CreateAccountRequestDto, CreateAccountResponseDto } from '../../dtos/account';

export interface ICreateAccountPort {
  createAccount(
    request: CreateAccountRequestDto
  ): Promise<Either<ApplicationError, CreateAccountResponseDto>>;
}
