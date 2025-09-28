import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import {
  RemoveAmountFromEnvelopeRequestDto,
  RemoveAmountFromEnvelopeResponseDto,
} from '../../dtos/envelope';

export interface IRemoveAmountFromEnvelopePort {
  removeAmountFromEnvelope(
    request: RemoveAmountFromEnvelopeRequestDto
  ): Promise<Either<ApplicationError, RemoveAmountFromEnvelopeResponseDto>>;
}
