import { BudgetResponseDto, BudgetResponseDtoHelper } from './BudgetResponseDto';

describe('BudgetResponseDto', () => {
  const validBudget: BudgetResponseDto = {
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

  describe('BudgetResponseDtoHelper.isValid', () => {
    it('should return true for valid DTO', () => {
      expect(BudgetResponseDtoHelper.isValid(validBudget)).toBe(true);
    });

    it('should return true for valid DTO without description', () => {
      const budgetWithoutDescription = { ...validBudget };
      delete budgetWithoutDescription.description;

      expect(BudgetResponseDtoHelper.isValid(budgetWithoutDescription)).toBe(true);
    });

    it('should return false for invalid DTO with missing id', () => {
      const invalidBudget = { ...validBudget };
      delete (invalidBudget as any).id;

      expect(BudgetResponseDtoHelper.isValid(invalidBudget)).toBe(false);
    });

    it('should return false for invalid DTO with invalid type', () => {
      const invalidBudget = { ...validBudget, type: 'INVALID_TYPE' as any };

      expect(BudgetResponseDtoHelper.isValid(invalidBudget)).toBe(false);
    });

    it('should return false for invalid DTO with non-array participantIds', () => {
      const invalidBudget = { ...validBudget, participantIds: 'not-array' as any };

      expect(BudgetResponseDtoHelper.isValid(invalidBudget)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(BudgetResponseDtoHelper.isValid(null)).toBe(false);
      expect(BudgetResponseDtoHelper.isValid(undefined)).toBe(false);
    });
  });

  describe('BudgetResponseDtoHelper.create', () => {
    it('should create DTO correctly', () => {
      const data = {
        id: 'budget-123',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T14:45:30.123Z',
        name: 'Test Budget',
        description: 'Test Description',
        type: 'SHARED' as const,
        ownerId: 'user-123',
        participantIds: ['user-456', 'user-789'],
        isActive: true,
      };

      const dto = BudgetResponseDtoHelper.create(data);

      expect(dto).toEqual(data);
    });
  });

  describe('BudgetResponseDtoHelper.isOwner', () => {
    it('should return true when user is owner', () => {
      expect(BudgetResponseDtoHelper.isOwner(validBudget, 'user-123')).toBe(true);
    });

    it('should return false when user is not owner', () => {
      expect(BudgetResponseDtoHelper.isOwner(validBudget, 'user-456')).toBe(false);
    });
  });

  describe('BudgetResponseDtoHelper.isParticipant', () => {
    it('should return true when user is participant', () => {
      expect(BudgetResponseDtoHelper.isParticipant(validBudget, 'user-456')).toBe(true);
    });

    it('should return false when user is not participant', () => {
      expect(BudgetResponseDtoHelper.isParticipant(validBudget, 'user-999')).toBe(false);
    });
  });

  describe('BudgetResponseDtoHelper.hasAccess', () => {
    it('should return true when user is owner', () => {
      expect(BudgetResponseDtoHelper.hasAccess(validBudget, 'user-123')).toBe(true);
    });

    it('should return true when user is participant', () => {
      expect(BudgetResponseDtoHelper.hasAccess(validBudget, 'user-456')).toBe(true);
    });

    it('should return false when user has no access', () => {
      expect(BudgetResponseDtoHelper.hasAccess(validBudget, 'user-999')).toBe(false);
    });
  });

  describe('BudgetResponseDtoHelper.getParticipantCount', () => {
    it('should return correct participant count', () => {
      expect(BudgetResponseDtoHelper.getParticipantCount(validBudget)).toBe(2);
    });
  });

  describe('BudgetResponseDtoHelper type checks', () => {
    it('should identify shared budget correctly', () => {
      expect(BudgetResponseDtoHelper.isShared(validBudget)).toBe(true);
    });

    it('should identify personal budget correctly', () => {
      const personalBudget = { ...validBudget, type: 'PERSONAL' as const };
      expect(BudgetResponseDtoHelper.isPersonal(personalBudget)).toBe(true);
      expect(BudgetResponseDtoHelper.isShared(personalBudget)).toBe(false);
    });
  });
});
