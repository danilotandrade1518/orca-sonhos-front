import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import {
  MarkTransactionLateRequestDto,
  MarkTransactionLateResponseDto,
} from '../../dtos/transaction';

export interface IMarkTransactionLatePort {
  markTransactionLate(
    request: MarkTransactionLateRequestDto
  ): Promise<Either<ApplicationError, MarkTransactionLateResponseDto>>;
}
