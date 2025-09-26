import { DeleteBudgetUseCase } from './delete-budget-use-case';
import { DeleteBudgetPort } from '../../../application/ports';
import { DeleteBudgetRequestDto } from '../../../application/dtos';
import { ApplicationError, ValidationError, NetworkError } from '../../../application/errors';
import { Either } from '../../../shared/core/either';

describe('DeleteBudgetUseCase', () => {
  let useCase: DeleteBudgetUseCase;
  let mockDeleteBudgetPort: jasmine.SpyObj<DeleteBudgetPort>;

  beforeEach(() => {
    mockDeleteBudgetPort = jasmine.createSpyObj('DeleteBudgetPort', ['delete']);
    useCase = new DeleteBudgetUseCase(mockDeleteBudgetPort);
  });

  describe('execute', () => {
    it('should delete budget successfully with valid ID', async () => {
      // Arrange
      const request: DeleteBudgetRequestDto = {
        id: 'budget-123',
      };

      mockDeleteBudgetPort.delete.and.returnValue(
        Promise.resolve(Either.success(undefined))
      );

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(false);
      expect(mockDeleteBudgetPort.delete).toHaveBeenCalledWith(request);
    });

    it('should return validation error for empty ID', async () => {
      // Arrange
      const request: DeleteBudgetRequestDto = {
        id: '',
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('Budget ID is required and cannot be empty');
        expect(result.errors[0].field).toBe('id');
      }
      expect(mockDeleteBudgetPort.delete).not.toHaveBeenCalled();
    });

    it('should return validation error for undefined ID', async () => {
      // Arrange
      const request: DeleteBudgetRequestDto = {
        id: undefined as any,
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('Budget ID is required and cannot be empty');
        expect(result.errors[0].field).toBe('id');
      }
      expect(mockDeleteBudgetPort.delete).not.toHaveBeenCalled();
    });

    it('should return validation error for non-string ID', async () => {
      // Arrange
      const request: DeleteBudgetRequestDto = {
        id: 123 as any,
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('Budget ID is required and cannot be empty');
        expect(result.errors[0].field).toBe('id');
      }
      expect(mockDeleteBudgetPort.delete).not.toHaveBeenCalled();
    });

    it('should return error when port fails', async () => {
      // Arrange
      const request: DeleteBudgetRequestDto = {
        id: 'budget-123',
      };

      const portError = new ApplicationError('Budget not found', 'BUDGET_NOT_FOUND', 404);
      mockDeleteBudgetPort.delete.and.returnValue(
        Promise.resolve(Either.error(portError))
      );

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBe(portError);
      }
    });

    it('should return network error when port throws exception', async () => {
      // Arrange
      const request: DeleteBudgetRequestDto = {
        id: 'budget-123',
      };

      const networkError = new Error('Network timeout');
      mockDeleteBudgetPort.delete.and.throwError(networkError);

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(NetworkError);
        expect(result.errors[0].message).toBe('Failed to delete budget due to network error');
      }
    });

    it('should handle whitespace-only ID as invalid', async () => {
      // Arrange
      const request: DeleteBudgetRequestDto = {
        id: '   ',
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('Budget ID is required and cannot be empty');
        expect(result.errors[0].field).toBe('id');
      }
      expect(mockDeleteBudgetPort.delete).not.toHaveBeenCalled();
    });
  });
});