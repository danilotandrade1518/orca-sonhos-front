import { Either } from '../../../../shared/core/either/either';
import { GetCreditCardByIdQueryRequestDto } from '../../../dtos/credit-card/request/get-credit-card-by-id-query-request.dto';
import { GetCreditCardByIdQueryResponseDto } from '../../../dtos/credit-card/response/get-credit-card-by-id-query-response.dto';
import { IGetCreditCardByIdPort } from '../../../ports/credit-card/get-credit-card-by-id.port';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

export class GetCreditCardByIdQueryHandler {
  constructor(private readonly getCreditCardByIdPort: IGetCreditCardByIdPort) {}

  async execute(
    request: GetCreditCardByIdQueryRequestDto
  ): Promise<Either<ApplicationError, GetCreditCardByIdQueryResponseDto>> {
    try {
      if (!request.creditCardId || request.creditCardId.trim() === '') {
        return Either.error(new ValidationError('creditCardId', 'Credit Card ID is required'));
      }


      const httpResult = await this.getCreditCardByIdPort.getCreditCardById(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('get credit card by id', error));
    }
  }
}
