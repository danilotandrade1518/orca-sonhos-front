import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { UpdateEnvelopeRequestDto, UpdateEnvelopeResponseDto } from '../../dtos/envelope';

export interface IUpdateEnvelopePort {
  updateEnvelope(
    request: UpdateEnvelopeRequestDto
  ): Promise<Either<ApplicationError, UpdateEnvelopeResponseDto>>;
}
