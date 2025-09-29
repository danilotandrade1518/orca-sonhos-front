import { Either } from '../../../../shared/core/either/either';
import { DeleteCreditCardRequestDto } from '../../../dtos/credit-card/request/delete-credit-card-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { CreditCardRequestMapper } from '../../../mappers/credit-card/credit-card-request-mapper/credit-card-request-mapper';
import { IDeleteCreditCardPort } from '../../../ports/credit-card/delete-credit-card.port';
import { DeleteCreditCardResponseDto } from '../../../dtos/credit-card/response/delete-credit-card-response.dto';

export class DeleteCreditCardUseCase {
  constructor(private readonly deleteCreditCardPort: IDeleteCreditCardPort) {}

  async execute(
    request: DeleteCreditCardRequestDto
  ): Promise<Either<ApplicationError, DeleteCreditCardResponseDto>> {
    try {
      const validationResult = CreditCardRequestMapper.validateDeleteRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const normalizedRequest = CreditCardRequestMapper.normalizeDeleteRequest(request);

      const httpResult = await this.deleteCreditCardPort.deleteCreditCard(normalizedRequest);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('credit card deletion', error));
    }
  }
}
