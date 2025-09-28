import { DeleteCategoryUseCase } from './delete-category-use-case';
import { IDeleteCategoryPort } from '../../../ports/category/delete-category.port';
import { DeleteCategoryRequestDto } from '../../../dtos/category/request/delete-category-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { CategoryRequestMapper } from '../../../mappers/category/category-request-mapper/category-request-mapper';

describe('DeleteCategoryUseCase', () => {
  let useCase: DeleteCategoryUseCase;
  let mockDeleteCategoryPort: jasmine.SpyObj<IDeleteCategoryPort>;

  beforeEach(() => {
    mockDeleteCategoryPort = jasmine.createSpyObj('IDeleteCategoryPort', ['deleteCategory']);
    useCase = new DeleteCategoryUseCase(mockDeleteCategoryPort);
  });

  describe('execute', () => {
    it('should delete category successfully via HTTP', async () => {
      const validRequest: DeleteCategoryRequestDto = {
        id: 'category-123',
        budgetId: 'budget-123',
      };

      spyOn(CategoryRequestMapper, 'validateDeleteRequest').and.returnValue(Either.success(true));
      spyOn(CategoryRequestMapper, 'normalizeDeleteRequest').and.returnValue(validRequest);

      const mockBackendResponse = { id: 'category-123' };
      mockDeleteCategoryPort.deleteCategory.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(CategoryRequestMapper.validateDeleteRequest).toHaveBeenCalledWith(validRequest);
      expect(CategoryRequestMapper.normalizeDeleteRequest).toHaveBeenCalledWith(validRequest);
      expect(mockDeleteCategoryPort.deleteCategory).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when request data is invalid', async () => {
      const invalidRequest: DeleteCategoryRequestDto = {
        id: '',
        budgetId: 'budget-123',
      };

      const validationError = new ValidationError('id', 'Category ID is required');
      spyOn(CategoryRequestMapper, 'validateDeleteRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockDeleteCategoryPort.deleteCategory).not.toHaveBeenCalled();
    });

    it('should return validation error when budgetId is missing', async () => {
      const invalidRequest: DeleteCategoryRequestDto = {
        id: 'category-123',
        budgetId: '',
      };

      const validationError = new ValidationError('budgetId', 'Budget ID is required');
      spyOn(CategoryRequestMapper, 'validateDeleteRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockDeleteCategoryPort.deleteCategory).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: DeleteCategoryRequestDto = {
        id: 'category-123',
        budgetId: 'budget-123',
      };

      spyOn(CategoryRequestMapper, 'validateDeleteRequest').and.returnValue(Either.success(true));
      spyOn(CategoryRequestMapper, 'normalizeDeleteRequest').and.returnValue(validRequest);

      const networkError = new NetworkError('deleteCategory', 'Connection failed');
      mockDeleteCategoryPort.deleteCategory.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: DeleteCategoryRequestDto = {
        id: 'category-123',
        budgetId: 'budget-123',
      };

      spyOn(CategoryRequestMapper, 'validateDeleteRequest').and.throwError(
        'Unexpected validation error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
