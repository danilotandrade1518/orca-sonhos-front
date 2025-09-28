import { GetTransactionByIdQueryHandler } from './get-transaction-by-id-query-handler';
import { IGetTransactionByIdPort } from '../../../ports/transaction/get-transaction-by-id.port';
import { GetTransactionByIdQueryRequestDto } from '../../../dtos/transaction/request/get-transaction-by-id-query-request.dto';
import { GetTransactionByIdQueryResponseDto } from '../../../dtos/transaction/response/get-transaction-by-id-query-response.dto';
import { Either } from '../../../../shared/core/either/either';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

describe('GetTransactionByIdQueryHandler', () => {
  let handler: GetTransactionByIdQueryHandler;
  let mockPort: jasmine.SpyObj<IGetTransactionByIdPort>;

  beforeEach(() => {
    const portSpy = jasmine.createSpyObj('IGetTransactionByIdPort', ['getTransactionById']);
    handler = new GetTransactionByIdQueryHandler(portSpy);
    mockPort = portSpy;
  });

  describe('execute', () => {
    it('should return success when port returns success', async () => {
      const request: GetTransactionByIdQueryRequestDto = {
        transactionId: 'transaction-123',
      };

      const mockResponse: GetTransactionByIdQueryResponseDto = {
        transaction: {
          id: 'transaction-123',
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
          budgetId: 'budget-123',
          isLate: false,
        },
      };

      mockPort.getTransactionById.and.returnValue(Promise.resolve(Either.success(mockResponse)));

      const result = await handler.execute(request);

      expect(result.hasError).toBeFalse();
      expect(result.data).toEqual(mockResponse);
      expect(mockPort.getTransactionById).toHaveBeenCalledWith(request);
    });

    it('should return validation error when transactionId is empty', async () => {
      const request: GetTransactionByIdQueryRequestDto = {
        transactionId: '',
      };

      const result = await handler.execute(request);

      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toBe(
        "Validation failed for field 'transactionId': Transaction ID is required"
      );
      expect(mockPort.getTransactionById).not.toHaveBeenCalled();
    });

    it('should return validation error when transactionId is null', async () => {
      const request: GetTransactionByIdQueryRequestDto = {
        transactionId: null as any,
      };

      const result = await handler.execute(request);

      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toBe(
        "Validation failed for field 'transactionId': Transaction ID is required"
      );
      expect(mockPort.getTransactionById).not.toHaveBeenCalled();
    });

    it('should return validation error when transactionId is undefined', async () => {
      const request: GetTransactionByIdQueryRequestDto = {
        transactionId: undefined as any,
      };

      const result = await handler.execute(request);

      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBeInstanceOf(ValidationError);
      expect(result.errors[0].message).toBe(
        "Validation failed for field 'transactionId': Transaction ID is required"
      );
      expect(mockPort.getTransactionById).not.toHaveBeenCalled();
    });

    it('should return errors when port returns errors', async () => {
      const request: GetTransactionByIdQueryRequestDto = {
        transactionId: 'transaction-123',
      };

      const mockError = new ValidationError('test', 'Port error');
      mockPort.getTransactionById.and.returnValue(Promise.resolve(Either.errors([mockError])));

      const result = await handler.execute(request);

      expect(result.hasError).toBeTrue();
      expect(result.errors).toEqual([mockError]);
      expect(mockPort.getTransactionById).toHaveBeenCalledWith(request);
    });

    it('should return unexpected error when port throws', async () => {
      const request: GetTransactionByIdQueryRequestDto = {
        transactionId: 'transaction-123',
      };

      const error = new Error('Port error');
      mockPort.getTransactionById.and.throwError(error);

      const result = await handler.execute(request);

      expect(result.hasError).toBeTrue();
      expect(result.errors[0]).toBeInstanceOf(UnexpectedError);
      expect(result.errors[0].message).toContain('get transaction by id');
    });
  });
});
