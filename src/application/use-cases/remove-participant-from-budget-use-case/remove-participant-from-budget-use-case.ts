import { Either } from '../../../shared/core/either/either';
import { RemoveParticipantRequestDto } from '../../dtos/request/add-participant-request.dto';
import {
  IRemoveParticipantFromBudgetPort,
  BudgetResponse,
} from '../../ports/remove-participant-from-budget.port';
import { ApplicationError } from '../../errors/application-error';
import { UnexpectedError } from '../../errors/unexpected-error';
import { BudgetRequestMapper } from '../../mappers/budget-request-mapper/budget-request-mapper';

export class RemoveParticipantFromBudgetUseCase {
  constructor(private readonly removeParticipantFromBudgetPort: IRemoveParticipantFromBudgetPort) {}

  async execute(
    request: RemoveParticipantRequestDto
  ): Promise<Either<ApplicationError, BudgetResponse>> {
    try {
      const validationResult = BudgetRequestMapper.validateParticipantRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const httpResult = await this.removeParticipantFromBudgetPort.removeParticipantFromBudget(
        request
      );

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('remove participant from budget', error));
    }
  }
}
