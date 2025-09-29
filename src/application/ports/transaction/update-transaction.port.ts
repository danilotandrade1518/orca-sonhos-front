import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { UpdateTransactionRequestDto, UpdateTransactionResponseDto } from '../../dtos/transaction';

export interface IUpdateTransactionPort {
  updateTransaction(
    request: UpdateTransactionRequestDto
  ): Promise<Either<ApplicationError, UpdateTransactionResponseDto>>;
}
