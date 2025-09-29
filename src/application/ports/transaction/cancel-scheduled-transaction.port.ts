import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import {
  CancelScheduledTransactionRequestDto,
  CancelScheduledTransactionResponseDto,
} from '../../dtos/transaction';

export interface ICancelScheduledTransactionPort {
  cancelScheduledTransaction(
    request: CancelScheduledTransactionRequestDto
  ): Promise<Either<ApplicationError, CancelScheduledTransactionResponseDto>>;
}
