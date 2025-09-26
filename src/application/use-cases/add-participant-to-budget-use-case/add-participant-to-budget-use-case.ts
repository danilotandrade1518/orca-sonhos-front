import { Either } from '../../../shared/core/either';
import { AddParticipantRequestDto, BudgetResponseDto } from '../../dtos';
import { ApplicationError, ValidationError, NetworkError } from '../../errors';
import { AddParticipantToBudgetPort } from '../../ports';

/**
 * Use Case for adding a participant to a budget
 * Handles business logic and coordinates between ports
 */
export class AddParticipantToBudgetUseCase {
  constructor(private readonly addParticipantPort: AddParticipantToBudgetPort) {}

  /**
   * Execute the add participant use case
   */
  async execute(request: AddParticipantRequestDto): Promise<Either<ApplicationError, BudgetResponseDto>> {
    try {
      // Validate budget ID
      if (!request.budgetId || typeof request.budgetId !== 'string' || request.budgetId.trim().length === 0) {
        return Either.error(
          new ValidationError('Budget ID is required and cannot be empty', 'budgetId', request.budgetId)
        );
      }

      // Validate participant ID
      if (!request.participantId || typeof request.participantId !== 'string' || request.participantId.trim().length === 0) {
        return Either.error(
          new ValidationError('Participant ID is required and cannot be empty', 'participantId', request.participantId)
        );
      }

      // Add participant via port (HTTP communication)
      const addResult = await this.addParticipantPort.addParticipant(request);
      
      if (addResult.hasError) {
        return Either.error(addResult.errors);
      }

      return Either.success(addResult.data!);
    } catch (error) {
      return Either.error(
        new NetworkError(
          'Failed to add participant due to network error',
          error instanceof Error ? error : new Error(String(error))
        )
      );
    }
  }
}