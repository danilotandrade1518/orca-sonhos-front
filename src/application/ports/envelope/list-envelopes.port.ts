import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { ListEnvelopesQueryRequestDto, ListEnvelopesQueryResponseDto } from '../../dtos/envelope';

export interface IListEnvelopesPort {
  listEnvelopes(
    request: ListEnvelopesQueryRequestDto
  ): Promise<Either<ApplicationError, ListEnvelopesQueryResponseDto>>;
}
