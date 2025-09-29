import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import {
  TransferBetweenAccountsRequestDto,
  TransferBetweenAccountsResponseDto,
} from '../../dtos/account';

export interface ITransferBetweenAccountsPort {
  transferBetweenAccounts(
    request: TransferBetweenAccountsRequestDto
  ): Promise<Either<ApplicationError, TransferBetweenAccountsResponseDto>>;
}
