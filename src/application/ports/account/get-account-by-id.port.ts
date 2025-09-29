import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { GetAccountByIdQueryRequestDto, GetAccountByIdQueryResponseDto } from '../../dtos/account';

export interface IGetAccountByIdPort {
  getAccountById(
    request: GetAccountByIdQueryRequestDto
  ): Promise<Either<ApplicationError, GetAccountByIdQueryResponseDto>>;
}
