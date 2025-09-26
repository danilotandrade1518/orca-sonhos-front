import { BudgetRequestMapper } from './budget-request-mapper';
import { CreateBudgetRequestDto, UpdateBudgetRequestDto } from '../../dtos/request';

describe('BudgetRequestMapper', () => {
  describe('fromCreateRequestToBudget', () => {
    it('should convert valid CreateBudgetRequestDto to Budget', () => {
      const dto: CreateBudgetRequestDto = {
        name: 'Test Budget',
        limitInCents: 100000, // R$ 1,000.00
        ownerId: 'user-123',
        participantIds: ['user-456', 'user-789'],
        description: 'Test description',
        isActive: true,
      };

      const result = BudgetRequestMapper.fromCreateRequestToBudget(dto);

      expect(result.hasError).toBe(false);
      if (!result.hasError && result.data) {
        expect(result.data.name).toBe(dto.name);
        expect(result.data.ownerId).toBe(dto.ownerId);
        expect(result.data.participantIds).toEqual(dto.participantIds || []);
        expect(result.data.description).toBe(dto.description || '');
        expect(result.data.isActive).toBe(dto.isActive !== undefined ? dto.isActive : true);
        expect(result.data.limit.valueInCents).toBe(dto.limitInCents);
      }
    });

    it('should handle minimal CreateBudgetRequestDto', () => {
      const dto: CreateBudgetRequestDto = {
        name: 'Minimal Budget',
        limitInCents: 50000,
        ownerId: 'user-123',
      };

      const result = BudgetRequestMapper.fromCreateRequestToBudget(dto);

      expect(result.hasError).toBe(false);
      if (!result.hasError && result.data) {
        expect(result.data.name).toBe(dto.name);
        expect(result.data.ownerId).toBe(dto.ownerId);
        expect(result.data.participantIds).toEqual([]);
        expect(result.data.description).toBe('');
        expect(result.data.isActive).toBe(true);
      }
    });

    it('should return error for invalid data', () => {
      const dto: CreateBudgetRequestDto = {
        name: '', // Invalid: empty name
        limitInCents: -100, // Invalid: negative limit
        ownerId: '', // Invalid: empty ownerId
      };

      const result = BudgetRequestMapper.fromCreateRequestToBudget(dto);

      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('fromUpdateRequestToPartialProps', () => {
    it('should convert UpdateBudgetRequestDto to partial props with all fields', () => {
      const dto: UpdateBudgetRequestDto = {
        id: 'budget-123',
        name: 'Updated Budget',
        limitInCents: 200000,
        description: 'Updated description',
        isActive: false,
      };

      const result = BudgetRequestMapper.fromUpdateRequestToPartialProps(dto);

      expect(result).toEqual({
        name: 'Updated Budget',
        limitInCents: 200000,
        description: 'Updated description',
        isActive: false,
      });
    });

    it('should only include defined fields', () => {
      const dto: UpdateBudgetRequestDto = {
        id: 'budget-123',
        name: 'Updated Budget',
        // limitInCents, description, isActive are undefined
      };

      const result = BudgetRequestMapper.fromUpdateRequestToPartialProps(dto);

      expect(result).toEqual({
        name: 'Updated Budget',
      });
    });

    it('should return empty object when no fields are defined', () => {
      const dto: UpdateBudgetRequestDto = {
        id: 'budget-123',
        // All optional fields are undefined
      };

      const result = BudgetRequestMapper.fromUpdateRequestToPartialProps(dto);

      expect(result).toEqual({});
    });
  });
});