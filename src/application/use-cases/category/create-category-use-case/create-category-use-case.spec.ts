import { CreateCategoryUseCase } from './create-category-use-case';
import { ICreateCategoryPort } from '../../../ports/category/create-category.port';
import { CreateCategoryRequestDto } from '../../../dtos/category/request/create-category-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { CategoryRequestMapper } from '../../../mappers/category/category-request-mapper/category-request-mapper';
import { CategoryType } from '@models/shared/enums/category-type';

describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase;
  let mockCreateCategoryPort: jasmine.SpyObj<ICreateCategoryPort>;

  beforeEach(() => {
    mockCreateCategoryPort = jasmine.createSpyObj('ICreateCategoryPort', ['createCategory']);
    useCase = new CreateCategoryUseCase(mockCreateCategoryPort);
  });

  describe('execute', () => {
    it('should create category successfully via HTTP', async () => {
      const validRequest: CreateCategoryRequestDto = {
        name: 'Test Category',
        type: CategoryType.INCOME,
        budgetId: 'budget-123',
        description: 'Test category description',
        color: '#FF5722',
        icon: 'money',
      };

      const mockCategory = {
        id: 'category-123',
        name: 'Test Category',
        type: CategoryType.INCOME,
        budgetId: 'budget-123',
        description: 'Test category description',
        color: '#FF5722',
        icon: 'money',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      spyOn(CategoryRequestMapper, 'fromCreateRequestToCategory').and.returnValue(
        Either.success(mockCategory as any)
      );
      const mockBackendResponse = { id: 'category-123' };
      mockCreateCategoryPort.createCategory.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(CategoryRequestMapper.fromCreateRequestToCategory).toHaveBeenCalledWith(validRequest);
      expect(mockCreateCategoryPort.createCategory).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when category data is invalid', async () => {
      const invalidRequest: CreateCategoryRequestDto = {
        name: '',
        type: CategoryType.INCOME,
        budgetId: '',
        description: '',
        color: '',
        icon: '',
      };

      const validationError = new ValidationError('name', 'Name is required');
      spyOn(CategoryRequestMapper, 'fromCreateRequestToCategory').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockCreateCategoryPort.createCategory).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: CreateCategoryRequestDto = {
        name: 'Test Category',
        type: CategoryType.INCOME,
        budgetId: 'budget-123',
        description: 'Test category description',
        color: '#FF5722',
        icon: 'money',
      };

      const mockCategory = {
        id: 'category-123',
        name: 'Test Category',
        type: CategoryType.INCOME,
        budgetId: 'budget-123',
        description: 'Test category description',
        color: '#FF5722',
        icon: 'money',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      spyOn(CategoryRequestMapper, 'fromCreateRequestToCategory').and.returnValue(
        Either.success(mockCategory as any)
      );
      const networkError = new NetworkError('createCategory', 'Connection failed');
      mockCreateCategoryPort.createCategory.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: CreateCategoryRequestDto = {
        name: 'Test Category',
        type: CategoryType.INCOME,
        budgetId: 'budget-123',
        description: 'Test category description',
        color: '#FF5722',
        icon: 'money',
      };

      spyOn(CategoryRequestMapper, 'fromCreateRequestToCategory').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
