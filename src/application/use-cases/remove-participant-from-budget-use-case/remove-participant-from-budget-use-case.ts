import { Either } from '../../../shared/core/either';
import { RemoveParticipantRequestDto, BudgetResponseDto } from '../../dtos';
import { ApplicationError, ValidationError, NetworkError } from '../../errors';
import { RemoveParticipantFromBudgetPort } from '../../ports';

/**
 * Use Case for removing a participant from a budget
 * Handles business logic and coordinates between ports
 */
export class RemoveParticipantFromBudgetUseCase {
  constructor(private readonly removeParticipantPort: RemoveParticipantFromBudgetPort) {}

  /**
   * Execute the remove participant use case
   */
  async execute(request: RemoveParticipantRequestDto): Promise<Either<ApplicationError, BudgetResponseDto>> {
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

      // Remove participant via port (HTTP communication)
      const removeResult = await this.removeParticipantPort.removeParticipant(request);
      
      if (removeResult.hasError) {
        return Either.error(removeResult.errors);
      }

      return Either.success(removeResult.data!);
    } catch (error) {
      return Either.error(
        new NetworkError(
          'Failed to remove participant due to network error',
          error instanceof Error ? error : new Error(String(error))
        )
      );
    }
  }
}