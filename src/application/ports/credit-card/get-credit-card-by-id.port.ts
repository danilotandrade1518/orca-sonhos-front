import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import {
  GetCreditCardByIdQueryRequestDto,
  GetCreditCardByIdQueryResponseDto,
} from '../../dtos/credit-card';

export interface IGetCreditCardByIdPort {
  getCreditCardById(
    request: GetCreditCardByIdQueryRequestDto
  ): Promise<Either<ApplicationError, GetCreditCardByIdQueryResponseDto>>;
}
