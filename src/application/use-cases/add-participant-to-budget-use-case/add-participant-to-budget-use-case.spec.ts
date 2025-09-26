import { AddParticipantToBudgetUseCase } from './add-participant-to-budget-use-case';
import { AddParticipantToBudgetPort } from '../../../application/ports';
import { AddParticipantRequestDto, BudgetResponseDto } from '../../../application/dtos';
import { ApplicationError, ValidationError, NetworkError } from '../../../application/errors';
import { Either } from '../../../shared/core/either';

describe('AddParticipantToBudgetUseCase', () => {
  let useCase: AddParticipantToBudgetUseCase;
  let mockAddParticipantPort: jasmine.SpyObj<AddParticipantToBudgetPort>;

  beforeEach(() => {
    mockAddParticipantPort = jasmine.createSpyObj('AddParticipantToBudgetPort', ['addParticipant']);
    useCase = new AddParticipantToBudgetUseCase(mockAddParticipantPort);
  });

  describe('execute', () => {
    it('should add participant successfully with valid data', async () => {
      // Arrange
      const request: AddParticipantRequestDto = {
        budgetId: 'budget-123',
        participantId: 'user-456',
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
        participantIds: ['user-456', 'user-789'],
        description: 'Test description',
        isActive: true,
        createdAt: '2025-09-26T18:45:00.000Z',
      };

      mockAddParticipantPort.addParticipant.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(false);
      if (!result.hasError && result.data) {
        expect(result.data).toEqual(expectedResponse);
      }
      expect(mockAddParticipantPort.addParticipant).toHaveBeenCalledWith(request);
    });

    it('should return validation error for empty budget ID', async () => {
      // Arrange
      const request: AddParticipantRequestDto = {
        budgetId: '',
        participantId: 'user-456',
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('Budget ID is required and cannot be empty');
        expect(result.errors[0].field).toBe('budgetId');
      }
      expect(mockAddParticipantPort.addParticipant).not.toHaveBeenCalled();
    });

    it('should return validation error for empty participant ID', async () => {
      // Arrange
      const request: AddParticipantRequestDto = {
        budgetId: 'budget-123',
        participantId: '',
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('Participant ID is required and cannot be empty');
        expect(result.errors[0].field).toBe('participantId');
      }
      expect(mockAddParticipantPort.addParticipant).not.toHaveBeenCalled();
    });

    it('should return validation error for undefined budget ID', async () => {
      // Arrange
      const request: AddParticipantRequestDto = {
        budgetId: undefined as any,
        participantId: 'user-456',
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('Budget ID is required and cannot be empty');
        expect(result.errors[0].field).toBe('budgetId');
      }
      expect(mockAddParticipantPort.addParticipant).not.toHaveBeenCalled();
    });

    it('should return validation error for undefined participant ID', async () => {
      // Arrange
      const request: AddParticipantRequestDto = {
        budgetId: 'budget-123',
        participantId: undefined as any,
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('Participant ID is required and cannot be empty');
        expect(result.errors[0].field).toBe('participantId');
      }
      expect(mockAddParticipantPort.addParticipant).not.toHaveBeenCalled();
    });

    it('should return error when port fails', async () => {
      // Arrange
      const request: AddParticipantRequestDto = {
        budgetId: 'budget-123',
        participantId: 'user-456',
      };

      const portError = new ApplicationError('Budget not found', 'BUDGET_NOT_FOUND', 404);
      mockAddParticipantPort.addParticipant.and.returnValue(
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
      const request: AddParticipantRequestDto = {
        budgetId: 'budget-123',
        participantId: 'user-456',
      };

      const networkError = new Error('Network timeout');
      mockAddParticipantPort.addParticipant.and.throwError(networkError);

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(NetworkError);
        expect(result.errors[0].message).toBe('Failed to add participant due to network error');
      }
    });

    it('should handle whitespace-only IDs as invalid', async () => {
      // Arrange
      const request: AddParticipantRequestDto = {
        budgetId: '   ',
        participantId: 'user-456',
      };

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('Budget ID is required and cannot be empty');
        expect(result.errors[0].field).toBe('budgetId');
      }
      expect(mockAddParticipantPort.addParticipant).not.toHaveBeenCalled();
    });
  });
});