import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import {
  ListCreditCardsQueryRequestDto,
  ListCreditCardsQueryResponseDto,
} from '../../dtos/credit-card';

export interface IListCreditCardsPort {
  listCreditCards(
    request: ListCreditCardsQueryRequestDto
  ): Promise<Either<ApplicationError, ListCreditCardsQueryResponseDto>>;
}
