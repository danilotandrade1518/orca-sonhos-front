import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { DeleteTransactionRequestDto, DeleteTransactionResponseDto } from '../../dtos/transaction';

export interface IDeleteTransactionPort {
  deleteTransaction(
    request: DeleteTransactionRequestDto
  ): Promise<Either<ApplicationError, DeleteTransactionResponseDto>>;
}
