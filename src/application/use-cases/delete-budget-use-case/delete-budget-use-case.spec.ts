import { DeleteBudgetUseCase } from './delete-budget-use-case';
import { IDeleteBudgetPort } from '../../ports/delete-budget.port';
import { DeleteBudgetRequestDto } from '../../dtos/request/delete-budget-request.dto';
import { Either } from '../../../shared/core/either/either';
import { ValidationError } from '../../errors/validation-error';
import { NetworkError } from '../../errors/network-error';
import { UnexpectedError } from '../../errors/unexpected-error';
import { BudgetRequestMapper } from '../../mappers/budget-request-mapper/budget-request-mapper';

describe('DeleteBudgetUseCase', () => {
  let useCase: DeleteBudgetUseCase;
  let mockDeleteBudgetPort: jasmine.SpyObj<IDeleteBudgetPort>;

  beforeEach(() => {
    mockDeleteBudgetPort = jasmine.createSpyObj('IDeleteBudgetPort', ['deleteBudget']);
    useCase = new DeleteBudgetUseCase(mockDeleteBudgetPort);
  });

  describe('execute', () => {
    it('should delete budget successfully via HTTP', async () => {
      const validRequest: DeleteBudgetRequestDto = {
        budgetId: 'budget-123',
        requesterId: 'user-123',
      };

      spyOn(BudgetRequestMapper, 'validateDeleteRequest').and.returnValue(Either.success(true));
      const mockBackendResponse = { id: 'budget-123' };
      mockDeleteBudgetPort.deleteBudget.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(BudgetRequestMapper.validateDeleteRequest).toHaveBeenCalledWith(validRequest);
      expect(mockDeleteBudgetPort.deleteBudget).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when request data is invalid', async () => {
      const invalidRequest: DeleteBudgetRequestDto = {
        budgetId: '',
        requesterId: '',
      };

      const validationError = new ValidationError('budgetId', 'Budget ID is required');
      spyOn(BudgetRequestMapper, 'validateDeleteRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockDeleteBudgetPort.deleteBudget).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: DeleteBudgetRequestDto = {
        budgetId: 'budget-123',
        requesterId: 'user-123',
      };

      spyOn(BudgetRequestMapper, 'validateDeleteRequest').and.returnValue(Either.success(true));
      const networkError = new NetworkError('deleteBudget', 'Connection failed');
      mockDeleteBudgetPort.deleteBudget.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: DeleteBudgetRequestDto = {
        budgetId: 'budget-123',
        requesterId: 'user-123',
      };

      spyOn(BudgetRequestMapper, 'validateDeleteRequest').and.throwError('Unexpected mapper error');

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
