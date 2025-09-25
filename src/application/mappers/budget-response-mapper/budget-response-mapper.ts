import { Either } from '../../../shared/core/either/either';
import { Budget } from '../../../models/budget/budget';
import { ApplicationError, ValidationError } from '../../errors';
import {
  BudgetResponseDto,
  BudgetListItemDto,
  BudgetListResponseDto,
  BudgetOverviewResponseDto,
  ParticipantInfoDto
} from '../../dtos';
import { PaginatedResponse, createPaginationMeta } from '../../types';

export class BudgetResponseMapper {
  static fromBudgetToResponseDto(budget: Budget): BudgetResponseDto {
    const budgetJson = budget.toJSON();

    return {
      id: budgetJson.id,
      name: budgetJson.name,
      limit: budgetJson.limit,
      ownerId: budgetJson.ownerId,
      participantIds: budgetJson.participantIds,
      description: budgetJson.description,
      isActive: budgetJson.isActive,
      createdAt: budgetJson.createdAt,
      updatedAt: budgetJson.createdAt // Same as created initially
    };
  }

  static fromBudgetToListItemDto(budget: Budget, currentUserId: string): BudgetListItemDto {
    const budgetJson = budget.toJSON();

    return {
      id: budgetJson.id,
      name: budgetJson.name,
      limit: {
        valueInCents: budgetJson.limit.valueInCents,
        formatted: budgetJson.limit.formatted
      },
      participantCount: budget.getParticipantCount(),
      isActive: budgetJson.isActive,
      createdAt: budgetJson.createdAt,
      isOwner: budget.isOwner(currentUserId)
    };
  }

  static createBudgetListResponse(
    budgets: Budget[],
    currentUserId: string,
    page: number,
    limit: number,
    totalBudgets: number
  ): BudgetListResponseDto {
    const listItems = budgets.map(budget =>
      BudgetResponseMapper.fromBudgetToListItemDto(budget, currentUserId)
    );

    const activeBudgets = budgets.filter(b => b.isActive).length;
    const ownedBudgets = budgets.filter(b => b.isOwner(currentUserId)).length;
    const sharedBudgets = budgets.filter(b => !b.isOwner(currentUserId) && b.hasParticipant(currentUserId)).length;

    return {
      data: listItems,
      meta: createPaginationMeta(page, limit, totalBudgets),
      summary: {
        totalBudgets,
        activeBudgets,
        ownedBudgets,
        sharedBudgets
      }
    };
  }

  static fromBudgetToOverviewDto(
    budget: Budget,
    currentUserId: string,
    participants: ParticipantInfoDto[] = [],
    statistics = {
      totalSpent: { valueInCents: 0, formatted: 'R$ 0,00' },
      remainingLimit: { valueInCents: budget.limit.valueInCents, formatted: budget.formatLimit() },
      utilizationPercentage: 0,
      transactionCount: 0,
      lastTransactionAt: undefined as string | undefined
    }
  ): BudgetOverviewResponseDto {
    const baseResponse = BudgetResponseMapper.fromBudgetToResponseDto(budget);
    const isOwner = budget.isOwner(currentUserId);
    const hasParticipant = budget.hasParticipant(currentUserId);

    return {
      ...baseResponse,
      participants,
      statistics,
      permissions: {
        canEdit: isOwner,
        canDelete: isOwner,
        canAddParticipants: isOwner,
        canRemoveParticipants: isOwner,
        canViewTransactions: hasParticipant
      }
    };
  }

  static fromResponseDtoToBudget(dto: BudgetResponseDto): Either<ApplicationError, Budget> {
    // Validate DTO first
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Response DTO is required'));
    }

    // Create budget using Budget.create which handles validation properly
    const budgetProps = {
      name: dto.name,
      limitInCents: dto.limit.valueInCents,
      ownerId: dto.ownerId,
      participantIds: dto.participantIds,
      description: dto.description,
      isActive: dto.isActive
    };

    const budgetResult = Budget.create(budgetProps);

    if (budgetResult.hasError) {
      return Either.error(new ValidationError(
        'responseDto',
        `Failed to create Budget from response DTO: ${budgetResult.errors.join(', ')}`
      ));
    }

    return Either.success(budgetResult.data!);
  }

  static validateBudgetResponseDto(dto: BudgetResponseDto): Either<ApplicationError, true> {
    const errors: string[] = [];

    if (!dto.id || typeof dto.id !== 'string') {
      errors.push('ID is required and must be a string');
    }

    if (!dto.name || typeof dto.name !== 'string') {
      errors.push('Name is required and must be a string');
    }

    if (!dto.limit || typeof dto.limit !== 'object') {
      errors.push('Limit is required and must be an object');
    } else {
      if (typeof dto.limit.valueInCents !== 'number' || dto.limit.valueInCents < 0) {
        errors.push('Limit valueInCents must be a non-negative number');
      }
      if (typeof dto.limit.formatted !== 'string') {
        errors.push('Limit formatted must be a string');
      }
    }

    if (!dto.ownerId || typeof dto.ownerId !== 'string') {
      errors.push('Owner ID is required and must be a string');
    }

    if (!Array.isArray(dto.participantIds)) {
      errors.push('Participant IDs must be an array');
    }

    if (typeof dto.isActive !== 'boolean') {
      errors.push('IsActive must be a boolean');
    }

    if (!dto.createdAt || typeof dto.createdAt !== 'string') {
      errors.push('CreatedAt is required and must be a string');
    }

    if (errors.length > 0) {
      return Either.error(new ValidationError(
        'budgetResponseDto',
        `BudgetResponseDto validation failed: ${errors.join(', ')}`
      ));
    }

    return Either.success(true);
  }

  static createEmptyListResponse(): BudgetListResponseDto {
    return {
      data: [],
      meta: createPaginationMeta(1, 25, 0),
      summary: {
        totalBudgets: 0,
        activeBudgets: 0,
        ownedBudgets: 0,
        sharedBudgets: 0
      }
    };
  }
}