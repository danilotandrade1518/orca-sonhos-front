import { Either } from '../../../../shared/core/either/either';
import { ListEnvelopesQueryRequestDto } from '../../../dtos/envelope/request/list-envelopes-query-request.dto';
import { ListEnvelopesQueryResponseDto } from '../../../dtos/envelope/response/list-envelopes-query-response.dto';
import { IListEnvelopesPort } from '../../../ports/envelope/list-envelopes.port';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

export class ListEnvelopesQueryHandler {
  constructor(private readonly listEnvelopesPort: IListEnvelopesPort) {}

  async execute(
    request: ListEnvelopesQueryRequestDto
  ): Promise<Either<ApplicationError, ListEnvelopesQueryResponseDto>> {
    try {
      if (!request.budgetId || request.budgetId.trim() === '') {
        return Either.error(new ValidationError('budgetId', 'Budget ID is required'));
      }

      const httpResult = await this.listEnvelopesPort.listEnvelopes(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('list envelopes', error));
    }
  }
}
