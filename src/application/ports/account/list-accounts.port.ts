import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors';
import { ListAccountsQueryRequestDto, ListAccountsQueryResponseDto } from '../../dtos/account';

export interface IListAccountsPort {
  listAccounts(
    request: ListAccountsQueryRequestDto
  ): Promise<Either<ApplicationError, ListAccountsQueryResponseDto>>;
}
