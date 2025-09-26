import { BudgetOverviewQueryHandler } from './budget-overview-query-handler';
import { BudgetOverviewPort } from '../../../application/ports';
import { BudgetOverviewRequestDto, BudgetOverviewResponseDto } from '../../../application/dtos';
import { ApplicationError, ValidationError, NetworkError } from '../../../application/errors';
import { Either } from '../../../shared/core/either';

describe('BudgetOverviewQueryHandler', () => {
  let queryHandler: BudgetOverviewQueryHandler;
  let mockBudgetOverviewPort: jasmine.SpyObj<BudgetOverviewPort>;

  beforeEach(() => {
    mockBudgetOverviewPort = jasmine.createSpyObj('BudgetOverviewPort', ['getOverview']);
    queryHandler = new BudgetOverviewQueryHandler(mockBudgetOverviewPort);
  });

  describe('execute', () => {
    it('should get budget overview successfully with valid budget ID', async () => {
      // Arrange
      const request: BudgetOverviewRequestDto = {
        budgetId: 'budget-123',
      };

      const expectedResponse: BudgetOverviewResponseDto = {
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
        participantCount: 3, // owner + 2 participants
        isOwner: true,
        hasParticipant: true,
      };

      mockBudgetOverviewPort.getOverview.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await queryHandler.execute(request);

      // Assert
      expect(result.hasError).toBe(false);
      if (!result.hasError && result.data) {
        expect(result.data).toEqual(expectedResponse);
      }
      expect(mockBudgetOverviewPort.getOverview).toHaveBeenCalledWith(request);
    });

    it('should return validation error for empty budget ID', async () => {
      // Arrange
      const request: BudgetOverviewRequestDto = {
        budgetId: '',
      };

      // Act
      const result = await queryHandler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('Budget ID is required and cannot be empty');
        expect(result.errors[0].field).toBe('budgetId');
      }
      expect(mockBudgetOverviewPort.getOverview).not.toHaveBeenCalled();
    });

    it('should return validation error for undefined budget ID', async () => {
      // Arrange
      const request: BudgetOverviewRequestDto = {
        budgetId: undefined as any,
      };

      // Act
      const result = await queryHandler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('Budget ID is required and cannot be empty');
        expect(result.errors[0].field).toBe('budgetId');
      }
      expect(mockBudgetOverviewPort.getOverview).not.toHaveBeenCalled();
    });

    it('should return validation error for non-string budget ID', async () => {
      // Arrange
      const request: BudgetOverviewRequestDto = {
        budgetId: 123 as any,
      };

      // Act
      const result = await queryHandler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('Budget ID is required and cannot be empty');
        expect(result.errors[0].field).toBe('budgetId');
      }
      expect(mockBudgetOverviewPort.getOverview).not.toHaveBeenCalled();
    });

    it('should return error when port fails', async () => {
      // Arrange
      const request: BudgetOverviewRequestDto = {
        budgetId: 'budget-123',
      };

      const portError = new ApplicationError('Budget not found', 'BUDGET_NOT_FOUND', 404);
      mockBudgetOverviewPort.getOverview.and.returnValue(
        Promise.resolve(Either.error(portError))
      );

      // Act
      const result = await queryHandler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBe(portError);
      }
    });

    it('should return network error when port throws exception', async () => {
      // Arrange
      const request: BudgetOverviewRequestDto = {
        budgetId: 'budget-123',
      };

      const networkError = new Error('Network timeout');
      mockBudgetOverviewPort.getOverview.and.throwError(networkError);

      // Act
      const result = await queryHandler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(NetworkError);
        expect(result.errors[0].message).toBe('Failed to get budget overview due to network error');
      }
    });

    it('should handle whitespace-only budget ID as invalid', async () => {
      // Arrange
      const request: BudgetOverviewRequestDto = {
        budgetId: '   ',
      };

      // Act
      const result = await queryHandler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('Budget ID is required and cannot be empty');
        expect(result.errors[0].field).toBe('budgetId');
      }
      expect(mockBudgetOverviewPort.getOverview).not.toHaveBeenCalled();
    });

    it('should return overview with correct participant metadata', async () => {
      // Arrange
      const request: BudgetOverviewRequestDto = {
        budgetId: 'budget-123',
      };

      const expectedResponse: BudgetOverviewResponseDto = {
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
        participantCount: 2, // owner + 1 participant
        isOwner: false, // Different user requesting
        hasParticipant: true, // User is a participant
      };

      mockBudgetOverviewPort.getOverview.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await queryHandler.execute(request);

      // Assert
      expect(result.hasError).toBe(false);
      if (!result.hasError && result.data) {
        expect(result.data.participantCount).toBe(2);
        expect(result.data.isOwner).toBe(false);
        expect(result.data.hasParticipant).toBe(true);
      }
    });
  });
});