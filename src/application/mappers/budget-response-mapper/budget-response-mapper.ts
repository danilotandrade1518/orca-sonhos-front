import { Budget } from '../../../models/budget';
import { BudgetResponseDto, BudgetListResponseDto, BudgetOverviewResponseDto } from '../../dtos/response';
import { PaginationMeta } from '../../types';

/**
 * Mapper for converting between Budget domain model and Response DTOs
 */
export class BudgetResponseMapper {
  /**
   * Convert Budget domain model to BudgetResponseDto
   */
  static fromBudgetToResponse(budget: Budget): BudgetResponseDto {
    return budget.toJSON();
  }

  /**
   * Convert Budget domain model to BudgetResponseDto from JSON
   */
  static fromBudgetJSONToResponse(budgetJSON: ReturnType<Budget['toJSON']>): BudgetResponseDto {
    return budgetJSON;
  }

  /**
   * Convert array of Budget domain models to BudgetListResponseDto
   */
  static fromBudgetsToListResponse(
    budgets: Budget[],
    pagination: PaginationMeta
  ): BudgetListResponseDto {
    return {
      data: budgets.map(budget => this.fromBudgetToResponse(budget)),
      pagination,
    };
  }

  /**
   * Convert Budget domain model to BudgetOverviewResponseDto
   */
  static fromBudgetToOverviewResponse(
    budget: Budget,
    userId: string
  ): BudgetOverviewResponseDto {
    const baseResponse = this.fromBudgetToResponse(budget);
    
    return {
      ...baseResponse,
      participantCount: budget.getParticipantCount(),
      isOwner: budget.isOwner(userId),
      hasParticipant: budget.hasParticipant(userId),
    };
  }

  /**
   * Convert Budget domain model to BudgetOverviewResponseDto from JSON
   */
  static fromBudgetJSONToOverviewResponse(
    budgetJSON: ReturnType<Budget['toJSON']>,
    userId: string,
    participantCount: number
  ): BudgetOverviewResponseDto {
    const baseResponse = this.fromBudgetJSONToResponse(budgetJSON);
    
    return {
      ...baseResponse,
      participantCount,
      isOwner: budgetJSON.ownerId === userId,
      hasParticipant: budgetJSON.ownerId === userId || budgetJSON.participantIds.includes(userId),
    };
  }
}