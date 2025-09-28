import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import {
  GetTransactionByIdQueryRequestDto,
  GetTransactionByIdQueryResponseDto,
} from '../../dtos/transaction';

export interface IGetTransactionByIdPort {
  getTransactionById(
    request: GetTransactionByIdQueryRequestDto
  ): Promise<Either<ApplicationError, GetTransactionByIdQueryResponseDto>>;
}
