import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { CreateCreditCardRequestDto, CreateCreditCardResponseDto } from '../../dtos/credit-card';

export interface ICreateCreditCardPort {
  createCreditCard(
    request: CreateCreditCardRequestDto
  ): Promise<Either<ApplicationError, CreateCreditCardResponseDto>>;
}
