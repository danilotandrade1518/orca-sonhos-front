import { UpdateBudgetUseCase } from './update-budget-use-case';
import { IUpdateBudgetPort } from '../../../ports/budget/update-budget.port';
import { UpdateBudgetRequestDto } from '../../../dtos/budget/request/update-budget-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { BudgetRequestMapper } from '../../../mappers/budget/budget-request-mapper/budget-request-mapper';

describe('UpdateBudgetUseCase', () => {
  let useCase: UpdateBudgetUseCase;
  let mockUpdateBudgetPort: jasmine.SpyObj<IUpdateBudgetPort>;

  beforeEach(() => {
    mockUpdateBudgetPort = jasmine.createSpyObj('IUpdateBudgetPort', ['updateBudget']);
    useCase = new UpdateBudgetUseCase(mockUpdateBudgetPort);
  });

  describe('execute', () => {
    it('should update budget successfully via HTTP', async () => {
      const validRequest: UpdateBudgetRequestDto = {
        budgetId: 'budget-123',
        name: 'Updated Budget',
        limitInCents: 150000,
      };

      spyOn(BudgetRequestMapper, 'validateUpdateRequest').and.returnValue(Either.success(true));
      const mockBackendResponse = { id: 'budget-123' };
      mockUpdateBudgetPort.updateBudget.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(BudgetRequestMapper.validateUpdateRequest).toHaveBeenCalledWith(validRequest);
      expect(mockUpdateBudgetPort.updateBudget).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when request data is invalid', async () => {
      const invalidRequest: UpdateBudgetRequestDto = {
        budgetId: '',
        name: '',
        limitInCents: -100,
      };

      const validationError = new ValidationError('budgetId', 'Budget ID is required');
      spyOn(BudgetRequestMapper, 'validateUpdateRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockUpdateBudgetPort.updateBudget).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: UpdateBudgetRequestDto = {
        budgetId: 'budget-123',
        name: 'Updated Budget',
        limitInCents: 150000,
      };

      spyOn(BudgetRequestMapper, 'validateUpdateRequest').and.returnValue(Either.success(true));
      const networkError = new NetworkError('updateBudget', 'Connection failed');
      mockUpdateBudgetPort.updateBudget.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: UpdateBudgetRequestDto = {
        budgetId: 'budget-123',
        name: 'Updated Budget',
        limitInCents: 150000,
      };

      spyOn(BudgetRequestMapper, 'validateUpdateRequest').and.throwError('Unexpected mapper error');

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
