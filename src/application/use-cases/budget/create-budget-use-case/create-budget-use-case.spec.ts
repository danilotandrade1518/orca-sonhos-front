import { CreateBudgetUseCase } from './create-budget-use-case';
import { ICreateBudgetPort } from '../../../ports/budget/create-budget.port';
import { CreateBudgetRequestDto } from '../../../dtos/budget/request/create-budget-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { BudgetRequestMapper } from '../../../mappers/budget/budget-request-mapper/budget-request-mapper';

describe('CreateBudgetUseCase', () => {
  let useCase: CreateBudgetUseCase;
  let mockCreateBudgetPort: jasmine.SpyObj<ICreateBudgetPort>;

  beforeEach(() => {
    mockCreateBudgetPort = jasmine.createSpyObj('ICreateBudgetPort', ['createBudget']);
    useCase = new CreateBudgetUseCase(mockCreateBudgetPort);
  });

  describe('execute', () => {
    it('should create budget successfully via HTTP', async () => {
      const validRequest: CreateBudgetRequestDto = {
        name: 'Test Budget',
        limitInCents: 100000,
        ownerId: 'user-123',
      };

      const mockBudget = {
        id: 'budget-123',
        name: 'Test Budget',
        limitInCents: 100000,
        ownerId: 'user-123',
        participants: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      spyOn(BudgetRequestMapper, 'fromCreateRequestToBudget').and.returnValue(
        Either.success(mockBudget as any)
      );
      const mockBackendResponse = { id: 'budget-123' };
      mockCreateBudgetPort.createBudget.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(BudgetRequestMapper.fromCreateRequestToBudget).toHaveBeenCalledWith(validRequest);
      expect(mockCreateBudgetPort.createBudget).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when budget data is invalid', async () => {
      const invalidRequest: CreateBudgetRequestDto = {
        name: '',
        limitInCents: -100,
        ownerId: '',
      };

      const validationError = new ValidationError('name', 'Name is required');
      spyOn(BudgetRequestMapper, 'fromCreateRequestToBudget').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockCreateBudgetPort.createBudget).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: CreateBudgetRequestDto = {
        name: 'Test Budget',
        limitInCents: 100000,
        ownerId: 'user-123',
      };

      const mockBudget = {
        id: 'budget-123',
        name: 'Test Budget',
        limitInCents: 100000,
        ownerId: 'user-123',
        participants: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      spyOn(BudgetRequestMapper, 'fromCreateRequestToBudget').and.returnValue(
        Either.success(mockBudget as any)
      );
      const networkError = new NetworkError('createBudget', 'Connection failed');
      mockCreateBudgetPort.createBudget.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: CreateBudgetRequestDto = {
        name: 'Test Budget',
        limitInCents: 100000,
        ownerId: 'user-123',
      };

      spyOn(BudgetRequestMapper, 'fromCreateRequestToBudget').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
