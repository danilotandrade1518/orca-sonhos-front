import {
  AddParticipantRequestDto,
  AddParticipantRequestDtoHelper,
} from './AddParticipantRequestDto';

describe('AddParticipantRequestDto', () => {
  describe('AddParticipantRequestDtoHelper.isValid', () => {
    it('should return true for valid DTO', () => {
      const validDto: AddParticipantRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-456',
        participantId: 'user-789',
      };

      expect(AddParticipantRequestDtoHelper.isValid(validDto)).toBe(true);
    });

    it('should return false for invalid DTO with missing userId', () => {
      const invalidDto = {
        budgetId: 'budget-456',
        participantId: 'user-789',
      };

      expect(AddParticipantRequestDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for invalid DTO with missing budgetId', () => {
      const invalidDto = {
        userId: 'user-123',
        participantId: 'user-789',
      };

      expect(AddParticipantRequestDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for invalid DTO with missing participantId', () => {
      const invalidDto = {
        userId: 'user-123',
        budgetId: 'budget-456',
      };

      expect(AddParticipantRequestDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(AddParticipantRequestDtoHelper.isValid(null)).toBe(false);
      expect(AddParticipantRequestDtoHelper.isValid(undefined)).toBe(false);
    });
  });

  describe('AddParticipantRequestDtoHelper.create', () => {
    it('should create DTO correctly', () => {
      const data = {
        userId: 'user-123',
        budgetId: 'budget-456',
        participantId: 'user-789',
      };

      const dto = AddParticipantRequestDtoHelper.create(data);

      expect(dto).toEqual(data);
    });
  });

  describe('AddParticipantRequestDtoHelper.isSelfAddition', () => {
    it('should return true when userId equals participantId', () => {
      const dto: AddParticipantRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-456',
        participantId: 'user-123',
      };

      expect(AddParticipantRequestDtoHelper.isSelfAddition(dto)).toBe(true);
    });

    it('should return false when userId differs from participantId', () => {
      const dto: AddParticipantRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-456',
        participantId: 'user-789',
      };

      expect(AddParticipantRequestDtoHelper.isSelfAddition(dto)).toBe(false);
    });
  });

  describe('AddParticipantRequestDtoHelper validation methods', () => {
    it('should validate userId correctly', () => {
      expect(AddParticipantRequestDtoHelper.validateUserId('user-123')).toBe(true);
      expect(AddParticipantRequestDtoHelper.validateUserId('')).toBe(false);
    });

    it('should validate budgetId correctly', () => {
      expect(AddParticipantRequestDtoHelper.validateBudgetId('budget-456')).toBe(true);
      expect(AddParticipantRequestDtoHelper.validateBudgetId('')).toBe(false);
    });

    it('should validate participantId correctly', () => {
      expect(AddParticipantRequestDtoHelper.validateParticipantId('user-789')).toBe(true);
      expect(AddParticipantRequestDtoHelper.validateParticipantId('')).toBe(false);
    });
  });
});
