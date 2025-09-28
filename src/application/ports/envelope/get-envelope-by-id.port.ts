import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import {
  GetEnvelopeByIdQueryRequestDto,
  GetEnvelopeByIdQueryResponseDto,
} from '../../dtos/envelope';

export interface IGetEnvelopeByIdPort {
  getEnvelopeById(
    request: GetEnvelopeByIdQueryRequestDto
  ): Promise<Either<ApplicationError, GetEnvelopeByIdQueryResponseDto>>;
}
