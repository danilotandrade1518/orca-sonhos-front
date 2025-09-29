import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { AddAmountToEnvelopeRequestDto, AddAmountToEnvelopeResponseDto } from '../../dtos/envelope';

export interface IAddAmountToEnvelopePort {
  addAmountToEnvelope(
    request: AddAmountToEnvelopeRequestDto
  ): Promise<Either<ApplicationError, AddAmountToEnvelopeResponseDto>>;
}
