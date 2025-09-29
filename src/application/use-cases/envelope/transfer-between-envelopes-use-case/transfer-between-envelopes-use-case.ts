import { Either } from '../../../../shared/core/either/either';
import { TransferBetweenEnvelopesRequestDto } from '../../../dtos/envelope/request/transfer-between-envelopes-request.dto';
import { ApplicationError } from '../../../errors/application-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { EnvelopeRequestMapper } from '../../../mappers/envelope/envelope-request-mapper/envelope-request-mapper';
import { ITransferBetweenEnvelopesPort } from '../../../ports/envelope/transfer-between-envelopes.port';
import { TransferBetweenEnvelopesResponseDto } from '../../../dtos/envelope/response/transfer-between-envelopes-response.dto';

export class TransferBetweenEnvelopesUseCase {
  constructor(private readonly transferBetweenEnvelopesPort: ITransferBetweenEnvelopesPort) {}

  async execute(
    request: TransferBetweenEnvelopesRequestDto
  ): Promise<Either<ApplicationError, TransferBetweenEnvelopesResponseDto>> {
    try {
      const validationResult = EnvelopeRequestMapper.validateTransferRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const normalizedRequest = EnvelopeRequestMapper.normalizeTransferRequest(request);

      const httpResult = await this.transferBetweenEnvelopesPort.transferBetweenEnvelopes(
        normalizedRequest
      );

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('transfer between envelopes', error));
    }
  }
}
