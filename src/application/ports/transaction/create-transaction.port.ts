import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { CreateTransactionRequestDto, CreateTransactionResponseDto } from '../../dtos/transaction';

export interface ICreateTransactionPort {
  createTransaction(
    request: CreateTransactionRequestDto
  ): Promise<Either<ApplicationError, CreateTransactionResponseDto>>;
}
