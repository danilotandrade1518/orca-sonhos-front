import { CategoryRequestMapper } from './category-request-mapper';
import { ValidationError } from '../../../errors';
import { CategoryType } from '../../../../models/shared/enums/category-type';
import {
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
  DeleteCategoryRequestDto,
} from '../../../dtos/category';

describe('CategoryRequestMapper', () => {
  describe('fromCreateRequestToCategory', () => {
    it('should convert valid CreateCategoryRequestDto to Category model', () => {
      const dto: CreateCategoryRequestDto = {
        name: 'Test Category',
        type: CategoryType.INCOME,
        budgetId: 'budget-123',
        description: 'Test description',
        color: '#FF0000',
        icon: 'icon-test',
      };

      const result = CategoryRequestMapper.fromCreateRequestToCategory(dto);

      expect(result.hasData).toBe(true);
      expect(result.data?.name).toBe('Test Category');
      expect(result.data?.type).toBe(CategoryType.INCOME);
      expect(result.data?.budgetId).toBe('budget-123');
      expect(result.data?.description).toBe('Test description');
      expect(result.data?.color).toBe('#FF0000');
      expect(result.data?.icon).toBe('icon-test');
    });

    it('should handle optional fields correctly', () => {
      const dto: CreateCategoryRequestDto = {
        name: 'Test Category',
        type: CategoryType.INCOME,
        budgetId: 'budget-123',
      };

      const result = CategoryRequestMapper.fromCreateRequestToCategory(dto);

      expect(result.hasData).toBe(true);
      expect(result.data?.description).toBe('');
      expect(result.data?.color).toBe('#757575');
      expect(result.data?.icon).toBe('category');
    });

    it('should return validation error when Category model creation fails', () => {
      const dto: CreateCategoryRequestDto = {
        name: '',
        type: CategoryType.INCOME,
        budgetId: 'budget-123',
      };

      const result = CategoryRequestMapper.fromCreateRequestToCategory(dto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Category creation failed');
    });

    it('should return validation error when dto is null or invalid', () => {
      const result = CategoryRequestMapper.fromCreateRequestToCategory(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Request DTO is required');
    });
  });

  describe('validateUpdateRequest', () => {
    it('should validate valid UpdateCategoryRequestDto', () => {
      const dto: UpdateCategoryRequestDto = {
        id: 'category-123',
        name: 'Updated Category',
        description: 'Updated description',
        color: '#00FF00',
        icon: 'icon-updated',
      };

      const result = CategoryRequestMapper.validateUpdateRequest(dto);

      expect(result.hasData).toBe(true);
    });

    it('should validate partial UpdateCategoryRequestDto', () => {
      const dto: UpdateCategoryRequestDto = {
        id: 'category-123',
        name: 'Updated Category',
      };

      const result = CategoryRequestMapper.validateUpdateRequest(dto);

      expect(result.hasData).toBe(true);
    });

    it('should return validation error when id is missing', () => {
      const dto = {
        name: 'Updated Category',
      } as UpdateCategoryRequestDto;

      const result = CategoryRequestMapper.validateUpdateRequest(dto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Category ID is required');
    });

    it('should return validation error when dto is null or invalid', () => {
      const result = CategoryRequestMapper.validateUpdateRequest(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Request DTO is required');
    });
  });

  describe('validateDeleteRequest', () => {
    it('should validate valid DeleteCategoryRequestDto', () => {
      const dto: DeleteCategoryRequestDto = {
        id: 'category-123',
        budgetId: 'budget-123',
      };

      const result = CategoryRequestMapper.validateDeleteRequest(dto);

      expect(result.hasData).toBe(true);
    });

    it('should return validation error when id is empty', () => {
      const dto: DeleteCategoryRequestDto = {
        id: '   ',
        budgetId: 'budget-123',
      };

      const result = CategoryRequestMapper.validateDeleteRequest(dto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Category ID is required');
    });

    it('should return validation error when budgetId is empty', () => {
      const dto: DeleteCategoryRequestDto = {
        id: 'category-123',
        budgetId: '',
      };

      const result = CategoryRequestMapper.validateDeleteRequest(dto);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Budget ID is required');
    });

    it('should return validation error when dto is null or invalid', () => {
      const result = CategoryRequestMapper.validateDeleteRequest(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Request DTO is required');
    });
  });

  describe('normalizeUpdateRequest', () => {
    it('should trim whitespace from all string fields', () => {
      const dto: UpdateCategoryRequestDto = {
        id: '  category-123  ',
        name: '  Updated Category  ',
        description: '  Updated description  ',
        color: '  #00FF00  ',
        icon: '  icon-updated  ',
      };

      const result = CategoryRequestMapper.normalizeUpdateRequest(dto);

      expect(result.id).toBe('category-123');
      expect(result.name).toBe('Updated Category');
      expect(result.description).toBe('Updated description');
      expect(result.color).toBe('#00FF00');
      expect(result.icon).toBe('icon-updated');
    });
  });

  describe('normalizeDeleteRequest', () => {
    it('should trim whitespace from all string fields', () => {
      const dto: DeleteCategoryRequestDto = {
        id: '  category-123  ',
        budgetId: '  budget-123  ',
      };

      const result = CategoryRequestMapper.normalizeDeleteRequest(dto);

      expect(result.id).toBe('category-123');
      expect(result.budgetId).toBe('budget-123');
    });
  });
});
