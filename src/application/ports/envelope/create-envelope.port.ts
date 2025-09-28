import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { CreateEnvelopeRequestDto, CreateEnvelopeResponseDto } from '../../dtos/envelope';

export interface ICreateEnvelopePort {
  createEnvelope(
    request: CreateEnvelopeRequestDto
  ): Promise<Either<ApplicationError, CreateEnvelopeResponseDto>>;
}
