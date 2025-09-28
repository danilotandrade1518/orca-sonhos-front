import { Either } from '../../../../shared/core/either/either';
import { UpdateCreditCardRequestDto } from '../../../dtos/credit-card/request/update-credit-card-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { CreditCardRequestMapper } from '../../../mappers/credit-card/credit-card-request-mapper/credit-card-request-mapper';
import { IUpdateCreditCardPort } from '../../../ports/credit-card/update-credit-card.port';
import { UpdateCreditCardResponseDto } from '../../../dtos/credit-card/response/update-credit-card-response.dto';

export class UpdateCreditCardUseCase {
  constructor(private readonly updateCreditCardPort: IUpdateCreditCardPort) {}

  async execute(
    request: UpdateCreditCardRequestDto
  ): Promise<Either<ApplicationError, UpdateCreditCardResponseDto>> {
    try {
      const validationResult = CreditCardRequestMapper.validateUpdateRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const normalizedRequest = CreditCardRequestMapper.normalizeUpdateRequest(request);

      const httpResult = await this.updateCreditCardPort.updateCreditCard(normalizedRequest);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('credit card update', error));
    }
  }
}
