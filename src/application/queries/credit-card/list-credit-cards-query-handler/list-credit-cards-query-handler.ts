import { Either } from '../../../../shared/core/either/either';
import { ListCreditCardsQueryRequestDto } from '../../../dtos/credit-card/request/list-credit-cards-query-request.dto';
import { ListCreditCardsQueryResponseDto } from '../../../dtos/credit-card/response/list-credit-cards-query-response.dto';
import { IListCreditCardsPort } from '../../../ports/credit-card/list-credit-cards.port';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

export class ListCreditCardsQueryHandler {
  constructor(private readonly listCreditCardsPort: IListCreditCardsPort) {}

  async execute(
    request: ListCreditCardsQueryRequestDto
  ): Promise<Either<ApplicationError, ListCreditCardsQueryResponseDto>> {
    try {
      if (!request.budgetId || request.budgetId.trim() === '') {
        return Either.error(new ValidationError('budgetId', 'Budget ID is required'));
      }


      const httpResult = await this.listCreditCardsPort.listCreditCards(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('list credit cards', error));
    }
  }
}
