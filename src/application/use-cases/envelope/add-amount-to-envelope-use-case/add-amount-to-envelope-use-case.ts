import { Either } from '../../../../shared/core/either/either';
import { AddAmountToEnvelopeRequestDto } from '../../../dtos/envelope/request/add-amount-to-envelope-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { EnvelopeRequestMapper } from '../../../mappers/envelope/envelope-request-mapper/envelope-request-mapper';
import { IAddAmountToEnvelopePort } from '../../../ports/envelope/add-amount-to-envelope.port';
import { AddAmountToEnvelopeResponseDto } from '../../../dtos/envelope/response/add-amount-to-envelope-response.dto';

export class AddAmountToEnvelopeUseCase {
  constructor(private readonly addAmountToEnvelopePort: IAddAmountToEnvelopePort) {}

  async execute(
    request: AddAmountToEnvelopeRequestDto
  ): Promise<Either<ApplicationError, AddAmountToEnvelopeResponseDto>> {
    try {
      const validationResult = EnvelopeRequestMapper.validateAddAmountRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const normalizedRequest = EnvelopeRequestMapper.normalizeAddAmountRequest(request);

      const httpResult = await this.addAmountToEnvelopePort.addAmountToEnvelope(normalizedRequest);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('add amount to envelope', error));
    }
  }
}
