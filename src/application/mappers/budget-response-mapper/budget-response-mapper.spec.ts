import { BudgetResponseMapper } from './budget-response-mapper';
import { Budget } from '../../../models/budget/budget';
import { Money } from '../../../models/shared/value-objects/money/money';
import { BudgetResponseDto, ParticipantInfoDto } from '../../dtos';

describe('BudgetResponseMapper', () => {
  let validBudget: Budget;

  beforeEach(() => {
    const budgetResult = Budget.create({
      name: 'Test Budget',
      limitInCents: 100000,
      ownerId: 'user-123',
      participantIds: ['user-456', 'user-789'],
      description: 'Test description',
      isActive: true
    });

    expect(budgetResult.hasData).toBe(true);
    validBudget = budgetResult.data!;
  });

  describe('fromBudgetToResponseDto', () => {
    it('should convert Budget domain model to BudgetResponseDto', () => {
      const result = BudgetResponseMapper.fromBudgetToResponseDto(validBudget);

      expect(result.id).toBe(validBudget.id);
      expect(result.name).toBe(validBudget.name);
      expect(result.limit.valueInCents).toBe(validBudget.limit.valueInCents);
      expect(result.limit.formatted).toBe(validBudget.formatLimit());
      expect(result.ownerId).toBe(validBudget.ownerId);
      expect(result.participantIds).toEqual(validBudget.participantIds);
      expect(result.description).toBe(validBudget.description);
      expect(result.isActive).toBe(validBudget.isActive);
      expect(result.createdAt).toBe(validBudget.createdAt.toISOString());
    });
  });

  describe('fromBudgetToListItemDto', () => {
    it('should convert Budget to BudgetListItemDto for owner', () => {
      const currentUserId = 'user-123'; // Owner

      const result = BudgetResponseMapper.fromBudgetToListItemDto(validBudget, currentUserId);

      expect(result.id).toBe(validBudget.id);
      expect(result.name).toBe(validBudget.name);
      expect(result.limit.valueInCents).toBe(validBudget.limit.valueInCents);
      expect(result.participantCount).toBe(3); // Owner + 2 participants
      expect(result.isOwner).toBe(true);
      expect(result.isActive).toBe(true);
    });

    it('should convert Budget to BudgetListItemDto for participant', () => {
      const currentUserId = 'user-456'; // Participant

      const result = BudgetResponseMapper.fromBudgetToListItemDto(validBudget, currentUserId);

      expect(result.isOwner).toBe(false);
      expect(result.participantCount).toBe(3);
    });
  });

  describe('createBudgetListResponse', () => {
    it('should create paginated budget list response', () => {
      const budgets = [validBudget];
      const currentUserId = 'user-123';
      const page = 1;
      const limit = 25;
      const totalBudgets = 1;

      const result = BudgetResponseMapper.createBudgetListResponse(
        budgets,
        currentUserId,
        page,
        limit,
        totalBudgets
      );

      expect(result.data.length).toBe(1);
      expect(result.data[0].id).toBe(validBudget.id);
      expect(result.meta.totalItems).toBe(1);
      expect(result.meta.currentPage).toBe(1);
      expect(result.summary.totalBudgets).toBe(1);
      expect(result.summary.activeBudgets).toBe(1);
      expect(result.summary.ownedBudgets).toBe(1);
      expect(result.summary.sharedBudgets).toBe(0);
    });

    it('should calculate summary correctly for mixed ownership', () => {
      const budget1Result = Budget.create({
        name: 'Budget 1',
        limitInCents: 100000,
        ownerId: 'user-123',
        isActive: true
      });
      const budget2Result = Budget.create({
        name: 'Budget 2',
        limitInCents: 200000,
        ownerId: 'user-456',
        participantIds: ['user-123'],
        isActive: false
      });

      expect(budget1Result.hasData).toBe(true);
      expect(budget2Result.hasData).toBe(true);

      const budgets = [budget1Result.data!, budget2Result.data!];
      const currentUserId = 'user-123';

      const result = BudgetResponseMapper.createBudgetListResponse(
        budgets,
        currentUserId,
        1,
        25,
        2
      );

      expect(result.summary.totalBudgets).toBe(2);
      expect(result.summary.activeBudgets).toBe(1);
      expect(result.summary.ownedBudgets).toBe(1);
      expect(result.summary.sharedBudgets).toBe(1);
    });
  });

  describe('fromBudgetToOverviewDto', () => {
    it('should create budget overview for owner', () => {
      const currentUserId = 'user-123';
      const participants: ParticipantInfoDto[] = [
        {
          id: 'user-123',
          name: 'Owner User',
          isOwner: true,
          joinedAt: new Date().toISOString()
        },
        {
          id: 'user-456',
          name: 'Participant User',
          isOwner: false,
          joinedAt: new Date().toISOString()
        }
      ];

      const result = BudgetResponseMapper.fromBudgetToOverviewDto(
        validBudget,
        currentUserId,
        participants
      );

      expect(result.id).toBe(validBudget.id);
      expect(result.participants).toEqual(participants);
      expect(result.permissions.canEdit).toBe(true);
      expect(result.permissions.canDelete).toBe(true);
      expect(result.permissions.canAddParticipants).toBe(true);
      expect(result.permissions.canRemoveParticipants).toBe(true);
      expect(result.permissions.canViewTransactions).toBe(true);
    });

    it('should create budget overview for participant', () => {
      const currentUserId = 'user-456';

      const result = BudgetResponseMapper.fromBudgetToOverviewDto(
        validBudget,
        currentUserId
      );

      expect(result.permissions.canEdit).toBe(false);
      expect(result.permissions.canDelete).toBe(false);
      expect(result.permissions.canAddParticipants).toBe(false);
      expect(result.permissions.canRemoveParticipants).toBe(false);
      expect(result.permissions.canViewTransactions).toBe(true);
    });
  });

  describe('fromResponseDtoToBudget', () => {
    it('should convert valid BudgetResponseDto to Budget domain model', () => {
      const dto: BudgetResponseDto = {
        id: 'budget-123',
        name: 'Test Budget',
        limit: {
          valueInCents: 100000,
          valueInMonetary: 1000,
          formatted: 'R$ 1.000,00'
        },
        ownerId: 'user-123',
        participantIds: ['user-456'],
        description: 'Test description',
        isActive: true,
        createdAt: '2023-01-01T00:00:00.000Z'
      };

      const result = BudgetResponseMapper.fromResponseDtoToBudget(dto);

      expect(result.hasData).toBe(true);
      expect(result.data?.name).toBe('Test Budget');
      expect(result.data?.limit.valueInCents).toBe(100000);
      expect(result.data?.ownerId).toBe('user-123');
    });

    it('should return error for invalid BudgetResponseDto', () => {
      const dto = {
        id: 'budget-123',
        name: '',
        limit: { valueInCents: -100 }
      } as BudgetResponseDto;

      const result = BudgetResponseMapper.fromResponseDtoToBudget(dto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].code).toBe('VALIDATION_ERROR');
    });
  });

  describe('validateBudgetResponseDto', () => {
    it('should validate correct BudgetResponseDto', () => {
      const dto: BudgetResponseDto = {
        id: 'budget-123',
        name: 'Test Budget',
        limit: {
          valueInCents: 100000,
          valueInMonetary: 1000,
          formatted: 'R$ 1.000,00'
        },
        ownerId: 'user-123',
        participantIds: [],
        description: 'Test',
        isActive: true,
        createdAt: '2023-01-01T00:00:00.000Z'
      };

      const result = BudgetResponseMapper.validateBudgetResponseDto(dto);

      expect(result.hasData).toBe(true);
    });

    it('should return validation error for invalid DTO', () => {
      const dto = {
        id: '',
        name: 123,
        limit: 'invalid',
        participantIds: 'not-array'
      } as unknown as BudgetResponseDto;

      const result = BudgetResponseMapper.validateBudgetResponseDto(dto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].code).toBe('VALIDATION_ERROR');
    });
  });

  describe('createEmptyListResponse', () => {
    it('should create empty budget list response', () => {
      const result = BudgetResponseMapper.createEmptyListResponse();

      expect(result.data.length).toBe(0);
      expect(result.meta.totalItems).toBe(0);
      expect(result.summary.totalBudgets).toBe(0);
      expect(result.summary.activeBudgets).toBe(0);
      expect(result.summary.ownedBudgets).toBe(0);
      expect(result.summary.sharedBudgets).toBe(0);
    });
  });
});