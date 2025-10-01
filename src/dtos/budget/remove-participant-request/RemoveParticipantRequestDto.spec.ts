import {
  RemoveParticipantRequestDto,
  RemoveParticipantRequestDtoHelper,
} from './RemoveParticipantRequestDto';

describe('RemoveParticipantRequestDto', () => {
  describe('RemoveParticipantRequestDtoHelper.isValid', () => {
    it('should return true for valid DTO', () => {
      const validDto: RemoveParticipantRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-456',
        participantId: 'user-789',
      };

      expect(RemoveParticipantRequestDtoHelper.isValid(validDto)).toBe(true);
    });

    it('should return false for invalid DTO with missing userId', () => {
      const invalidDto = {
        budgetId: 'budget-456',
        participantId: 'user-789',
      };

      expect(RemoveParticipantRequestDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for invalid DTO with missing budgetId', () => {
      const invalidDto = {
        userId: 'user-123',
        participantId: 'user-789',
      };

      expect(RemoveParticipantRequestDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for invalid DTO with missing participantId', () => {
      const invalidDto = {
        userId: 'user-123',
        budgetId: 'budget-456',
      };

      expect(RemoveParticipantRequestDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(RemoveParticipantRequestDtoHelper.isValid(null)).toBe(false);
      expect(RemoveParticipantRequestDtoHelper.isValid(undefined)).toBe(false);
    });
  });

  describe('RemoveParticipantRequestDtoHelper.create', () => {
    it('should create DTO correctly', () => {
      const data = {
        userId: 'user-123',
        budgetId: 'budget-456',
        participantId: 'user-789',
      };

      const dto = RemoveParticipantRequestDtoHelper.create(data);

      expect(dto).toEqual(data);
    });
  });

  describe('RemoveParticipantRequestDtoHelper.isSelfRemoval', () => {
    it('should return true when userId equals participantId', () => {
      const dto: RemoveParticipantRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-456',
        participantId: 'user-123',
      };

      expect(RemoveParticipantRequestDtoHelper.isSelfRemoval(dto)).toBe(true);
    });

    it('should return false when userId differs from participantId', () => {
      const dto: RemoveParticipantRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-456',
        participantId: 'user-789',
      };

      expect(RemoveParticipantRequestDtoHelper.isSelfRemoval(dto)).toBe(false);
    });
  });

  describe('RemoveParticipantRequestDtoHelper validation methods', () => {
    it('should validate userId correctly', () => {
      expect(RemoveParticipantRequestDtoHelper.validateUserId('user-123')).toBe(true);
      expect(RemoveParticipantRequestDtoHelper.validateUserId('')).toBe(false);
    });

    it('should validate budgetId correctly', () => {
      expect(RemoveParticipantRequestDtoHelper.validateBudgetId('budget-456')).toBe(true);
      expect(RemoveParticipantRequestDtoHelper.validateBudgetId('')).toBe(false);
    });

    it('should validate participantId correctly', () => {
      expect(RemoveParticipantRequestDtoHelper.validateParticipantId('user-789')).toBe(true);
      expect(RemoveParticipantRequestDtoHelper.validateParticipantId('')).toBe(false);
    });
  });
});
