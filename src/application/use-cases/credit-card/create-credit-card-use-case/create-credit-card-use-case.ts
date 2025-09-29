import { Either } from '../../../../shared/core/either/either';
import { CreateCreditCardRequestDto } from '../../../dtos/credit-card/request/create-credit-card-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { CreditCardRequestMapper } from '../../../mappers/credit-card/credit-card-request-mapper/credit-card-request-mapper';
import { ICreateCreditCardPort } from '../../../ports/credit-card/create-credit-card.port';
import { CreateCreditCardResponseDto } from '../../../dtos/credit-card/response/create-credit-card-response.dto';

export class CreateCreditCardUseCase {
  constructor(private readonly createCreditCardPort: ICreateCreditCardPort) {}

  async execute(
    request: CreateCreditCardRequestDto
  ): Promise<Either<ApplicationError, CreateCreditCardResponseDto>> {
    try {
      const creditCardResult = CreditCardRequestMapper.fromCreateRequestToCreditCard(request);

      if (creditCardResult.hasError) {
        return Either.errors(creditCardResult.errors);
      }

      const httpResult = await this.createCreditCardPort.createCreditCard(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('credit card creation', error));
    }
  }
}
