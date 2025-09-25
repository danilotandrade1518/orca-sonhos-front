import { BudgetRequestMapper } from './budget-request-mapper';
import { ValidationError } from '../../errors';
import {
  CreateBudgetRequestDto,
  UpdateBudgetRequestDto,
  AddParticipantRequestDto,
  RemoveParticipantRequestDto,
  DeleteBudgetRequestDto
} from '../../dtos';

describe('BudgetRequestMapper', () => {
  describe('fromCreateRequestToBudget', () => {
    it('should convert valid CreateBudgetRequestDto to Budget model', () => {
      const dto: CreateBudgetRequestDto = {
        name: 'Test Budget',
        limitInCents: 100000,
        ownerId: 'user-123',
        participantIds: ['user-456', 'user-789'],
        description: 'Test description',
        isActive: true
      };

      const result = BudgetRequestMapper.fromCreateRequestToBudget(dto);

      expect(result.hasData).toBe(true);
      expect(result.data?.name).toBe('Test Budget');
      expect(result.data?.limit.valueInCents).toBe(100000);
      expect(result.data?.ownerId).toBe('user-123');
      expect(result.data?.participantIds).toEqual(['user-456', 'user-789']);
      expect(result.data?.description).toBe('Test description');
      expect(result.data?.isActive).toBe(true);
    });

    it('should handle optional fields correctly', () => {
      const dto: CreateBudgetRequestDto = {
        name: 'Test Budget',
        limitInCents: 100000,
        ownerId: 'user-123'
      };

      const result = BudgetRequestMapper.fromCreateRequestToBudget(dto);

      expect(result.hasData).toBe(true);
      expect(result.data?.participantIds).toEqual([]);
      expect(result.data?.description).toBe('');
      expect(result.data?.isActive).toBe(true);
    });

    it('should return validation error when Budget model creation fails', () => {
      const dto: CreateBudgetRequestDto = {
        name: '',
        limitInCents: 100000,
        ownerId: 'user-123'
      };

      const result = BudgetRequestMapper.fromCreateRequestToBudget(dto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Budget creation failed');
    });

    it('should return validation error when limitInCents is negative', () => {
      const dto: CreateBudgetRequestDto = {
        name: 'Test Budget',
        limitInCents: -100,
        ownerId: 'user-123'
      };

      const result = BudgetRequestMapper.fromCreateRequestToBudget(dto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Budget creation failed');
    });

    it('should return validation error when dto is null or invalid', () => {
      const result = BudgetRequestMapper.fromCreateRequestToBudget(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Request DTO is required');
    });
  });

  describe('validateUpdateRequest', () => {
    it('should validate valid UpdateBudgetRequestDto', () => {
      const dto: UpdateBudgetRequestDto = {
        budgetId: 'budget-123',
        name: 'Updated Budget',
        limitInCents: 200000,
        description: 'Updated description',
        isActive: false
      };

      const result = BudgetRequestMapper.validateUpdateRequest(dto);

      expect(result.hasData).toBe(true);
    });

    it('should validate partial UpdateBudgetRequestDto', () => {
      const dto: UpdateBudgetRequestDto = {
        budgetId: 'budget-123',
        name: 'Updated Budget'
      };

      const result = BudgetRequestMapper.validateUpdateRequest(dto);

      expect(result.hasData).toBe(true);
    });

    it('should return validation error when budgetId is missing', () => {
      const dto = {
        name: 'Updated Budget'
      } as UpdateBudgetRequestDto;

      const result = BudgetRequestMapper.validateUpdateRequest(dto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Budget ID is required');
    });

    it('should return validation error when dto is null or invalid', () => {
      const result = BudgetRequestMapper.validateUpdateRequest(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Request DTO is required');
    });
  });

  describe('validateParticipantRequest', () => {
    it('should validate valid AddParticipantRequestDto', () => {
      const dto: AddParticipantRequestDto = {
        budgetId: 'budget-123',
        participantId: 'user-456',
        requesterId: 'user-123'
      };

      const result = BudgetRequestMapper.validateParticipantRequest(dto);

      expect(result.hasData).toBe(true);
    });

    it('should validate valid RemoveParticipantRequestDto', () => {
      const dto: RemoveParticipantRequestDto = {
        budgetId: 'budget-123',
        participantId: 'user-456',
        requesterId: 'user-123'
      };

      const result = BudgetRequestMapper.validateParticipantRequest(dto);

      expect(result.hasData).toBe(true);
    });

    it('should return validation error when participantId is empty', () => {
      const dto: AddParticipantRequestDto = {
        budgetId: 'budget-123',
        participantId: '   ',
        requesterId: 'user-123'
      };

      const result = BudgetRequestMapper.validateParticipantRequest(dto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Participant ID is required');
    });

    it('should return validation error when dto is null or invalid', () => {
      const result = BudgetRequestMapper.validateParticipantRequest(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Request DTO is required');
    });
  });

  describe('validateDeleteRequest', () => {
    it('should validate valid DeleteBudgetRequestDto', () => {
      const dto: DeleteBudgetRequestDto = {
        budgetId: 'budget-123',
        requesterId: 'user-123'
      };

      const result = BudgetRequestMapper.validateDeleteRequest(dto);

      expect(result.hasData).toBe(true);
    });

    it('should return validation error when requesterId is empty', () => {
      const dto: DeleteBudgetRequestDto = {
        budgetId: 'budget-123',
        requesterId: ''
      };

      const result = BudgetRequestMapper.validateDeleteRequest(dto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Requester ID is required');
    });

    it('should return validation error when dto is null or invalid', () => {
      const result = BudgetRequestMapper.validateDeleteRequest(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Request DTO is required');
    });
  });

  describe('normalizeUpdateRequest', () => {
    it('should trim whitespace from all string fields', () => {
      const dto: UpdateBudgetRequestDto = {
        budgetId: '  budget-123  ',
        name: '  Updated Budget  ',
        description: '  Updated description  '
      };

      const result = BudgetRequestMapper.normalizeUpdateRequest(dto);

      expect(result.budgetId).toBe('budget-123');
      expect(result.name).toBe('Updated Budget');
      expect(result.description).toBe('Updated description');
    });
  });

  describe('normalizeParticipantRequest', () => {
    it('should trim whitespace from all string fields', () => {
      const dto: AddParticipantRequestDto = {
        budgetId: '  budget-123  ',
        participantId: '  user-456  ',
        requesterId: '  user-123  '
      };

      const result = BudgetRequestMapper.normalizeParticipantRequest(dto);

      expect(result.budgetId).toBe('budget-123');
      expect(result.participantId).toBe('user-456');
      expect(result.requesterId).toBe('user-123');
    });
  });
});