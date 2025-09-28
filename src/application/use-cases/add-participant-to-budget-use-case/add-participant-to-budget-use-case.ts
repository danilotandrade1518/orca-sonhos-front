import { Either } from '../../../shared/core/either/either';
import { AddParticipantRequestDto } from '../../dtos/request/add-participant-request.dto';
import {
  IAddParticipantToBudgetPort,
  BudgetResponse,
} from '../../ports/add-participant-to-budget.port';
import { ApplicationError } from '../../errors/application-error';
import { UnexpectedError } from '../../errors/unexpected-error';
import { BudgetRequestMapper } from '../../mappers/budget-request-mapper/budget-request-mapper';

export class AddParticipantToBudgetUseCase {
  constructor(private readonly addParticipantToBudgetPort: IAddParticipantToBudgetPort) {}

  async execute(
    request: AddParticipantRequestDto,
  ): Promise<Either<ApplicationError, BudgetResponse>> {
    try {
      const validationResult = BudgetRequestMapper.validateParticipantRequest(request);

      if (validationResult.hasError) {
        return Either.errors(validationResult.errors);
      }

      const httpResult = await this.addParticipantToBudgetPort.addParticipantToBudget(request);

      if (httpResult.hasError) {
        return Either.errors(httpResult.errors);
      }

      return Either.success(httpResult.data!);
    } catch (error) {
      return Either.error(UnexpectedError.fromError('add participant to budget', error));
    }
  }
}
