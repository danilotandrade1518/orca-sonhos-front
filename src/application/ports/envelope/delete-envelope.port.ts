import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { DeleteEnvelopeRequestDto, DeleteEnvelopeResponseDto } from '../../dtos/envelope';

export interface IDeleteEnvelopePort {
  deleteEnvelope(
    request: DeleteEnvelopeRequestDto
  ): Promise<Either<ApplicationError, DeleteEnvelopeResponseDto>>;
}
