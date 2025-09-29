import { Either } from '../../../../shared/core/either/either';
import { CreateEnvelopeRequestDto } from '../../../dtos/envelope/request/create-envelope-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { EnvelopeRequestMapper } from '../../../mappers/envelope/envelope-request-mapper/envelope-request-mapper';
import { ICreateEnvelopePort } from '../../../ports/envelope/create-envelope.port';
import { CreateEnvelopeResponseDto } from '../../../dtos/envelope/response/create-envelope-response.dto';

export class CreateEnvelopeUseCase {
  constructor(private readonly createEnvelopePort: ICreateEnvelopePort) {}

  async execute(
    request: CreateEnvelopeRequestDto
  ): Promise<Either<ApplicationError, CreateEnvelopeResponseDto>> {
    try {
      const envelopeResult = EnvelopeRequestMapper.fromCreateRequestToEnvelope(request);

      if (envelopeResult.hasError) {
        return Either.errors(envelopeResult.errors);
      }

      const httpResult = await this.createEnvelopePort.createEnvelope(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('envelope creation', error));
    }
  }
}
