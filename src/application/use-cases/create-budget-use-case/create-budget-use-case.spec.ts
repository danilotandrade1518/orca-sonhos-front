import { CreateBudgetUseCase } from './create-budget-use-case';
import { CreateBudgetPort } from '../../../application/ports';
import { CreateBudgetRequestDto, BudgetResponseDto } from '../../../application/dtos';
import { ApplicationError, ValidationError, NetworkError } from '../../../application/errors';
import { Either } from '../../../shared/core/either';

describe('CreateBudgetUseCase', () => {
  let useCase: CreateBudgetUseCase;
  let mockCreateBudgetPort: jasmine.SpyObj<CreateBudgetPort>;

  beforeEach(() => {
    mockCreateBudgetPort = jasmine.createSpyObj('CreateBudgetPort', ['create']);
    useCase = new CreateBudgetUseCase(mockCreateBudgetPort);
  });

  describe('execute', () => {
    it('should create budget successfully with valid data', async () => {
      // Arrange
      const request: CreateBudgetRequestDto = {
        name: 'Test Budget',
        limitInCents: 100000,
        ownerId: 'user-123',
        participantIds: ['user-456'],
        description: 'Test description',
        isActive: true,
      };

      const expectedResponse: BudgetResponseDto = {
        id: 'budget-123',
        name: 'Test Budget',
        limit: {
          valueInCents: 100000,
          valueInMonetary: 1000,
          formatted: 'R$ 1.000,00',
        },
        ownerId: 'user-123',
        participantIds: ['user-456'],
        description: 'Test description',
        isActive: true,
        createdAt: '2025-09-26T18:45:00.000Z',
      };

      mockCreateBudgetPort.create.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(false);
      if (!result.hasError && result.data) {
        expect(result.data).toEqual(expectedResponse);
      }
      expect(mockCreateBudgetPort.create).toHaveBeenCalledWith(request);
    });

    it('should return validation error for invalid data', async () => {
      // Arrange
      const request: CreateBudgetRequestDto = {
        name: '', // Invalid: empty name
        limitInCents: -100, // Invalid: negative limit
        ownerId: '', // Invalid: empty ownerId
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toContain('Invalid budget data');
      }
      expect(mockCreateBudgetPort.create).not.toHaveBeenCalled();
    });

    it('should return error when port fails', async () => {
      // Arrange
      const request: CreateBudgetRequestDto = {
        name: 'Test Budget',
        limitInCents: 100000,
        ownerId: 'user-123',
      };

      const portError = new ApplicationError('Port error', 'PORT_ERROR', 500);
      mockCreateBudgetPort.create.and.returnValue(
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
      const request: CreateBudgetRequestDto = {
        name: 'Test Budget',
        limitInCents: 100000,
        ownerId: 'user-123',
      };

      const networkError = new Error('Network timeout');
      mockCreateBudgetPort.create.and.throwError(networkError);

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(NetworkError);
        expect(result.errors[0].message).toBe('Failed to create budget due to network error');
      }
    });

    it('should handle minimal valid data', async () => {
      // Arrange
      const request: CreateBudgetRequestDto = {
        name: 'Minimal Budget',
        limitInCents: 50000,
        ownerId: 'user-123',
      };

      const expectedResponse: BudgetResponseDto = {
        id: 'budget-456',
        name: 'Minimal Budget',
        limit: {
          valueInCents: 50000,
          valueInMonetary: 500,
          formatted: 'R$ 500,00',
        },
        ownerId: 'user-123',
        participantIds: [],
        description: '',
        isActive: true,
        createdAt: '2025-09-26T18:45:00.000Z',
      };

      mockCreateBudgetPort.create.and.returnValue(
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