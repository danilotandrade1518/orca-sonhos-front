import { Either } from '../../../../shared/core/either/either';
import { GetEnvelopeByIdQueryRequestDto } from '../../../dtos/envelope/request/get-envelope-by-id-query-request.dto';
import { GetEnvelopeByIdQueryResponseDto } from '../../../dtos/envelope/response/get-envelope-by-id-query-response.dto';
import { IGetEnvelopeByIdPort } from '../../../ports/envelope/get-envelope-by-id.port';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

export class GetEnvelopeByIdQueryHandler {
  constructor(private readonly getEnvelopeByIdPort: IGetEnvelopeByIdPort) {}

  async execute(
    request: GetEnvelopeByIdQueryRequestDto
  ): Promise<Either<ApplicationError, GetEnvelopeByIdQueryResponseDto>> {
    try {
      if (!request.envelopeId || request.envelopeId.trim() === '') {
        return Either.error(new ValidationError('envelopeId', 'Envelope ID is required'));
      }

      const httpResult = await this.getEnvelopeByIdPort.getEnvelopeById(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('get envelope by id', error));
    }
  }
}
