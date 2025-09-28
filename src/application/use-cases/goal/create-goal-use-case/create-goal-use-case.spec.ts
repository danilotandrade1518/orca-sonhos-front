import { CreateGoalUseCase } from './create-goal-use-case';
import { ICreateGoalPort } from '../../../ports/goal/create-goal.port';
import { CreateGoalRequestDto } from '../../../dtos/goal/request/create-goal-request.dto';
import { CreateGoalResponseDto } from '../../../dtos/goal/response/create-goal-response.dto';
import { Either } from '../../../../shared/core/either/either';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';

describe('CreateGoalUseCase', () => {
  let createGoalUseCase: CreateGoalUseCase;
  let mockCreateGoalPort: jasmine.SpyObj<ICreateGoalPort>;

  beforeEach(() => {
    mockCreateGoalPort = jasmine.createSpyObj('ICreateGoalPort', ['createGoal']);
    createGoalUseCase = new CreateGoalUseCase(mockCreateGoalPort);
  });

  describe('execute', () => {
    const validRequest: CreateGoalRequestDto = {
      name: 'Viagem para Europa',
      totalAmount: 10000,
      accumulatedAmount: 2000,
      deadline: '2025-12-31',
      budgetId: 'budget-123',
      description: 'Economia para viagem de férias',
    };

    it('should create goal successfully', async () => {
      // Arrange
      const expectedResponse: CreateGoalResponseDto = {
        id: 'goal-123',
      };

      mockCreateGoalPort.createGoal.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await createGoalUseCase.execute(validRequest);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(expectedResponse);
      expect(mockCreateGoalPort.createGoal).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when request is invalid', async () => {
      // Arrange
      const invalidRequest: CreateGoalRequestDto = {
        name: '', // Invalid: empty name
        totalAmount: -100, // Invalid: negative amount
        budgetId: '', // Invalid: empty budgetId
      } as CreateGoalRequestDto;

      // Act
      const result = await createGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(mockCreateGoalPort.createGoal).not.toHaveBeenCalled();
    });

    it('should return validation error when goal creation fails', async () => {
      // Arrange
      const invalidRequest: CreateGoalRequestDto = {
        name: 'a'.repeat(101), // Invalid: name too long
        totalAmount: 10000,
        budgetId: 'budget-123',
      };

      // Act
      const result = await createGoalUseCase.execute(invalidRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(mockCreateGoalPort.createGoal).not.toHaveBeenCalled();
    });

    it('should return error when port fails', async () => {
      // Arrange
      const portError = new ValidationError('port', 'Port error');
      mockCreateGoalPort.createGoal.and.returnValue(Promise.resolve(Either.error(portError)));

      // Act
      const result = await createGoalUseCase.execute(validRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBe(portError);
      expect(mockCreateGoalPort.createGoal).toHaveBeenCalledWith(validRequest);
    });

    it('should return unexpected error when exception occurs', async () => {
      // Arrange
      const exception = new Error('Unexpected error');
      mockCreateGoalPort.createGoal.and.returnValue(Promise.reject(exception));

      // Act
      const result = await createGoalUseCase.execute(validRequest);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toBeInstanceOf(ApplicationError);
      expect(result.errors[0].message).toContain('Unexpected error');
    });

    it('should handle request with minimal required fields', async () => {
      // Arrange
      const minimalRequest: CreateGoalRequestDto = {
        name: 'Meta Simples',
        totalAmount: 5000,
        budgetId: 'budget-456',
      };

      const expectedResponse: CreateGoalResponseDto = {
        id: 'goal-456',
      };

      mockCreateGoalPort.createGoal.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await createGoalUseCase.execute(minimalRequest);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(expectedResponse);
      expect(mockCreateGoalPort.createGoal).toHaveBeenCalledWith(minimalRequest);
    });

    it('should handle request with all optional fields', async () => {
      // Arrange
      const fullRequest: CreateGoalRequestDto = {
        name: 'Meta Completa',
        totalAmount: 15000,
        accumulatedAmount: 5000,
        deadline: '2026-06-30',
        budgetId: 'budget-789',
        description: 'Meta com todos os campos preenchidos',
      };

      const expectedResponse: CreateGoalResponseDto = {
        id: 'goal-789',
      };

      mockCreateGoalPort.createGoal.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await createGoalUseCase.execute(fullRequest);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(expectedResponse);
      expect(mockCreateGoalPort.createGoal).toHaveBeenCalledWith(fullRequest);
    });
  });
});
