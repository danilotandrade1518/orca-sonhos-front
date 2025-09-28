import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { UpdateCreditCardRequestDto, UpdateCreditCardResponseDto } from '../../dtos/credit-card';

export interface IUpdateCreditCardPort {
  updateCreditCard(
    request: UpdateCreditCardRequestDto
  ): Promise<Either<ApplicationError, UpdateCreditCardResponseDto>>;
}
