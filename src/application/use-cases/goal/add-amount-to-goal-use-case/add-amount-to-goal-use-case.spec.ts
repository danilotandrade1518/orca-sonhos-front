import { AddAmountToGoalUseCase } from './add-amount-to-goal-use-case';
import { IAddAmountToGoalPort } from '../../../ports/goal/add-amount-to-goal.port';
import { AddAmountToGoalRequestDto } from '../../../dtos/goal/request/add-amount-to-goal-request.dto';
import { AddAmountToGoalResponseDto } from '../../../dtos/goal/response/add-amount-to-goal-response.dto';
import { Either } from '../../../../shared/core/either/either';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';

describe('AddAmountToGoalUseCase', () => {
  let addAmountToGoalUseCase: AddAmountToGoalUseCase;
  let mockAddAmountToGoalPort: jasmine.SpyObj<IAddAmountToGoalPort>;

  beforeEach(() => {
    mockAddAmountToGoalPort = jasmine.createSpyObj('IAddAmountToGoalPort', ['addAmountToGoal']);
    addAmountToGoalUseCase = new AddAmountToGoalUseCase(mockAddAmountToGoalPort);
  });

  describe('execute', () => {
    const validRequest: AddAmountToGoalRequestDto = {
      id: 'goal-123',
      amount: 1000,
    };

    it('should add amount to goal successfully', async () => {
      // Arrange
      const expectedResponse: AddAmountToGoalResponseDto = {
        id: 'goal-123',
        amount: 1000,
        newAccumulatedAmount: 3000,
        progressPercentage: 30,
      };

      mockAddAmountToGoalPort.addAmountToGoal.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await addAmountToGoalUseCase.execute(validRequest);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(expectedResponse);
      expect(mockAddAmountToGoalPort.addAmountToGoal).toHaveBeenCalledWith({
        id: 'goal-123',
        amount: 1000,
      });
    });

    it('should return validation error when request is invalid', async () => {
      // Arrange
      const invalidRequest: AddAmountToGoalRequestDto = {
        id: '', // Invalid: empty id
        amount: 1000,
      };

      // Act
      const result = await addAmountToGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Goal ID is required');
      expect(mockAddAmountToGoalPort.addAmountToGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when id is missing', async () => {
      // Arrange
      const invalidRequest = {
        amount: 1000,
      } as AddAmountToGoalRequestDto;

      // Act
      const result = await addAmountToGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Goal ID is required');
      expect(mockAddAmountToGoalPort.addAmountToGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when amount is missing', async () => {
      // Arrange
      const invalidRequest = {
        id: 'goal-123',
      } as AddAmountToGoalRequestDto;

      // Act
      const result = await addAmountToGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Amount is required');
      expect(mockAddAmountToGoalPort.addAmountToGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when amount is zero', async () => {
      // Arrange
      const invalidRequest: AddAmountToGoalRequestDto = {
        id: 'goal-123',
        amount: 0, // Invalid: zero amount
      };

      // Act
      const result = await addAmountToGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain(
        'Amount is required and must be a positive number'
      );
      expect(mockAddAmountToGoalPort.addAmountToGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when amount is negative', async () => {
      // Arrange
      const invalidRequest: AddAmountToGoalRequestDto = {
        id: 'goal-123',
        amount: -100, // Invalid: negative amount
      };

      // Act
      const result = await addAmountToGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain(
        'Amount is required and must be a positive number'
      );
      expect(mockAddAmountToGoalPort.addAmountToGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when amount is not a number', async () => {
      // Arrange
      const invalidRequest = {
        id: 'goal-123',
        amount: '1000', // Invalid: string instead of number
      } as any;

      // Act
      const result = await addAmountToGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain(
        'Amount is required and must be a positive number'
      );
      expect(mockAddAmountToGoalPort.addAmountToGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when request is null', async () => {
      // Arrange
      const invalidRequest = null as any;

      // Act
      const result = await addAmountToGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Request DTO is required');
      expect(mockAddAmountToGoalPort.addAmountToGoal).not.toHaveBeenCalled();
    });

    it('should return error when port fails', async () => {
      // Arrange
      const portError = new ValidationError('port', 'Port error');
      mockAddAmountToGoalPort.addAmountToGoal.and.returnValue(
        Promise.resolve(Either.error(portError))
      );

      // Act
      const result = await addAmountToGoalUseCase.execute(validRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBe(portError);
      expect(mockAddAmountToGoalPort.addAmountToGoal).toHaveBeenCalledWith({
        id: 'goal-123',
        amount: 1000,
      });
    });

    it('should return unexpected error when exception occurs', async () => {
      // Arrange
      const exception = new Error('Unexpected error');
      mockAddAmountToGoalPort.addAmountToGoal.and.returnValue(Promise.reject(exception));

      // Act
      const result = await addAmountToGoalUseCase.execute(validRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ApplicationError);
      expect(result.errors[0].message).toContain('Unexpected error');
    });

    it('should normalize request data before sending to port', async () => {
      // Arrange
      const requestWithSpaces: AddAmountToGoalRequestDto = {
        id: '  goal-123  ',
        amount: 1000,
      };

      const expectedResponse: AddAmountToGoalResponseDto = {
        id: 'goal-123',
        amount: 1000,
        newAccumulatedAmount: 3000,
        progressPercentage: 30,
      };

      mockAddAmountToGoalPort.addAmountToGoal.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await addAmountToGoalUseCase.execute(requestWithSpaces);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(expectedResponse);
      expect(mockAddAmountToGoalPort.addAmountToGoal).toHaveBeenCalledWith({
        id: 'goal-123',
        amount: 1000,
      });
    });

    it('should handle large amounts', async () => {
      // Arrange
      const largeAmountRequest: AddAmountToGoalRequestDto = {
        id: 'goal-456',
        amount: 1000000,
      };

      const expectedResponse: AddAmountToGoalResponseDto = {
        id: 'goal-456',
        amount: 1000000,
        newAccumulatedAmount: 2000000,
        progressPercentage: 200,
      };

      mockAddAmountToGoalPort.addAmountToGoal.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await addAmountToGoalUseCase.execute(largeAmountRequest);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(expectedResponse);
      expect(mockAddAmountToGoalPort.addAmountToGoal).toHaveBeenCalledWith({
        id: 'goal-456',
        amount: 1000000,
      });
    });
  });
});
