import { Either } from '../../../../shared/core/either/either';
import { DeleteEnvelopeRequestDto } from '../../../dtos/envelope/request/delete-envelope-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { EnvelopeRequestMapper } from '../../../mappers/envelope/envelope-request-mapper/envelope-request-mapper';
import { IDeleteEnvelopePort } from '../../../ports/envelope/delete-envelope.port';
import { DeleteEnvelopeResponseDto } from '../../../dtos/envelope/response/delete-envelope-response.dto';

export class DeleteEnvelopeUseCase {
  constructor(private readonly deleteEnvelopePort: IDeleteEnvelopePort) {}

  async execute(
    request: DeleteEnvelopeRequestDto
  ): Promise<Either<ApplicationError, DeleteEnvelopeResponseDto>> {
    try {
      const validationResult = EnvelopeRequestMapper.validateDeleteRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const normalizedRequest = EnvelopeRequestMapper.normalizeDeleteRequest(request);

      const httpResult = await this.deleteEnvelopePort.deleteEnvelope(normalizedRequest);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('envelope deletion', error));
    }
  }
}
