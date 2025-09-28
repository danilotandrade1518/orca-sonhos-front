import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import {
  TransferBetweenEnvelopesRequestDto,
  TransferBetweenEnvelopesResponseDto,
} from '../../dtos/envelope';

export interface ITransferBetweenEnvelopesPort {
  transferBetweenEnvelopes(
    request: TransferBetweenEnvelopesRequestDto
  ): Promise<Either<ApplicationError, TransferBetweenEnvelopesResponseDto>>;
}
