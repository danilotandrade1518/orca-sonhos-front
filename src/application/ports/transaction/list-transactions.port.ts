import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import {
  ListTransactionsQueryRequestDto,
  ListTransactionsQueryResponseDto,
} from '../../dtos/transaction';

export interface IListTransactionsPort {
  listTransactions(
    request: ListTransactionsQueryRequestDto
  ): Promise<Either<ApplicationError, ListTransactionsQueryResponseDto>>;
}
