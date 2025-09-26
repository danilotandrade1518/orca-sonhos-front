import { RemoveParticipantFromBudgetUseCase } from './remove-participant-from-budget-use-case';
import { RemoveParticipantFromBudgetPort } from '../../../application/ports';
import { RemoveParticipantRequestDto, BudgetResponseDto } from '../../../application/dtos';
import { ApplicationError, ValidationError, NetworkError } from '../../../application/errors';
import { Either } from '../../../shared/core/either';

describe('RemoveParticipantFromBudgetUseCase', () => {
  let useCase: RemoveParticipantFromBudgetUseCase;
  let mockRemoveParticipantPort: jasmine.SpyObj<RemoveParticipantFromBudgetPort>;

  beforeEach(() => {
    mockRemoveParticipantPort = jasmine.createSpyObj('RemoveParticipantFromBudgetPort', ['removeParticipant']);
    useCase = new RemoveParticipantFromBudgetUseCase(mockRemoveParticipantPort);
  });

  describe('execute', () => {
    it('should remove participant successfully with valid data', async () => {
      // Arrange
      const request: RemoveParticipantRequestDto = {
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
        participantIds: ['user-789'], // user-456 removed
        description: 'Test description',
        isActive: true,
        createdAt: '2025-09-26T18:45:00.000Z',
      };

      mockRemoveParticipantPort.removeParticipant.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(false);
      if (!result.hasError && result.data) {
        expect(result.data).toEqual(expectedResponse);
      }
      expect(mockRemoveParticipantPort.removeParticipant).toHaveBeenCalledWith(request);
    });

    it('should return validation error for empty budget ID', async () => {
      // Arrange
      const request: RemoveParticipantRequestDto = {
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
      expect(mockRemoveParticipantPort.removeParticipant).not.toHaveBeenCalled();
    });

    it('should return validation error for empty participant ID', async () => {
      // Arrange
      const request: RemoveParticipantRequestDto = {
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
      expect(mockRemoveParticipantPort.removeParticipant).not.toHaveBeenCalled();
    });

    it('should return validation error for undefined budget ID', async () => {
      // Arrange
      const request: RemoveParticipantRequestDto = {
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
      expect(mockRemoveParticipantPort.removeParticipant).not.toHaveBeenCalled();
    });

    it('should return validation error for undefined participant ID', async () => {
      // Arrange
      const request: RemoveParticipantRequestDto = {
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
      expect(mockRemoveParticipantPort.removeParticipant).not.toHaveBeenCalled();
    });

    it('should return error when port fails', async () => {
      // Arrange
      const request: RemoveParticipantRequestDto = {
        budgetId: 'budget-123',
        participantId: 'user-456',
      };

      const portError = new ApplicationError('Participant not found', 'PARTICIPANT_NOT_FOUND', 404);
      mockRemoveParticipantPort.removeParticipant.and.returnValue(
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
      const request: RemoveParticipantRequestDto = {
        budgetId: 'budget-123',
        participantId: 'user-456',
      };

      const networkError = new Error('Network timeout');
      mockRemoveParticipantPort.removeParticipant.and.throwError(networkError);

      // Act
      const result = await useCase.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(NetworkError);
        expect(result.errors[0].message).toBe('Failed to remove participant due to network error');
      }
    });

    it('should handle whitespace-only IDs as invalid', async () => {
      // Arrange
      const request: RemoveParticipantRequestDto = {
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
      expect(mockRemoveParticipantPort.removeParticipant).not.toHaveBeenCalled();
    });
  });
});