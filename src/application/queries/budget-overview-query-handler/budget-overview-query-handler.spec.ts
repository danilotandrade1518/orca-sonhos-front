import { BudgetOverviewQueryHandler } from './budget-overview-query-handler';
import { IBudgetOverviewPort } from '../../ports/budget-overview.port';
import { BudgetOverviewQueryRequestDto } from '../../dtos/request/budget-overview-query-request.dto';
import { BudgetOverviewQueryResponseDto } from '../../dtos/response/budget-overview-query-response.dto';
import { Either } from '../../../shared/core/either/either';
import { ValidationError } from '../../errors/validation-error';
import { NetworkError } from '../../errors/network-error';
import { UnexpectedError } from '../../errors/unexpected-error';

describe('BudgetOverviewQueryHandler', () => {
  let queryHandler: BudgetOverviewQueryHandler;
  let mockBudgetOverviewPort: jasmine.SpyObj<IBudgetOverviewPort>;

  beforeEach(() => {
    mockBudgetOverviewPort = jasmine.createSpyObj('IBudgetOverviewPort', ['getBudgetOverview']);
    queryHandler = new BudgetOverviewQueryHandler(mockBudgetOverviewPort);
  });

  describe('execute', () => {
    it('should get budget overview successfully via HTTP', async () => {
      const validRequest: BudgetOverviewQueryRequestDto = {
        budgetId: 'budget-123',
        userId: 'user-123',
      };

      const mockOverview: BudgetOverviewQueryResponseDto = {
        id: 'budget-123',
        name: 'Personal Budget',
        type: 'PERSONAL',
        participants: [{ id: 'participant-1' }, { id: 'participant-2' }],
        totals: {
          accountsBalance: 5000,
          monthIncome: 3000,
          monthExpense: 2000,
          netMonth: 1000,
        },
        accounts: [
          {
            id: 'account-1',
            name: 'Checking Account',
            type: 'CHECKING',
            balance: 5000,
          },
        ],
      };

      mockBudgetOverviewPort.getBudgetOverview.and.returnValue(
        Promise.resolve(Either.success(mockOverview))
      );

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockOverview);
      expect(mockBudgetOverviewPort.getBudgetOverview).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when budgetId is empty', async () => {
      const invalidRequest: BudgetOverviewQueryRequestDto = {
        budgetId: '',
        userId: 'user-123',
      };

      const result = await queryHandler.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Budget ID is required');
      expect(mockBudgetOverviewPort.getBudgetOverview).not.toHaveBeenCalled();
    });

    it('should return validation error when userId is empty', async () => {
      const invalidRequest: BudgetOverviewQueryRequestDto = {
        budgetId: 'budget-123',
        userId: '',
      };

      const result = await queryHandler.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('User ID is required');
      expect(mockBudgetOverviewPort.getBudgetOverview).not.toHaveBeenCalled();
    });

    it('should return validation error when both budgetId and userId are empty', async () => {
      const invalidRequest: BudgetOverviewQueryRequestDto = {
        budgetId: '',
        userId: '',
      };

      const result = await queryHandler.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Budget ID is required');
      expect(mockBudgetOverviewPort.getBudgetOverview).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: BudgetOverviewQueryRequestDto = {
        budgetId: 'budget-123',
        userId: 'user-123',
      };

      const networkError = new NetworkError('getBudgetOverview', 'Connection failed');
      mockBudgetOverviewPort.getBudgetOverview.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: BudgetOverviewQueryRequestDto = {
        budgetId: 'budget-123',
        userId: 'user-123',
      };

      mockBudgetOverviewPort.getBudgetOverview.and.throwError('Unexpected port error');

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
