import { ListTransactionsQueryHandler } from './list-transactions-query-handler';
import { IListTransactionsPort } from '../../../ports/transaction/list-transactions.port';
import { ListTransactionsQueryRequestDto } from '../../../dtos/transaction/request/list-transactions-query-request.dto';
import { ListTransactionsQueryResponseDto } from '../../../dtos/transaction/response/list-transactions-query-response.dto';
import { Either } from '../../../../shared/core/either/either';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

describe('ListTransactionsQueryHandler', () => {
  let handler: ListTransactionsQueryHandler;
  let mockPort: jasmine.SpyObj<IListTransactionsPort>;

  beforeEach(() => {
    const portSpy = jasmine.createSpyObj('IListTransactionsPort', ['listTransactions']);
    handler = new ListTransactionsQueryHandler(portSpy);
    mockPort = portSpy;
  });

  describe('execute', () => {
    it('should return success when port returns success', async () => {
      const request: ListTransactionsQueryRequestDto = {
        budgetId: 'budget-123',
      };

      const mockResponse: ListTransactionsQueryResponseDto = {
        transactions: [
          {
            id: 'transaction-1',
            amount: { valueInCents: 10000, valueInMonetary: 100, formatted: 'R$ 100,00' },
            type: 'income' as any,
            accountId: 'account-1',
            categoryId: 'category-1',
            description: 'Test transaction',
            executedAt: '2024-01-01T00:00:00Z',
            isRecurring: false,
            createdAt: '2024-01-01T00:00:00Z',
            accountName: 'Test Account',
            categoryName: 'Test Category',
          },
        ],
        pagination: {
          page: 1,
          pageSize: 10,
          totalItems: 1,
          totalPages: 1,
        },
      };

      mockPort.listTransactions.and.returnValue(Promise.resolve(Either.success(mockResponse)));

      const result = await handler.execute(request);

      expect(result.hasError).toBeFalse();
      expect(result.data).toEqual(mockResponse);
      expect(mockPort.listTransactions).toHaveBeenCalledWith(request);
    });

    it('should return validation error when budgetId is empty', async () => {
      const request: ListTransactionsQueryRequestDto = {
        budgetId: '',
      };

      const result = await handler.execute(request);

      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toBe(
        "Validation failed for field 'budgetId': Budget ID is required"
      );
      expect(mockPort.listTransactions).not.toHaveBeenCalled();
    });

    it('should return validation error when budgetId is null', async () => {
      const request: ListTransactionsQueryRequestDto = {
        budgetId: null as any,
      };

      const result = await handler.execute(request);

      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toBe(
        "Validation failed for field 'budgetId': Budget ID is required"
      );
      expect(mockPort.listTransactions).not.toHaveBeenCalled();
    });

    it('should return validation error when budgetId is undefined', async () => {
      const request: ListTransactionsQueryRequestDto = {
        budgetId: undefined as any,
      };

      const result = await handler.execute(request);

      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toBe(
        "Validation failed for field 'budgetId': Budget ID is required"
      );
      expect(mockPort.listTransactions).not.toHaveBeenCalled();
    });

    it('should return errors when port returns errors', async () => {
      const request: ListTransactionsQueryRequestDto = {
        budgetId: 'budget-123',
      };

      const mockError = new ValidationError('test', 'Port error');
      mockPort.listTransactions.and.returnValue(Promise.resolve(Either.errors([mockError])));

      const result = await handler.execute(request);

      expect(result.hasError).toBeTrue();
      expect(result.errors).toEqual([mockError]);
      expect(mockPort.listTransactions).toHaveBeenCalledWith(request);
    });

    it('should return unexpected error when port throws', async () => {
      const request: ListTransactionsQueryRequestDto = {
        budgetId: 'budget-123',
      };

      const error = new Error('Port error');
      mockPort.listTransactions.and.throwError(error);

      const result = await handler.execute(request);

      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBeInstanceOf(UnexpectedError);
      expect(result.errors[0].message).toContain('list transactions');
    });
  });
});
