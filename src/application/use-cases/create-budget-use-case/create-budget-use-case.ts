import { Either } from '../../../shared/core/either';
import { CreateBudgetRequestDto, BudgetResponseDto } from '../../dtos';
import { ApplicationError, ValidationError, NetworkError } from '../../errors';
import { CreateBudgetPort } from '../../ports';
import { BudgetRequestMapper, BudgetResponseMapper } from '../../mappers';

/**
 * Use Case for creating a new budget
 * Handles business logic and coordinates between ports and mappers
 */
export class CreateBudgetUseCase {
  constructor(private readonly createBudgetPort: CreateBudgetPort) {}

  /**
   * Execute the create budget use case
   */
  async execute(request: CreateBudgetRequestDto): Promise<Either<ApplicationError, BudgetResponseDto>> {
    try {
      // Validate and convert request to domain model
      const budgetResult = BudgetRequestMapper.fromCreateRequestToBudget(request);
      
      if (budgetResult.hasError) {
        return Either.error(
          new ValidationError(
            `Invalid budget data: ${budgetResult.errors.join(', ')}`
          )
        );
      }

      // Create budget via port (HTTP communication)
      const createResult = await this.createBudgetPort.create(request);
      
      if (createResult.hasError) {
        return Either.error(createResult.errors);
      }

      return Either.success(createResult.data!);
    } catch (error) {
      return Either.error(
        new NetworkError(
          'Failed to create budget due to network error',
          error instanceof Error ? error : new Error(String(error))
        )
      );
    }
  }
}