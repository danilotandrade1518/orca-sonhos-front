import { GetGoalByIdQueryHandler } from './get-goal-by-id-query-handler';
import { IGetGoalByIdPort } from '../../../ports/goal/get-goal-by-id.port';
import { GetGoalByIdQueryRequestDto } from '../../../dtos/goal/request/get-goal-by-id-query-request.dto';
import { GetGoalByIdQueryResponseDto } from '../../../dtos/goal/response/get-goal-by-id-query-response.dto';
import { Either } from '../../../../shared/core/either/either';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

describe('GetGoalByIdQueryHandler', () => {
  let handler: GetGoalByIdQueryHandler;
  let mockPort: jasmine.SpyObj<IGetGoalByIdPort>;

  beforeEach(() => {
    mockPort = jasmine.createSpyObj('IGetGoalByIdPort', ['getGoalById']);
    handler = new GetGoalByIdQueryHandler(mockPort);
  });

  it('should be created', () => {
    expect(handler).toBeTruthy();
  });

  describe('execute', () => {
    it('should return success when port returns success', async () => {
      // Arrange
      const request: GetGoalByIdQueryRequestDto = {
        goalId: 'goal-123'
      };

      const mockResponse: GetGoalByIdQueryResponseDto = {
        goal: {
          id: 'goal-123',
          name: 'Test Goal',
          targetAmount: { valueInCents: 100000, valueInMonetary: 1000, formatted: 'R$ 1.000,00' },
          currentAmount: { valueInCents: 50000, valueInMonetary: 500, formatted: 'R$ 500,00' },
          budgetId: 'budget-123',
          targetDate: '2024-12-31',
          description: 'Test description',
          status: 'active',
          createdAt: '2024-01-01T00:00:00Z',
          remainingAmount: { valueInCents: 50000, valueInMonetary: 500, formatted: 'R$ 500,00' },
          progressPercentage: 50,
          isCompleted: false,
          isOverdue: false,
          daysUntilTarget: 30,
          monthlyTargetAmount: { valueInCents: 10000, valueInMonetary: 100, formatted: 'R$ 100,00' }
        }
      };

      mockPort.getGoalById.and.returnValue(Promise.resolve(Either.success(mockResponse)));

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBeFalse();
      expect(result.data).toEqual(mockResponse);
      expect(mockPort.getGoalById).toHaveBeenCalledWith(request);
    });

    it('should return validation error when goalId is empty', async () => {
      // Arrange
      const request: GetGoalByIdQueryRequestDto = {
        goalId: ''
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toBe('Validation failed for field \'goalId\': Goal ID is required');
      expect(mockPort.getGoalById).not.toHaveBeenCalled();
    });

    it('should return validation error when goalId is null', async () => {
      // Arrange
      const request: GetGoalByIdQueryRequestDto = {
        goalId: null as any
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toBe('Validation failed for field \'goalId\': Goal ID is required');
      expect(mockPort.getGoalById).not.toHaveBeenCalled();
    });

    it('should return validation error when goalId is undefined', async () => {
      // Arrange
      const request: GetGoalByIdQueryRequestDto = {
        goalId: undefined as any
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toBe('Validation failed for field \'goalId\': Goal ID is required');
      expect(mockPort.getGoalById).not.toHaveBeenCalled();
    });

    it('should return validation error when goalId is only whitespace', async () => {
      // Arrange
      const request: GetGoalByIdQueryRequestDto = {
        goalId: '   '
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toBe('Validation failed for field \'goalId\': Goal ID is required');
      expect(mockPort.getGoalById).not.toHaveBeenCalled();
    });

    it('should return errors when port returns errors', async () => {
      // Arrange
      const request: GetGoalByIdQueryRequestDto = {
        goalId: 'goal-123'
      };

      const mockError = new ValidationError('test', 'Port error');
      mockPort.getGoalById.and.returnValue(Promise.resolve(Either.error(mockError)));

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBe(mockError);
      expect(mockPort.getGoalById).toHaveBeenCalledWith(request);
    });

    it('should return unexpected error when port throws', async () => {
      // Arrange
      const request: GetGoalByIdQueryRequestDto = {
        goalId: 'goal-123'
      };

      const mockError = new Error('Port threw an error');
      mockPort.getGoalById.and.throwError(mockError);

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBeInstanceOf(UnexpectedError);
      expect(result.errors[0].message).toContain('get goal by id');
      expect(mockPort.getGoalById).toHaveBeenCalledWith(request);
    });
  });
});
