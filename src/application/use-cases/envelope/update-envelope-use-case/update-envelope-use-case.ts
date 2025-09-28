import { Either } from '../../../../shared/core/either/either';
import { UpdateEnvelopeRequestDto } from '../../../dtos/envelope/request/update-envelope-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { EnvelopeRequestMapper } from '../../../mappers/envelope/envelope-request-mapper/envelope-request-mapper';
import { IUpdateEnvelopePort } from '../../../ports/envelope/update-envelope.port';
import { UpdateEnvelopeResponseDto } from '../../../dtos/envelope/response/update-envelope-response.dto';

export class UpdateEnvelopeUseCase {
  constructor(private readonly updateEnvelopePort: IUpdateEnvelopePort) {}

  async execute(
    request: UpdateEnvelopeRequestDto
  ): Promise<Either<ApplicationError, UpdateEnvelopeResponseDto>> {
    try {
      const validationResult = EnvelopeRequestMapper.validateUpdateRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const normalizedRequest = EnvelopeRequestMapper.normalizeUpdateRequest(request);

      const httpResult = await this.updateEnvelopePort.updateEnvelope(normalizedRequest);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('envelope update', error));
    }
  }
}
