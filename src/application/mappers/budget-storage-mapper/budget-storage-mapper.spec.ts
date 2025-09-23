import { BudgetStorageMapper } from './budget-storage-mapper';
import { Budget } from '../../../models/budget/budget';
import { BudgetStorageDto } from '../../dtos';

describe('BudgetStorageMapper', () => {
  let validBudget: Budget;
  let validStorageDto: BudgetStorageDto;

  beforeEach(() => {
    const budgetResult = Budget.create({
      name: 'Test Budget',
      limitInCents: 100000,
      ownerId: 'user-123',
      participantIds: ['user-456'],
      description: 'Test description',
      isActive: true
    });

    expect(budgetResult.hasData).toBe(true);
    validBudget = budgetResult.data!;

    validStorageDto = {
      id: 'budget-123',
      name: 'Test Budget',
      limitInCents: 100000,
      ownerId: 'user-123',
      participantIds: ['user-456'],
      description: 'Test description',
      isActive: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      lastSyncAt: '2023-01-01T00:00:00.000Z',
      syncStatus: 'synced',
      version: 1
    };
  });

  describe('fromBudgetToStorageDto', () => {
    it('should convert Budget domain model to BudgetStorageDto', () => {
      const result = BudgetStorageMapper.fromBudgetToStorageDto(validBudget);

      expect(result.id).toBe(validBudget.id);
      expect(result.name).toBe(validBudget.name);
      expect(result.limitInCents).toBe(validBudget.limit.valueInCents);
      expect(result.ownerId).toBe(validBudget.ownerId);
      expect(result.participantIds).toEqual(validBudget.participantIds);
      expect(result.description).toBe(validBudget.description);
      expect(result.isActive).toBe(validBudget.isActive);
      expect(result.syncStatus).toBe('synced');
      expect(result.version).toBe(1);
    });

    it('should set custom sync status and version', () => {
      const lastSyncAt = new Date('2023-01-01');

      const result = BudgetStorageMapper.fromBudgetToStorageDto(
        validBudget,
        'pending',
        5,
        lastSyncAt
      );

      expect(result.syncStatus).toBe('pending');
      expect(result.version).toBe(5);
      expect(result.lastSyncAt).toBe(lastSyncAt.toISOString());
    });
  });

  describe('fromStorageDtoToBudget', () => {
    it('should convert valid BudgetStorageDto to Budget domain model', () => {
      const result = BudgetStorageMapper.fromStorageDtoToBudget(validStorageDto);

      expect(result.hasData).toBe(true);
      expect(result.data?.name).toBe(validStorageDto.name);
      expect(result.data?.limit.valueInCents).toBe(validStorageDto.limitInCents);
      expect(result.data?.ownerId).toBe(validStorageDto.ownerId);
    });

    it('should return error for invalid storage DTO', () => {
      const invalidDto = {
        ...validStorageDto,
        name: '', // Invalid empty name
        limitInCents: -100 // Invalid negative limit
      };

      const result = BudgetStorageMapper.fromStorageDtoToBudget(invalidDto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].code).toBe('VALIDATION_ERROR');
    });
  });

  describe('updateStorageDto', () => {
    it('should update storage DTO with new values', () => {
      const updates = {
        name: 'Updated Budget',
        limitInCents: 200000,
        description: 'Updated description'
      };

      const result = BudgetStorageMapper.updateStorageDto(
        validStorageDto,
        updates,
        'pending'
      );

      expect(result.name).toBe('Updated Budget');
      expect(result.limitInCents).toBe(200000);
      expect(result.description).toBe('Updated description');
      expect(result.syncStatus).toBe('pending');
      expect(result.version).toBe(2); // Incremented
      expect(result.updatedAt).not.toBe(validStorageDto.updatedAt);
    });
  });

  describe('sync status methods', () => {
    it('should mark as synced', () => {
      const pendingDto = { ...validStorageDto, syncStatus: 'pending' as const };

      const result = BudgetStorageMapper.markAsSynced(pendingDto);

      expect(result.syncStatus).toBe('synced');
      expect(result.lastSyncAt).toBeDefined();
    });

    it('should mark as conflicted', () => {
      const result = BudgetStorageMapper.markAsConflicted(validStorageDto);

      expect(result.syncStatus).toBe('conflict');
    });

    it('should mark as error', () => {
      const result = BudgetStorageMapper.markAsError(validStorageDto);

      expect(result.syncStatus).toBe('error');
    });
  });

  describe('sync operation creation', () => {
    it('should create generic sync operation', () => {
      const operationData = { name: 'Updated Budget' };

      const result = BudgetStorageMapper.createSyncOperation(
        'update',
        'budget-123',
        operationData,
        'user-123',
        'high'
      );

      expect(result.type).toBe('update');
      expect(result.entityId).toBe('budget-123');
      expect(result.entityType).toBe('budget');
      expect(result.operation.type).toBe('update');
      expect(result.operation.data).toEqual(operationData);
      expect(result.operation.userId).toBe('user-123');
      expect(result.status).toBe('pending');
      expect(result.priority).toBe('high');
      expect(result.attempts).toBe(0);
      expect(result.maxAttempts).toBe(3);
    });

    it('should create create sync operation', () => {
      const result = BudgetStorageMapper.createCreateSyncOperation(
        validBudget,
        'user-123',
        'normal'
      );

      expect(result.type).toBe('create');
      expect(result.entityId).toBe(validBudget.id);
      const operationData = result.operation.data as any;
      expect(operationData.name).toBe(validBudget.name);
      expect(operationData.limitInCents).toBe(validBudget.limit.valueInCents);
      expect(operationData.ownerId).toBe(validBudget.ownerId);
    });

    it('should create delete sync operation', () => {
      const result = BudgetStorageMapper.createDeleteSyncOperation(
        'budget-123',
        'user-123'
      );

      expect(result.type).toBe('delete');
      expect(result.priority).toBe('high'); // Delete operations are high priority by default
      expect(result.operation.data).toEqual({ budgetId: 'budget-123' });
    });

    it('should create add participant sync operation', () => {
      const result = BudgetStorageMapper.createAddParticipantSyncOperation(
        'budget-123',
        'user-456',
        'user-123'
      );

      expect(result.type).toBe('add_participant');
      expect(result.operation.data).toEqual({ participantId: 'user-456' });
    });

    it('should create remove participant sync operation', () => {
      const result = BudgetStorageMapper.createRemoveParticipantSyncOperation(
        'budget-123',
        'user-456',
        'user-123'
      );

      expect(result.type).toBe('remove_participant');
      expect(result.operation.data).toEqual({ participantId: 'user-456' });
    });
  });

  describe('validateStorageDto', () => {
    it('should validate correct BudgetStorageDto', () => {
      const result = BudgetStorageMapper.validateStorageDto(validStorageDto);

      expect(result.hasData).toBe(true);
    });

    it('should return validation error for invalid DTO', () => {
      const invalidDto = {
        ...validStorageDto,
        id: '', // Invalid empty ID
        limitInCents: -100, // Invalid negative limit
        syncStatus: 'invalid' // Invalid sync status
      } as unknown as BudgetStorageDto;

      const result = BudgetStorageMapper.validateStorageDto(invalidDto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].code).toBe('VALIDATION_ERROR');
    });
  });

  describe('storage status checks', () => {
    it('should check if storage is conflicted', () => {
      const conflictedDto = { ...validStorageDto, syncStatus: 'conflict' as const };

      expect(BudgetStorageMapper.isStorageConflicted(conflictedDto)).toBe(true);
      expect(BudgetStorageMapper.isStorageConflicted(validStorageDto)).toBe(false);
    });

    it('should check if storage is pending sync', () => {
      const pendingDto = { ...validStorageDto, syncStatus: 'pending' as const };

      expect(BudgetStorageMapper.isPendingSync(pendingDto)).toBe(true);
      expect(BudgetStorageMapper.isPendingSync(validStorageDto)).toBe(false);
    });

    it('should check if storage needs sync', () => {
      const pendingDto = { ...validStorageDto, syncStatus: 'pending' as const };
      const errorDto = { ...validStorageDto, syncStatus: 'error' as const };

      expect(BudgetStorageMapper.needsSync(pendingDto)).toBe(true);
      expect(BudgetStorageMapper.needsSync(errorDto)).toBe(true);
      expect(BudgetStorageMapper.needsSync(validStorageDto)).toBe(false);
    });
  });

  describe('createStorageMetadata', () => {
    it('should create storage metadata with defaults', () => {
      const result = BudgetStorageMapper.createStorageMetadata();

      expect(result.storageVersion).toBe('1.0.0');
      expect(result.totalStoredBudgets).toBe(0);
      expect(result.storageQuotaLimit).toBe(50 * 1024 * 1024);
      expect(result.lastCleanupAt).toBeDefined();
    });

    it('should create storage metadata with custom values', () => {
      const result = BudgetStorageMapper.createStorageMetadata(
        '2.0.0',
        10,
        1000,
        2000
      );

      expect(result.storageVersion).toBe('2.0.0');
      expect(result.totalStoredBudgets).toBe(10);
      expect(result.storageQuotaUsed).toBe(1000);
      expect(result.storageQuotaLimit).toBe(2000);
    });
  });
});