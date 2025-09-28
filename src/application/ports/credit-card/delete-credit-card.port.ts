import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { DeleteCreditCardRequestDto, DeleteCreditCardResponseDto } from '../../dtos/credit-card';

export interface IDeleteCreditCardPort {
  deleteCreditCard(
    request: DeleteCreditCardRequestDto
  ): Promise<Either<ApplicationError, DeleteCreditCardResponseDto>>;
}
