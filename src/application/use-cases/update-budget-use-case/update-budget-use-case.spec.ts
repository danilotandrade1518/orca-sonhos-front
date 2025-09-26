import { UpdateBudgetUseCase } from './update-budget-use-case';
import { UpdateBudgetPort } from '../../../application/ports';
import { UpdateBudgetRequestDto, BudgetResponseDto } from '../../../application/dtos';
import { ApplicationError, ValidationError, NetworkError } from '../../../application/errors';
import { Either } from '../../../shared/core/either';

describe('UpdateBudgetUseCase', () => {
  let useCase: UpdateBudgetUseCase;
  let mockUpdateBudgetPort: jasmine.SpyObj<UpdateBudgetPort>;

  beforeEach(() => {
    mockUpdateBudgetPort = jasmine.createSpyObj('UpdateBudgetPort', ['update']);
    useCase = new UpdateBudgetUseCase(mockUpdateBudgetPort);
  });

  describe('execute', () => {
    it('should update budget successfully with valid data', async () => {
      // Arrange
      const request: UpdateBudgetRequestDto = {
        id: 'budget-123',
        name: 'Updated Budget',
        limitInCents: 200000,
        description: 'Updated description',
        isActive: false,
      };

      const expectedResponse: BudgetResponseDto = {
        id: 'budget-123',
        name: 'Updated Budget',
        limit: {
          valueInCents: 200000,
          valueInMonetary: 2000,
          formatted: 'R$ 2.000,00',
        },
        ownerId: 'user-123',
        participantIds: ['user-456'],
        description: 'Updated description',
        isActive: false,
        createdAt: '2025-09-26T18:45:00.000Z',
      };

      mockUpdateBudgetPort.update.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(false);
      if (!result.hasError && result.data) {
        expect(result.data).toEqual(expectedResponse);
      }
      expect(mockUpdateBudgetPort.update).toHaveBeenCalledWith(request);
    });

    it('should return validation error when no fields are provided', async () => {
      // Arrange
      const request: UpdateBudgetRequestDto = {
        id: 'budget-123',
        // No update fields provided
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('At least one field must be provided for update');
      }
      expect(mockUpdateBudgetPort.update).not.toHaveBeenCalled();
    });

    it('should return validation error for empty name', async () => {
      // Arrange
      const request: UpdateBudgetRequestDto = {
        id: 'budget-123',
        name: '',
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('Name cannot be empty');
        expect(result.errors[0].field).toBe('name');
      }
    });

    it('should return validation error for name too long', async () => {
      // Arrange
      const request: UpdateBudgetRequestDto = {
        id: 'budget-123',
        name: 'A'.repeat(101), // 101 characters
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('Name cannot exceed 100 characters');
        expect(result.errors[0].field).toBe('name');
      }
    });

    it('should return validation error for negative limit', async () => {
      // Arrange
      const request: UpdateBudgetRequestDto = {
        id: 'budget-123',
        limitInCents: -100,
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('Limit must be a positive number');
        expect(result.errors[0].field).toBe('limitInCents');
      }
    });

    it('should return validation error for description too long', async () => {
      // Arrange
      const request: UpdateBudgetRequestDto = {
        id: 'budget-123',
        description: 'A'.repeat(501), // 501 characters
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('Description cannot exceed 500 characters');
        expect(result.errors[0].field).toBe('description');
      }
    });

    it('should return error when port fails', async () => {
      // Arrange
      const request: UpdateBudgetRequestDto = {
        id: 'budget-123',
        name: 'Updated Budget',
      };

      const portError = new ApplicationError('Budget not found', 'BUDGET_NOT_FOUND', 404);
      mockUpdateBudgetPort.update.and.returnValue(
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
      const request: UpdateBudgetRequestDto = {
        id: 'budget-123',
        name: 'Updated Budget',
      };

      const networkError = new Error('Network timeout');
      mockUpdateBudgetPort.update.and.throwError(networkError);

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(NetworkError);
        expect(result.errors[0].message).toBe('Failed to update budget due to network error');
      }
    });

    it('should handle partial updates correctly', async () => {
      // Arrange
      const request: UpdateBudgetRequestDto = {
        id: 'budget-123',
        name: 'Only Name Updated',
        // Other fields undefined
      };

      const expectedResponse: BudgetResponseDto = {
        id: 'budget-123',
        name: 'Only Name Updated',
        limit: {
          valueInCents: 100000,
          valueInMonetary: 1000,
          formatted: 'R$ 1.000,00',
        },
        ownerId: 'user-123',
        participantIds: [],
        description: 'Original description',
        isActive: true,
        createdAt: '2025-09-26T18:45:00.000Z',
      };

      mockUpdateBudgetPort.update.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(false);
      if (!result.hasError && result.data) {
        expect(result.data).toEqual(expectedResponse);
      }
    });
  });
});