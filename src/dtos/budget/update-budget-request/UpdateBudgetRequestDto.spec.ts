import { UpdateBudgetRequestDto, UpdateBudgetRequestDtoHelper } from './UpdateBudgetRequestDto';

describe('UpdateBudgetRequestDto', () => {
  describe('UpdateBudgetRequestDtoHelper.isValid', () => {
    it('should return true for valid DTO with all fields', () => {
      const validDto: UpdateBudgetRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-456',
        name: 'Updated Budget',
      };

      expect(UpdateBudgetRequestDtoHelper.isValid(validDto)).toBe(true);
    });

    it('should return true for valid DTO without optional name', () => {
      const validDto: UpdateBudgetRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-456',
      };

      expect(UpdateBudgetRequestDtoHelper.isValid(validDto)).toBe(true);
    });

    it('should return false for invalid DTO with missing userId', () => {
      const invalidDto = {
        budgetId: 'budget-456',
        name: 'Updated Budget',
      };

      expect(UpdateBudgetRequestDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for invalid DTO with missing budgetId', () => {
      const invalidDto = {
        userId: 'user-123',
        name: 'Updated Budget',
      };

      expect(UpdateBudgetRequestDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for invalid DTO with empty name', () => {
      const invalidDto = {
        userId: 'user-123',
        budgetId: 'budget-456',
        name: '',
      };

      expect(UpdateBudgetRequestDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(UpdateBudgetRequestDtoHelper.isValid(null)).toBe(false);
      expect(UpdateBudgetRequestDtoHelper.isValid(undefined)).toBe(false);
    });
  });

  describe('UpdateBudgetRequestDtoHelper.create', () => {
    it('should create DTO with all fields', () => {
      const data = {
        userId: 'user-123',
        budgetId: 'budget-456',
        name: 'Updated Budget',
      };

      const dto = UpdateBudgetRequestDtoHelper.create(data);

      expect(dto).toEqual(data);
    });

    it('should create DTO without optional name', () => {
      const data = {
        userId: 'user-123',
        budgetId: 'budget-456',
      };

      const dto = UpdateBudgetRequestDtoHelper.create(data);

      expect(dto.userId).toBe(data.userId);
      expect(dto.budgetId).toBe(data.budgetId);
      expect(dto.name).toBeUndefined();
    });
  });

  describe('UpdateBudgetRequestDtoHelper.hasChanges', () => {
    it('should return true when name is provided', () => {
      const dto: UpdateBudgetRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-456',
        name: 'Updated Budget',
      };

      expect(UpdateBudgetRequestDtoHelper.hasChanges(dto)).toBe(true);
    });

    it('should return false when name is not provided', () => {
      const dto: UpdateBudgetRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-456',
      };

      expect(UpdateBudgetRequestDtoHelper.hasChanges(dto)).toBe(false);
    });
  });

  describe('UpdateBudgetRequestDtoHelper validation methods', () => {
    it('should validate userId correctly', () => {
      expect(UpdateBudgetRequestDtoHelper.validateUserId('user-123')).toBe(true);
      expect(UpdateBudgetRequestDtoHelper.validateUserId('')).toBe(false);
    });

    it('should validate budgetId correctly', () => {
      expect(UpdateBudgetRequestDtoHelper.validateBudgetId('budget-456')).toBe(true);
      expect(UpdateBudgetRequestDtoHelper.validateBudgetId('')).toBe(false);
    });

    it('should validate name correctly', () => {
      expect(UpdateBudgetRequestDtoHelper.validateName('Valid Name')).toBe(true);
      expect(UpdateBudgetRequestDtoHelper.validateName('')).toBe(false);
      expect(UpdateBudgetRequestDtoHelper.validateName('   ')).toBe(false);
      expect(UpdateBudgetRequestDtoHelper.validateName('a'.repeat(101))).toBe(false);
    });
  });
});
