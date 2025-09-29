import { Either } from '../../../../shared/core/either/either';
import { RemoveAmountFromEnvelopeRequestDto } from '../../../dtos/envelope/request/remove-amount-from-envelope-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { EnvelopeRequestMapper } from '../../../mappers/envelope/envelope-request-mapper/envelope-request-mapper';
import { IRemoveAmountFromEnvelopePort } from '../../../ports/envelope/remove-amount-from-envelope.port';
import { RemoveAmountFromEnvelopeResponseDto } from '../../../dtos/envelope/response/remove-amount-from-envelope-response.dto';

export class RemoveAmountFromEnvelopeUseCase {
  constructor(private readonly removeAmountFromEnvelopePort: IRemoveAmountFromEnvelopePort) {}

  async execute(
    request: RemoveAmountFromEnvelopeRequestDto
  ): Promise<Either<ApplicationError, RemoveAmountFromEnvelopeResponseDto>> {
    try {
      const validationResult = EnvelopeRequestMapper.validateRemoveAmountRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const normalizedRequest = EnvelopeRequestMapper.normalizeRemoveAmountRequest(request);

      const httpResult = await this.removeAmountFromEnvelopePort.removeAmountFromEnvelope(
        normalizedRequest
      );

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('remove amount from envelope', error));
    }
  }
}
