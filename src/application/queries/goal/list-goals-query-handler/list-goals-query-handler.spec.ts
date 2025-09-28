import { ListGoalsQueryHandler } from './list-goals-query-handler';
import { IListGoalsPort } from '../../../ports/goal/list-goals.port';
import { ListGoalsQueryRequestDto } from '../../../dtos/goal/request/list-goals-query-request.dto';
import { ListGoalsQueryResponseDto } from '../../../dtos/goal/response/list-goals-query-response.dto';
import { Either } from '../../../../shared/core/either/either';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

describe('ListGoalsQueryHandler', () => {
  let handler: ListGoalsQueryHandler;
  let mockPort: jasmine.SpyObj<IListGoalsPort>;

  beforeEach(() => {
    mockPort = jasmine.createSpyObj('IListGoalsPort', ['listGoals']);
    handler = new ListGoalsQueryHandler(mockPort);
  });

  it('should be created', () => {
    expect(handler).toBeTruthy();
  });

  describe('execute', () => {
    it('should return success when port returns success', async () => {
      // Arrange
      const request: ListGoalsQueryRequestDto = {
        budgetId: 'budget-123'
      };

      const mockResponse: ListGoalsQueryResponseDto = {
        goals: [
          {
            id: 'goal-1',
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
            isOverdue: false
          }
        ]
      };

      mockPort.listGoals.and.returnValue(Promise.resolve(Either.success(mockResponse)));

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBeFalse();
      expect(result.data).toEqual(mockResponse);
      expect(mockPort.listGoals).toHaveBeenCalledWith(request);
    });

    it('should return validation error when budgetId is empty', async () => {
      // Arrange
      const request: ListGoalsQueryRequestDto = {
        budgetId: ''
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toBe('Validation failed for field \'budgetId\': Budget ID is required');
      expect(mockPort.listGoals).not.toHaveBeenCalled();
    });

    it('should return validation error when budgetId is null', async () => {
      // Arrange
      const request: ListGoalsQueryRequestDto = {
        budgetId: null as any
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toBe('Validation failed for field \'budgetId\': Budget ID is required');
      expect(mockPort.listGoals).not.toHaveBeenCalled();
    });

    it('should return validation error when budgetId is undefined', async () => {
      // Arrange
      const request: ListGoalsQueryRequestDto = {
        budgetId: undefined as any
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toBe('Validation failed for field \'budgetId\': Budget ID is required');
      expect(mockPort.listGoals).not.toHaveBeenCalled();
    });

    it('should return validation error when budgetId is only whitespace', async () => {
      // Arrange
      const request: ListGoalsQueryRequestDto = {
        budgetId: '   '
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toBe('Validation failed for field \'budgetId\': Budget ID is required');
      expect(mockPort.listGoals).not.toHaveBeenCalled();
    });

    it('should return errors when port returns errors', async () => {
      // Arrange
      const request: ListGoalsQueryRequestDto = {
        budgetId: 'budget-123'
      };

      const mockError = new ValidationError('test', 'Port error');
      mockPort.listGoals.and.returnValue(Promise.resolve(Either.error(mockError)));

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBe(mockError);
      expect(mockPort.listGoals).toHaveBeenCalledWith(request);
    });

    it('should return unexpected error when port throws', async () => {
      // Arrange
      const request: ListGoalsQueryRequestDto = {
        budgetId: 'budget-123'
      };

      const mockError = new Error('Port threw an error');
      mockPort.listGoals.and.throwError(mockError);

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBeInstanceOf(UnexpectedError);
      expect(result.errors[0].message).toContain('list goals');
      expect(mockPort.listGoals).toHaveBeenCalledWith(request);
    });

    it('should pass optional status parameter to port', async () => {
      // Arrange
      const request: ListGoalsQueryRequestDto = {
        budgetId: 'budget-123',
        status: 'active'
      };

      const mockResponse: ListGoalsQueryResponseDto = {
        goals: []
      };

      mockPort.listGoals.and.returnValue(Promise.resolve(Either.success(mockResponse)));

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBeFalse();
      expect(result.data).toEqual(mockResponse);
      expect(mockPort.listGoals).toHaveBeenCalledWith(request);
    });
  });
});
