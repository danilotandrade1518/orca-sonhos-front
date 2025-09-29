import { UpdateCategoryUseCase } from './update-category-use-case';
import { IUpdateCategoryPort } from '../../../ports/category/update-category.port';
import { UpdateCategoryRequestDto } from '../../../dtos/category/request/update-category-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { CategoryRequestMapper } from '../../../mappers/category/category-request-mapper/category-request-mapper';

describe('UpdateCategoryUseCase', () => {
  let useCase: UpdateCategoryUseCase;
  let mockUpdateCategoryPort: jasmine.SpyObj<IUpdateCategoryPort>;

  beforeEach(() => {
    mockUpdateCategoryPort = jasmine.createSpyObj('IUpdateCategoryPort', ['updateCategory']);
    useCase = new UpdateCategoryUseCase(mockUpdateCategoryPort);
  });

  describe('execute', () => {
    it('should update category successfully via HTTP', async () => {
      const validRequest: UpdateCategoryRequestDto = {
        id: 'category-123',
        name: 'Updated Category',
        description: 'Updated description',
        color: '#4CAF50',
        icon: 'updated-icon',
      };

      spyOn(CategoryRequestMapper, 'validateUpdateRequest').and.returnValue(Either.success(true));
      spyOn(CategoryRequestMapper, 'normalizeUpdateRequest').and.returnValue(validRequest);

      const mockBackendResponse = { id: 'category-123' };
      mockUpdateCategoryPort.updateCategory.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(CategoryRequestMapper.validateUpdateRequest).toHaveBeenCalledWith(validRequest);
      expect(CategoryRequestMapper.normalizeUpdateRequest).toHaveBeenCalledWith(validRequest);
      expect(mockUpdateCategoryPort.updateCategory).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when request data is invalid', async () => {
      const invalidRequest: UpdateCategoryRequestDto = {
        id: '',
        name: 'Updated Category',
        description: 'Updated description',
        color: '#4CAF50',
        icon: 'updated-icon',
      };

      const validationError = new ValidationError('id', 'Category ID is required');
      spyOn(CategoryRequestMapper, 'validateUpdateRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockUpdateCategoryPort.updateCategory).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: UpdateCategoryRequestDto = {
        id: 'category-123',
        name: 'Updated Category',
        description: 'Updated description',
        color: '#4CAF50',
        icon: 'updated-icon',
      };

      spyOn(CategoryRequestMapper, 'validateUpdateRequest').and.returnValue(Either.success(true));
      spyOn(CategoryRequestMapper, 'normalizeUpdateRequest').and.returnValue(validRequest);

      const networkError = new NetworkError('updateCategory', 'Connection failed');
      mockUpdateCategoryPort.updateCategory.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: UpdateCategoryRequestDto = {
        id: 'category-123',
        name: 'Updated Category',
        description: 'Updated description',
        color: '#4CAF50',
        icon: 'updated-icon',
      };

      spyOn(CategoryRequestMapper, 'validateUpdateRequest').and.throwError(
        'Unexpected validation error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
