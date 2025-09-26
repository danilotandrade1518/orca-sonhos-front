import { Either } from '../../../shared/core/either';
import { ListBudgetsRequestDto, BudgetListResponseDto } from '../../dtos';
import { ApplicationError, ValidationError, NetworkError } from '../../errors';
import { ListBudgetsPort } from '../../ports';
import { createPaginationQuery } from '../../types';

/**
 * Query Handler for listing budgets with pagination
 * Handles business logic and coordinates between ports
 */
export class ListBudgetsQueryHandler {
  constructor(private readonly listBudgetsPort: ListBudgetsPort) {}

  /**
   * Execute the list budgets query
   */
  async execute(request: ListBudgetsRequestDto): Promise<Either<ApplicationError, BudgetListResponseDto>> {
    try {
      // Validate and normalize pagination parameters
      const paginationQuery = createPaginationQuery(request.page, request.limit);
      
      // Validate ownerId if provided
      if (request.ownerId !== undefined) {
        if (typeof request.ownerId !== 'string' || request.ownerId.trim().length === 0) {
          return Either.error(
            new ValidationError('Owner ID must be a non-empty string', 'ownerId', request.ownerId)
          );
        }
      }

      // Validate isActive if provided
      if (request.isActive !== undefined) {
        if (typeof request.isActive !== 'boolean') {
          return Either.error(
            new ValidationError('isActive must be a boolean', 'isActive', request.isActive)
          );
        }
      }

      // Create normalized request
      const normalizedRequest: ListBudgetsRequestDto = {
        ...paginationQuery,
        ownerId: request.ownerId,
        isActive: request.isActive,
      };

      // Query budgets via port (HTTP communication)
      const queryResult = await this.listBudgetsPort.list(normalizedRequest);
      
      if (queryResult.hasError) {
        return Either.error(queryResult.errors);
      }

      return Either.success(queryResult.data!);
    } catch (error) {
      return Either.error(
        new NetworkError(
          'Failed to list budgets due to network error',
          error instanceof Error ? error : new Error(String(error))
        )
      );
    }
  }
}