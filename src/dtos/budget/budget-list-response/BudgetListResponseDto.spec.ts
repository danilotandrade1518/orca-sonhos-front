import { BudgetListResponseDto, BudgetListResponseDtoHelper } from './BudgetListResponseDto';
import { BudgetResponseDto } from '../budget-response/BudgetResponseDto';

describe('BudgetListResponseDto', () => {
  const mockBudget: BudgetResponseDto = {
    id: 'budget-123',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T14:45:30.123Z',
    name: 'Test Budget',
    description: 'Test Description',
    type: 'SHARED',
    ownerId: 'user-123',
    participantIds: ['user-456', 'user-789'],
    isActive: true,
  };

  const validListDto: BudgetListResponseDto = {
    budgets: [mockBudget],
    total: 1,
    page: 1,
    pageSize: 10,
  };

  describe('BudgetListResponseDtoHelper.isValid', () => {
    it('should return true for valid DTO', () => {
      expect(BudgetListResponseDtoHelper.isValid(validListDto)).toBe(true);
    });

    it('should return false for invalid DTO with missing budgets', () => {
      const invalidDto = { ...validListDto };
      delete (invalidDto as any).budgets;

      expect(BudgetListResponseDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for invalid DTO with negative total', () => {
      const invalidDto = { ...validListDto, total: -1 };

      expect(BudgetListResponseDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for invalid DTO with invalid page', () => {
      const invalidDto = { ...validListDto, page: 0 };

      expect(BudgetListResponseDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for invalid DTO with invalid pageSize', () => {
      const invalidDto = { ...validListDto, pageSize: 0 };

      expect(BudgetListResponseDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(BudgetListResponseDtoHelper.isValid(null)).toBe(false);
      expect(BudgetListResponseDtoHelper.isValid(undefined)).toBe(false);
    });
  });

  describe('BudgetListResponseDtoHelper.create', () => {
    it('should create DTO correctly', () => {
      const data = {
        budgets: [mockBudget],
        total: 1,
        page: 1,
        pageSize: 10,
      };

      const dto = BudgetListResponseDtoHelper.create(data);

      expect(dto).toEqual(data);
    });
  });

  describe('BudgetListResponseDtoHelper pagination methods', () => {
    it('should calculate total pages correctly', () => {
      expect(BudgetListResponseDtoHelper.getTotalPages(validListDto)).toBe(1);

      const multiPageDto = { ...validListDto, total: 25, pageSize: 10 };
      expect(BudgetListResponseDtoHelper.getTotalPages(multiPageDto)).toBe(3);
    });

    it('should detect next page correctly', () => {
      expect(BudgetListResponseDtoHelper.hasNextPage(validListDto)).toBe(false);

      const multiPageDto = { ...validListDto, total: 25, pageSize: 10, page: 1 };
      expect(BudgetListResponseDtoHelper.hasNextPage(multiPageDto)).toBe(true);
    });

    it('should detect previous page correctly', () => {
      expect(BudgetListResponseDtoHelper.hasPreviousPage(validListDto)).toBe(false);

      const multiPageDto = { ...validListDto, page: 2 };
      expect(BudgetListResponseDtoHelper.hasPreviousPage(multiPageDto)).toBe(true);
    });
  });

  describe('BudgetListResponseDtoHelper filtering methods', () => {
    const mixedBudgets: BudgetResponseDto[] = [
      { ...mockBudget, id: '1', isActive: true, type: 'PERSONAL', ownerId: 'user-1' },
      { ...mockBudget, id: '2', isActive: false, type: 'SHARED', ownerId: 'user-2' },
      { ...mockBudget, id: '3', isActive: true, type: 'SHARED', ownerId: 'user-3' },
    ];

    const listWithMixedBudgets: BudgetListResponseDto = {
      budgets: mixedBudgets,
      total: 3,
      page: 1,
      pageSize: 10,
    };

    it('should detect empty list', () => {
      const emptyList = { ...validListDto, budgets: [] };
      expect(BudgetListResponseDtoHelper.isEmpty(emptyList)).toBe(true);
      expect(BudgetListResponseDtoHelper.isEmpty(validListDto)).toBe(false);
    });

    it('should filter active budgets', () => {
      const activeBudgets = BudgetListResponseDtoHelper.getActiveBudgets(listWithMixedBudgets);
      expect(activeBudgets.length).toBe(2);
      expect(activeBudgets.every((b) => b.isActive)).toBe(true);
    });

    it('should filter personal budgets', () => {
      const personalBudgets = BudgetListResponseDtoHelper.getPersonalBudgets(listWithMixedBudgets);
      expect(personalBudgets.length).toBe(1);
      expect(personalBudgets.every((b) => b.type === 'PERSONAL')).toBe(true);
    });

    it('should filter shared budgets', () => {
      const sharedBudgets = BudgetListResponseDtoHelper.getSharedBudgets(listWithMixedBudgets);
      expect(sharedBudgets.length).toBe(2);
      expect(sharedBudgets.every((b) => b.type === 'SHARED')).toBe(true);
    });

    it('should filter budgets by owner', () => {
      const ownerBudgets = BudgetListResponseDtoHelper.getBudgetsByOwner(
        listWithMixedBudgets,
        'user-1'
      );
      expect(ownerBudgets.length).toBe(1);
      expect(ownerBudgets[0].ownerId).toBe('user-1');
    });

    it('should filter budgets by participant', () => {
      const participantBudgets = BudgetListResponseDtoHelper.getBudgetsByParticipant(
        listWithMixedBudgets,
        'user-456'
      );
      expect(participantBudgets.length).toBe(3); // All budgets have this participant
    });
  });
});
