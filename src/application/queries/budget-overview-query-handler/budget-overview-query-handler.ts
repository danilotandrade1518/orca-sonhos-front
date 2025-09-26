import { Either } from '../../../shared/core/either';
import { BudgetOverviewRequestDto, BudgetOverviewResponseDto } from '../../dtos';
import { ApplicationError, ValidationError, NetworkError } from '../../errors';
import { BudgetOverviewPort } from '../../ports';

/**
 * Query Handler for getting budget overview with additional metadata
 * Handles business logic and coordinates between ports
 */
export class BudgetOverviewQueryHandler {
  constructor(private readonly budgetOverviewPort: BudgetOverviewPort) {}

  /**
   * Execute the budget overview query
   */
  async execute(request: BudgetOverviewRequestDto): Promise<Either<ApplicationError, BudgetOverviewResponseDto>> {
    try {
      // Validate budget ID
      if (!request.budgetId || typeof request.budgetId !== 'string' || request.budgetId.trim().length === 0) {
        return Either.error(
          new ValidationError('Budget ID is required and cannot be empty', 'budgetId', request.budgetId)
        );
      }

      // Get budget overview via port (HTTP communication)
      const overviewResult = await this.budgetOverviewPort.getOverview(request);
      
      if (overviewResult.hasError) {
        return Either.error(overviewResult.errors);
      }

      return Either.success(overviewResult.data!);
    } catch (error) {
      return Either.error(
        new NetworkError(
          'Failed to get budget overview due to network error',
          error instanceof Error ? error : new Error(String(error))
        )
      );
    }
  }
}