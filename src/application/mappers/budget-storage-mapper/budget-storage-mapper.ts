import { Either } from '../../../shared/core/either/either';
import { Budget } from '../../../models/budget/budget';
import { ApplicationError, ValidationError } from '../../errors';
import { BudgetStorageDto, SyncOperationDto, SyncOperationType } from '../../dtos';

export class BudgetStorageMapper {
  static fromBudgetToStorageDto(
    budget: Budget,
    syncStatus: 'synced' | 'pending' | 'conflict' | 'error' = 'synced',
    version: number = 1,
    lastSyncAt?: Date
  ): BudgetStorageDto {
    const budgetJson = budget.toJSON();

    return {
      id: budgetJson.id,
      name: budgetJson.name,
      limitInCents: budgetJson.limit.valueInCents,
      ownerId: budgetJson.ownerId,
      participantIds: budgetJson.participantIds,
      description: budgetJson.description,
      isActive: budgetJson.isActive,
      createdAt: budgetJson.createdAt,
      updatedAt: new Date().toISOString(),
      lastSyncAt: lastSyncAt?.toISOString(),
      syncStatus,
      version
    };
  }

  static fromStorageDtoToBudget(dto: BudgetStorageDto): Either<ApplicationError, Budget> {
    // Validate DTO first
    if (!dto || typeof dto !== 'object') {
      return Either.error(new ValidationError('dto', 'Storage DTO is required'));
    }

    // Create budget using Budget.create which handles validation properly
    const budgetProps = {
      name: dto.name,
      limitInCents: dto.limitInCents,
      ownerId: dto.ownerId,
      participantIds: dto.participantIds,
      description: dto.description,
      isActive: dto.isActive
    };

    const budgetResult = Budget.create(budgetProps);

    if (budgetResult.hasError) {
      return Either.error(new ValidationError(
        'storageDto',
        `Failed to create Budget from storage DTO: ${budgetResult.errors.join(', ')}`
      ));
    }

    return Either.success(budgetResult.data!);
  }

  static updateStorageDto(
    existingDto: BudgetStorageDto,
    updates: Partial<Pick<BudgetStorageDto, 'name' | 'limitInCents' | 'description' | 'isActive' | 'participantIds'>>,
    syncStatus: 'synced' | 'pending' | 'conflict' | 'error' = 'pending'
  ): BudgetStorageDto {
    return {
      ...existingDto,
      ...updates,
      updatedAt: new Date().toISOString(),
      syncStatus,
      version: existingDto.version + 1
    };
  }

  static markAsSynced(dto: BudgetStorageDto): BudgetStorageDto {
    return {
      ...dto,
      syncStatus: 'synced',
      lastSyncAt: new Date().toISOString()
    };
  }

  static markAsConflicted(dto: BudgetStorageDto): BudgetStorageDto {
    return {
      ...dto,
      syncStatus: 'conflict'
    };
  }

  static markAsError(dto: BudgetStorageDto): BudgetStorageDto {
    return {
      ...dto,
      syncStatus: 'error'
    };
  }

  static createSyncOperation(
    type: SyncOperationType,
    budgetId: string,
    operationData: Record<string, unknown>,
    userId: string,
    priority: 'low' | 'normal' | 'high' | 'critical' = 'normal'
  ): SyncOperationDto {
    return {
      id: crypto.randomUUID(),
      type,
      entityId: budgetId,
      entityType: 'budget',
      operation: {
        type,
        data: operationData,
        timestamp: new Date().toISOString(),
        userId
      },
      status: 'pending',
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attempts: 0,
      maxAttempts: 3
    };
  }

  static createCreateSyncOperation(
    budget: Budget,
    userId: string,
    priority: 'low' | 'normal' | 'high' | 'critical' = 'normal'
  ): SyncOperationDto {
    const budgetJson = budget.toJSON();

    return BudgetStorageMapper.createSyncOperation(
      'create',
      budget.id,
      {
        name: budgetJson.name,
        limitInCents: budgetJson.limit.valueInCents,
        ownerId: budgetJson.ownerId,
        participantIds: budgetJson.participantIds,
        description: budgetJson.description,
        isActive: budgetJson.isActive
      },
      userId,
      priority
    );
  }

  static createUpdateSyncOperation(
    budgetId: string,
    updates: Record<string, unknown>,
    userId: string,
    priority: 'low' | 'normal' | 'high' | 'critical' = 'normal'
  ): SyncOperationDto {
    return BudgetStorageMapper.createSyncOperation(
      'update',
      budgetId,
      updates,
      userId,
      priority
    );
  }

  static createDeleteSyncOperation(
    budgetId: string,
    userId: string,
    priority: 'low' | 'normal' | 'high' | 'critical' = 'high'
  ): SyncOperationDto {
    return BudgetStorageMapper.createSyncOperation(
      'delete',
      budgetId,
      { budgetId },
      userId,
      priority
    );
  }

  static createAddParticipantSyncOperation(
    budgetId: string,
    participantId: string,
    userId: string,
    priority: 'low' | 'normal' | 'high' | 'critical' = 'normal'
  ): SyncOperationDto {
    return BudgetStorageMapper.createSyncOperation(
      'add_participant',
      budgetId,
      { participantId },
      userId,
      priority
    );
  }

  static createRemoveParticipantSyncOperation(
    budgetId: string,
    participantId: string,
    userId: string,
    priority: 'low' | 'normal' | 'high' | 'critical' = 'normal'
  ): SyncOperationDto {
    return BudgetStorageMapper.createSyncOperation(
      'remove_participant',
      budgetId,
      { participantId },
      userId,
      priority
    );
  }

  static validateStorageDto(dto: BudgetStorageDto): Either<ApplicationError, true> {
    const errors: string[] = [];

    if (!dto.id || typeof dto.id !== 'string') {
      errors.push('ID is required and must be a string');
    }

    if (!dto.name || typeof dto.name !== 'string') {
      errors.push('Name is required and must be a string');
    }

    if (typeof dto.limitInCents !== 'number' || dto.limitInCents < 0) {
      errors.push('LimitInCents must be a non-negative number');
    }

    if (!dto.ownerId || typeof dto.ownerId !== 'string') {
      errors.push('Owner ID is required and must be a string');
    }

    if (!Array.isArray(dto.participantIds)) {
      errors.push('Participant IDs must be an array');
    }

    if (typeof dto.description !== 'string') {
      errors.push('Description must be a string');
    }

    if (typeof dto.isActive !== 'boolean') {
      errors.push('IsActive must be a boolean');
    }

    if (!dto.createdAt || typeof dto.createdAt !== 'string') {
      errors.push('CreatedAt is required and must be a string');
    }

    if (!dto.updatedAt || typeof dto.updatedAt !== 'string') {
      errors.push('UpdatedAt is required and must be a string');
    }

    if (!['synced', 'pending', 'conflict', 'error'].includes(dto.syncStatus)) {
      errors.push('SyncStatus must be one of: synced, pending, conflict, error');
    }

    if (typeof dto.version !== 'number' || dto.version < 1) {
      errors.push('Version must be a positive number');
    }

    if (errors.length > 0) {
      return Either.error(new ValidationError(
        'budgetStorageDto',
        `BudgetStorageDto validation failed: ${errors.join(', ')}`
      ));
    }

    return Either.success(true);
  }

  static isStorageConflicted(dto: BudgetStorageDto): boolean {
    return dto.syncStatus === 'conflict';
  }

  static isPendingSync(dto: BudgetStorageDto): boolean {
    return dto.syncStatus === 'pending';
  }

  static needsSync(dto: BudgetStorageDto): boolean {
    return dto.syncStatus === 'pending' || dto.syncStatus === 'error';
  }

  static createStorageMetadata(
    storageVersion: string = '1.0.0',
    totalStoredBudgets: number = 0,
    storageQuotaUsed: number = 0,
    storageQuotaLimit: number = 50 * 1024 * 1024 // 50MB default
  ) {
    return {
      storageVersion,
      lastCleanupAt: new Date().toISOString(),
      totalStoredBudgets,
      storageQuotaUsed,
      storageQuotaLimit
    };
  }
}