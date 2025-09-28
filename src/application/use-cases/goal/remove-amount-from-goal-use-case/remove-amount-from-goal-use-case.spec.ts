import { RemoveAmountFromGoalUseCase } from './remove-amount-from-goal-use-case';
import { IRemoveAmountFromGoalPort } from '../../../ports/goal/remove-amount-from-goal.port';
import { RemoveAmountFromGoalRequestDto } from '../../../dtos/goal/request/remove-amount-from-goal-request.dto';
import { RemoveAmountFromGoalResponseDto } from '../../../dtos/goal/response/remove-amount-from-goal-response.dto';
import { Either } from '../../../../shared/core/either/either';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';

describe('RemoveAmountFromGoalUseCase', () => {
  let removeAmountFromGoalUseCase: RemoveAmountFromGoalUseCase;
  let mockRemoveAmountFromGoalPort: jasmine.SpyObj<IRemoveAmountFromGoalPort>;

  beforeEach(() => {
    mockRemoveAmountFromGoalPort = jasmine.createSpyObj('IRemoveAmountFromGoalPort', [
      'removeAmountFromGoal',
    ]);
    removeAmountFromGoalUseCase = new RemoveAmountFromGoalUseCase(mockRemoveAmountFromGoalPort);
  });

  describe('execute', () => {
    const validRequest: RemoveAmountFromGoalRequestDto = {
      id: 'goal-123',
      amount: 500,
    };

    it('should remove amount from goal successfully', async () => {
      // Arrange
      const expectedResponse: RemoveAmountFromGoalResponseDto = {
        id: 'goal-123',
        amount: 500,
        newAccumulatedAmount: 1500,
        progressPercentage: 15,
      };

      mockRemoveAmountFromGoalPort.removeAmountFromGoal.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await removeAmountFromGoalUseCase.execute(validRequest);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(expectedResponse);
      expect(mockRemoveAmountFromGoalPort.removeAmountFromGoal).toHaveBeenCalledWith({
        id: 'goal-123',
        amount: 500,
      });
    });

    it('should return validation error when request is invalid', async () => {
      // Arrange
      const invalidRequest: RemoveAmountFromGoalRequestDto = {
        id: '', // Invalid: empty id
        amount: 500,
      };

      // Act
      const result = await removeAmountFromGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Goal ID is required');
      expect(mockRemoveAmountFromGoalPort.removeAmountFromGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when id is missing', async () => {
      // Arrange
      const invalidRequest = {
        amount: 500,
      } as RemoveAmountFromGoalRequestDto;

      // Act
      const result = await removeAmountFromGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Goal ID is required');
      expect(mockRemoveAmountFromGoalPort.removeAmountFromGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when amount is missing', async () => {
      // Arrange
      const invalidRequest = {
        id: 'goal-123',
      } as RemoveAmountFromGoalRequestDto;

      // Act
      const result = await removeAmountFromGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Amount is required');
      expect(mockRemoveAmountFromGoalPort.removeAmountFromGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when amount is zero', async () => {
      // Arrange
      const invalidRequest: RemoveAmountFromGoalRequestDto = {
        id: 'goal-123',
        amount: 0, // Invalid: zero amount
      };

      // Act
      const result = await removeAmountFromGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain(
        'Amount is required and must be a positive number'
      );
      expect(mockRemoveAmountFromGoalPort.removeAmountFromGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when amount is negative', async () => {
      // Arrange
      const invalidRequest: RemoveAmountFromGoalRequestDto = {
        id: 'goal-123',
        amount: -100, // Invalid: negative amount
      };

      // Act
      const result = await removeAmountFromGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain(
        'Amount is required and must be a positive number'
      );
      expect(mockRemoveAmountFromGoalPort.removeAmountFromGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when amount is not a number', async () => {
      // Arrange
      const invalidRequest = {
        id: 'goal-123',
        amount: '500', // Invalid: string instead of number
      } as any;

      // Act
      const result = await removeAmountFromGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain(
        'Amount is required and must be a positive number'
      );
      expect(mockRemoveAmountFromGoalPort.removeAmountFromGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when request is null', async () => {
      // Arrange
      const invalidRequest = null as any;

      // Act
      const result = await removeAmountFromGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Request DTO is required');
      expect(mockRemoveAmountFromGoalPort.removeAmountFromGoal).not.toHaveBeenCalled();
    });

    it('should return error when port fails', async () => {
      // Arrange
      const portError = new ValidationError('port', 'Port error');
      mockRemoveAmountFromGoalPort.removeAmountFromGoal.and.returnValue(
        Promise.resolve(Either.error(portError))
      );

      // Act
      const result = await removeAmountFromGoalUseCase.execute(validRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBe(portError);
      expect(mockRemoveAmountFromGoalPort.removeAmountFromGoal).toHaveBeenCalledWith({
        id: 'goal-123',
        amount: 500,
      });
    });

    it('should return unexpected error when exception occurs', async () => {
      // Arrange
      const exception = new Error('Unexpected error');
      mockRemoveAmountFromGoalPort.removeAmountFromGoal.and.returnValue(Promise.reject(exception));

      // Act
      const result = await removeAmountFromGoalUseCase.execute(validRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ApplicationError);
      expect(result.errors[0].message).toContain('Unexpected error');
    });

    it('should normalize request data before sending to port', async () => {
      // Arrange
      const requestWithSpaces: RemoveAmountFromGoalRequestDto = {
        id: '  goal-123  ',
        amount: 500,
      };

      const expectedResponse: RemoveAmountFromGoalResponseDto = {
        id: 'goal-123',
        amount: 500,
        newAccumulatedAmount: 1500,
        progressPercentage: 15,
      };

      mockRemoveAmountFromGoalPort.removeAmountFromGoal.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await removeAmountFromGoalUseCase.execute(requestWithSpaces);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(expectedResponse);
      expect(mockRemoveAmountFromGoalPort.removeAmountFromGoal).toHaveBeenCalledWith({
        id: 'goal-123',
        amount: 500,
      });
    });

    it('should handle large amounts', async () => {
      // Arrange
      const largeAmountRequest: RemoveAmountFromGoalRequestDto = {
        id: 'goal-456',
        amount: 1000000,
      };

      const expectedResponse: RemoveAmountFromGoalResponseDto = {
        id: 'goal-456',
        amount: 1000000,
        newAccumulatedAmount: 1000000,
        progressPercentage: 100,
      };

      mockRemoveAmountFromGoalPort.removeAmountFromGoal.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await removeAmountFromGoalUseCase.execute(largeAmountRequest);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(expectedResponse);
      expect(mockRemoveAmountFromGoalPort.removeAmountFromGoal).toHaveBeenCalledWith({
        id: 'goal-456',
        amount: 1000000,
      });
    });
  });
});
