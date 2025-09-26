import { Either } from '../../../shared/core/either';
import { DeleteBudgetRequestDto } from '../../dtos';
import { ApplicationError, ValidationError, NetworkError } from '../../errors';
import { DeleteBudgetPort } from '../../ports';

/**
 * Use Case for deleting a budget
 * Handles business logic and coordinates between ports
 */
export class DeleteBudgetUseCase {
  constructor(private readonly deleteBudgetPort: DeleteBudgetPort) {}

  /**
   * Execute the delete budget use case
   */
  async execute(request: DeleteBudgetRequestDto): Promise<Either<ApplicationError, void>> {
    try {
      // Validate budget ID
      if (!request.id || typeof request.id !== 'string' || request.id.trim().length === 0) {
        return Either.error(
          new ValidationError('Budget ID is required and cannot be empty', 'id', request.id)
        );
      }

      // Delete budget via port (HTTP communication)
      const deleteResult = await this.deleteBudgetPort.delete(request);
      
      if (deleteResult.hasError) {
        return Either.error(deleteResult.errors);
      }

      return Either.success(undefined);
    } catch (error) {
      return Either.error(
        new NetworkError(
          'Failed to delete budget due to network error',
          error instanceof Error ? error : new Error(String(error))
        )
      );
    }
  }
}