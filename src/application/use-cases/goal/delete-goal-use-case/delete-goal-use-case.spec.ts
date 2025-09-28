import { DeleteGoalUseCase } from './delete-goal-use-case';
import { IDeleteGoalPort } from '../../../ports/goal/delete-goal.port';
import { DeleteGoalRequestDto } from '../../../dtos/goal/request/delete-goal-request.dto';
import { DeleteGoalResponseDto } from '../../../dtos/goal/response/delete-goal-response.dto';
import { Either } from '../../../../shared/core/either/either';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';

describe('DeleteGoalUseCase', () => {
  let deleteGoalUseCase: DeleteGoalUseCase;
  let mockDeleteGoalPort: jasmine.SpyObj<IDeleteGoalPort>;

  beforeEach(() => {
    mockDeleteGoalPort = jasmine.createSpyObj('IDeleteGoalPort', ['deleteGoal']);
    deleteGoalUseCase = new DeleteGoalUseCase(mockDeleteGoalPort);
  });

  describe('execute', () => {
    const validRequest: DeleteGoalRequestDto = {
      id: 'goal-123',
    };

    it('should delete goal successfully', async () => {
      // Arrange
      const expectedResponse: DeleteGoalResponseDto = {
        id: 'goal-123',
      };

      mockDeleteGoalPort.deleteGoal.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await deleteGoalUseCase.execute(validRequest);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(expectedResponse);
      expect(mockDeleteGoalPort.deleteGoal).toHaveBeenCalledWith({
        id: 'goal-123',
      });
    });

    it('should return validation error when request is invalid', async () => {
      // Arrange
      const invalidRequest: DeleteGoalRequestDto = {
        id: '', // Invalid: empty id
      };

      // Act
      const result = await deleteGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Goal ID is required');
      expect(mockDeleteGoalPort.deleteGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when id is missing', async () => {
      // Arrange
      const invalidRequest = {} as DeleteGoalRequestDto;

      // Act
      const result = await deleteGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Goal ID is required');
      expect(mockDeleteGoalPort.deleteGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when id is not a string', async () => {
      // Arrange
      const invalidRequest = {
        id: 123, // Invalid: not a string
      } as any;

      // Act
      const result = await deleteGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Goal ID is required');
      expect(mockDeleteGoalPort.deleteGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when request is null', async () => {
      // Arrange
      const invalidRequest = null as any;

      // Act
      const result = await deleteGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Request DTO is required');
      expect(mockDeleteGoalPort.deleteGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when request is undefined', async () => {
      // Arrange
      const invalidRequest = undefined as any;

      // Act
      const result = await deleteGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Request DTO is required');
      expect(mockDeleteGoalPort.deleteGoal).not.toHaveBeenCalled();
    });

    it('should return error when port fails', async () => {
      // Arrange
      const portError = new ValidationError('port', 'Port error');
      mockDeleteGoalPort.deleteGoal.and.returnValue(Promise.resolve(Either.error(portError)));

      // Act
      const result = await deleteGoalUseCase.execute(validRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBe(portError);
      expect(mockDeleteGoalPort.deleteGoal).toHaveBeenCalledWith({
        id: 'goal-123',
      });
    });

    it('should return unexpected error when exception occurs', async () => {
      // Arrange
      const exception = new Error('Unexpected error');
      mockDeleteGoalPort.deleteGoal.and.returnValue(Promise.reject(exception));

      // Act
      const result = await deleteGoalUseCase.execute(validRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ApplicationError);
      expect(result.errors[0].message).toContain('Unexpected error');
    });

    it('should normalize request data before sending to port', async () => {
      // Arrange
      const requestWithSpaces: DeleteGoalRequestDto = {
        id: '  goal-123  ',
      };

      const expectedResponse: DeleteGoalResponseDto = {
        id: 'goal-123',
      };

      mockDeleteGoalPort.deleteGoal.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await deleteGoalUseCase.execute(requestWithSpaces);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(expectedResponse);
      expect(mockDeleteGoalPort.deleteGoal).toHaveBeenCalledWith({
        id: 'goal-123',
      });
    });
  });
});
