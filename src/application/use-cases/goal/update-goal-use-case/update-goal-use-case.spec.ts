import { UpdateGoalUseCase } from './update-goal-use-case';
import { IUpdateGoalPort } from '../../../ports/goal/update-goal.port';
import { UpdateGoalRequestDto } from '../../../dtos/goal/request/update-goal-request.dto';
import { UpdateGoalResponseDto } from '../../../dtos/goal/response/update-goal-response.dto';
import { Either } from '../../../../shared/core/either/either';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';

describe('UpdateGoalUseCase', () => {
  let updateGoalUseCase: UpdateGoalUseCase;
  let mockUpdateGoalPort: jasmine.SpyObj<IUpdateGoalPort>;

  beforeEach(() => {
    mockUpdateGoalPort = jasmine.createSpyObj('IUpdateGoalPort', ['updateGoal']);
    updateGoalUseCase = new UpdateGoalUseCase(mockUpdateGoalPort);
  });

  describe('execute', () => {
    const validRequest: UpdateGoalRequestDto = {
      id: 'goal-123',
      name: 'Viagem para Europa Atualizada',
      totalAmount: 12000,
      deadline: '2025-12-31',
      description: 'Economia para viagem de férias atualizada',
    };

    it('should update goal successfully', async () => {
      // Arrange
      const expectedResponse: UpdateGoalResponseDto = {
        id: 'goal-123',
      };

      mockUpdateGoalPort.updateGoal.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await updateGoalUseCase.execute(validRequest);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(expectedResponse);
      expect(mockUpdateGoalPort.updateGoal).toHaveBeenCalledWith({
        id: 'goal-123',
        name: 'Viagem para Europa Atualizada',
        totalAmount: 12000,
        deadline: '2025-12-31',
        description: 'Economia para viagem de férias atualizada',
      });
    });

    it('should return validation error when request is invalid', async () => {
      // Arrange
      const invalidRequest: UpdateGoalRequestDto = {
        id: '', // Invalid: empty id
        name: 'Updated Goal',
        totalAmount: 10000,
      } as UpdateGoalRequestDto;

      // Act
      const result = await updateGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Goal ID is required');
      expect(mockUpdateGoalPort.updateGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when id is missing', async () => {
      // Arrange
      const invalidRequest = {
        name: 'Updated Goal',
        totalAmount: 10000,
      } as UpdateGoalRequestDto;

      // Act
      const result = await updateGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Goal ID is required');
      expect(mockUpdateGoalPort.updateGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when id is not a string', async () => {
      // Arrange
      const invalidRequest = {
        id: 123, // Invalid: not a string
        name: 'Updated Goal',
        totalAmount: 10000,
      } as any;

      // Act
      const result = await updateGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toContain('Goal ID is required');
      expect(mockUpdateGoalPort.updateGoal).not.toHaveBeenCalled();
    });

    it('should return error when port fails', async () => {
      // Arrange
      const portError = new ValidationError('port', 'Port error');
      mockUpdateGoalPort.updateGoal.and.returnValue(Promise.resolve(Either.error(portError)));

      // Act
      const result = await updateGoalUseCase.execute(validRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBe(portError);
      expect(mockUpdateGoalPort.updateGoal).toHaveBeenCalledWith({
        id: 'goal-123',
        name: 'Viagem para Europa Atualizada',
        totalAmount: 12000,
        deadline: '2025-12-31',
        description: 'Economia para viagem de férias atualizada',
      });
    });

    it('should return unexpected error when exception occurs', async () => {
      // Arrange
      const exception = new Error('Unexpected error');
      mockUpdateGoalPort.updateGoal.and.returnValue(Promise.reject(exception));

      // Act
      const result = await updateGoalUseCase.execute(validRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ApplicationError);
      expect(result.errors[0].message).toContain('Unexpected error');
    });

    it('should normalize request data before sending to port', async () => {
      // Arrange
      const requestWithSpaces: UpdateGoalRequestDto = {
        id: '  goal-123  ',
        name: '  Goal with spaces  ',
        totalAmount: 10000,
        description: '  Description with spaces  ',
      };

      const expectedResponse: UpdateGoalResponseDto = {
        id: 'goal-123',
      };

      mockUpdateGoalPort.updateGoal.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await updateGoalUseCase.execute(requestWithSpaces);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(expectedResponse);
      expect(mockUpdateGoalPort.updateGoal).toHaveBeenCalledWith({
        id: 'goal-123',
        name: 'Goal with spaces',
        totalAmount: 10000,
        deadline: undefined,
        description: 'Description with spaces',
      });
    });

    it('should handle request with minimal fields', async () => {
      // Arrange
      const minimalRequest: UpdateGoalRequestDto = {
        id: 'goal-456',
        name: 'Updated Goal Name',
      };

      const expectedResponse: UpdateGoalResponseDto = {
        id: 'goal-456',
      };

      mockUpdateGoalPort.updateGoal.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await updateGoalUseCase.execute(minimalRequest);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(expectedResponse);
      expect(mockUpdateGoalPort.updateGoal).toHaveBeenCalledWith({
        id: 'goal-456',
        name: 'Updated Goal Name',
        totalAmount: undefined,
        deadline: undefined,
        description: undefined,
      });
    });
  });
});
