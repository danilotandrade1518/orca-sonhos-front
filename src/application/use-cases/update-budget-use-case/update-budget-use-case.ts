import { Either } from '../../../shared/core/either';
import { UpdateBudgetRequestDto, BudgetResponseDto } from '../../dtos';
import { ApplicationError, ValidationError, NetworkError } from '../../errors';
import { UpdateBudgetPort } from '../../ports';
import { BudgetRequestMapper } from '../../mappers';

/**
 * Use Case for updating an existing budget
 * Handles business logic and coordinates between ports and mappers
 */
export class UpdateBudgetUseCase {
  constructor(private readonly updateBudgetPort: UpdateBudgetPort) {}

  /**
   * Execute the update budget use case
   */
  async execute(request: UpdateBudgetRequestDto): Promise<Either<ApplicationError, BudgetResponseDto>> {
    try {
      // Validate that at least one field is provided for update
      const updateProps = BudgetRequestMapper.fromUpdateRequestToPartialProps(request);
      
      if (Object.keys(updateProps).length === 0) {
        return Either.error(
          new ValidationError('At least one field must be provided for update')
        );
      }

      // Validate individual fields if provided
      if (updateProps.name !== undefined) {
        if (typeof updateProps.name !== 'string' || updateProps.name.trim().length === 0) {
          return Either.error(
            new ValidationError('Name cannot be empty', 'name', updateProps.name)
          );
        }
        if (updateProps.name.length > 100) {
          return Either.error(
            new ValidationError('Name cannot exceed 100 characters', 'name', updateProps.name)
          );
        }
      }

      if (updateProps.limitInCents !== undefined) {
        if (typeof updateProps.limitInCents !== 'number' || updateProps.limitInCents <= 0) {
          return Either.error(
            new ValidationError('Limit must be a positive number', 'limitInCents', updateProps.limitInCents)
          );
        }
      }

      if (updateProps.description !== undefined && updateProps.description.length > 500) {
        return Either.error(
          new ValidationError('Description cannot exceed 500 characters', 'description', updateProps.description)
        );
      }

      // Update budget via port (HTTP communication)
      const updateResult = await this.updateBudgetPort.update(request);
      
      if (updateResult.hasError) {
        return Either.error(updateResult.errors);
      }

      return Either.success(updateResult.data!);
    } catch (error) {
      return Either.error(
        new NetworkError(
          'Failed to update budget due to network error',
          error instanceof Error ? error : new Error(String(error))
        )
      );
    }
  }
}