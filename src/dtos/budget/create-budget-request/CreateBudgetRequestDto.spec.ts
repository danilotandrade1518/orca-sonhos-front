import { CreateBudgetRequestDto, CreateBudgetRequestDtoHelper } from './CreateBudgetRequestDto';

describe('CreateBudgetRequestDto', () => {
  describe('CreateBudgetRequestDtoHelper.isValid', () => {
    it('should return true for valid DTO', () => {
      const validDto: CreateBudgetRequestDto = {
        name: 'Test Budget',
        ownerId: 'user-123',
        participantIds: ['user-456', 'user-789'],
        type: 'SHARED',
      };

      expect(CreateBudgetRequestDtoHelper.isValid(validDto)).toBe(true);
    });

    it('should return true for valid DTO without optional fields', () => {
      const validDto: CreateBudgetRequestDto = {
        name: 'Test Budget',
        ownerId: 'user-123',
      };

      expect(CreateBudgetRequestDtoHelper.isValid(validDto)).toBe(true);
    });

    it('should return false for invalid DTO with missing name', () => {
      const invalidDto = {
        ownerId: 'user-123',
      };

      expect(CreateBudgetRequestDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for invalid DTO with empty name', () => {
      const invalidDto = {
        name: '',
        ownerId: 'user-123',
      };

      expect(CreateBudgetRequestDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for invalid DTO with missing ownerId', () => {
      const invalidDto = {
        name: 'Test Budget',
      };

      expect(CreateBudgetRequestDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for invalid DTO with invalid type', () => {
      const invalidDto = {
        name: 'Test Budget',
        ownerId: 'user-123',
        type: 'INVALID_TYPE',
      };

      expect(CreateBudgetRequestDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for invalid DTO with non-string participantIds', () => {
      const invalidDto = {
        name: 'Test Budget',
        ownerId: 'user-123',
        participantIds: [123, 456],
      };

      expect(CreateBudgetRequestDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(CreateBudgetRequestDtoHelper.isValid(null)).toBe(false);
      expect(CreateBudgetRequestDtoHelper.isValid(undefined)).toBe(false);
    });
  });

  describe('CreateBudgetRequestDtoHelper.create', () => {
    it('should create DTO with all fields', () => {
      const data = {
        name: 'Test Budget',
        ownerId: 'user-123',
        participantIds: ['user-456', 'user-789'],
        type: 'SHARED' as const,
      };

      const dto = CreateBudgetRequestDtoHelper.create(data);

      expect(dto).toEqual(data);
    });

    it('should create DTO with only required fields', () => {
      const data = {
        name: 'Test Budget',
        ownerId: 'user-123',
      };

      const dto = CreateBudgetRequestDtoHelper.create(data);

      expect(dto.name).toBe(data.name);
      expect(dto.ownerId).toBe(data.ownerId);
      expect(dto.participantIds).toBeUndefined();
      expect(dto.type).toBeUndefined();
    });
  });

  describe('CreateBudgetRequestDtoHelper.validateName', () => {
    it('should return true for valid name', () => {
      expect(CreateBudgetRequestDtoHelper.validateName('Valid Name')).toBe(true);
    });

    it('should return false for empty name', () => {
      expect(CreateBudgetRequestDtoHelper.validateName('')).toBe(false);
    });

    it('should return false for whitespace-only name', () => {
      expect(CreateBudgetRequestDtoHelper.validateName('   ')).toBe(false);
    });

    it('should return false for name longer than 100 characters', () => {
      const longName = 'a'.repeat(101);
      expect(CreateBudgetRequestDtoHelper.validateName(longName)).toBe(false);
    });
  });

  describe('CreateBudgetRequestDtoHelper.validateOwnerId', () => {
    it('should return true for valid ownerId', () => {
      expect(CreateBudgetRequestDtoHelper.validateOwnerId('user-123')).toBe(true);
    });

    it('should return false for empty ownerId', () => {
      expect(CreateBudgetRequestDtoHelper.validateOwnerId('')).toBe(false);
    });
  });

  describe('CreateBudgetRequestDtoHelper.validateParticipantIds', () => {
    it('should return true for valid participantIds', () => {
      const validIds = ['user-1', 'user-2', 'user-3'];
      expect(CreateBudgetRequestDtoHelper.validateParticipantIds(validIds)).toBe(true);
    });

    it('should return false for empty array', () => {
      expect(CreateBudgetRequestDtoHelper.validateParticipantIds([])).toBe(true);
    });

    it('should return false for non-array', () => {
      expect(CreateBudgetRequestDtoHelper.validateParticipantIds('not-array' as any)).toBe(false);
    });

    it('should return false for array with non-string elements', () => {
      const invalidIds = ['user-1', 123, 'user-3'];
      expect(CreateBudgetRequestDtoHelper.validateParticipantIds(invalidIds as any)).toBe(false);
    });
  });
});
