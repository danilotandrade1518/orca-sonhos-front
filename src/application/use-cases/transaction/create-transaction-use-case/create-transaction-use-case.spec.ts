import { CreateTransactionUseCase } from './create-transaction-use-case';
import { ICreateTransactionPort } from '../../../ports/transaction/create-transaction.port';
import { CreateTransactionRequestDto } from '../../../dtos/transaction/request/create-transaction-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { TransactionRequestMapper } from '../../../mappers/transaction/transaction-request-mapper/transaction-request-mapper';
import { TransactionType } from '@models/shared/enums/transaction-type';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let mockCreateTransactionPort: jasmine.SpyObj<ICreateTransactionPort>;

  beforeEach(() => {
    mockCreateTransactionPort = jasmine.createSpyObj('ICreateTransactionPort', [
      'createTransaction',
    ]);
    useCase = new CreateTransactionUseCase(mockCreateTransactionPort);
  });

  describe('execute', () => {
    it('should create transaction successfully via HTTP', async () => {
      const validRequest: CreateTransactionRequestDto = {
        userId: 'user-123',
        description: 'Test transaction',
        amount: 1000,
        type: TransactionType.EXPENSE,
        accountId: 'account-123',
        categoryId: 'category-123',
        budgetId: 'budget-123',
        transactionDate: '2024-01-15T10:00:00Z',
      };

      const mockTransaction = {
        id: 'transaction-123',
        amount: 1000,
        type: TransactionType.EXPENSE,
        accountId: 'account-123',
        categoryId: 'category-123',
        description: 'Test transaction',
        executedAt: new Date('2024-01-15T10:00:00Z'),
        isRecurring: false,
        createdAt: new Date(),
      };

      spyOn(TransactionRequestMapper, 'fromCreateRequestToTransaction').and.returnValue(
        Either.success(mockTransaction as any)
      );
      const mockBackendResponse = { id: 'transaction-123' };
      mockCreateTransactionPort.createTransaction.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(TransactionRequestMapper.fromCreateRequestToTransaction).toHaveBeenCalledWith(
        validRequest
      );
      expect(mockCreateTransactionPort.createTransaction).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when transaction data is invalid', async () => {
      const invalidRequest: CreateTransactionRequestDto = {
        userId: '',
        description: '',
        amount: -100,
        type: TransactionType.EXPENSE,
        accountId: '',
        categoryId: '',
        budgetId: '',
      };

      const validationError = new ValidationError('description', 'Description is required');
      spyOn(TransactionRequestMapper, 'fromCreateRequestToTransaction').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockCreateTransactionPort.createTransaction).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: CreateTransactionRequestDto = {
        userId: 'user-123',
        description: 'Test transaction',
        amount: 1000,
        type: TransactionType.EXPENSE,
        accountId: 'account-123',
        categoryId: 'category-123',
        budgetId: 'budget-123',
        transactionDate: '2024-01-15T10:00:00Z',
      };

      const mockTransaction = {
        id: 'transaction-123',
        amount: 1000,
        type: TransactionType.EXPENSE,
        accountId: 'account-123',
        categoryId: 'category-123',
        description: 'Test transaction',
        executedAt: new Date('2024-01-15T10:00:00Z'),
        isRecurring: false,
        createdAt: new Date(),
      };

      spyOn(TransactionRequestMapper, 'fromCreateRequestToTransaction').and.returnValue(
        Either.success(mockTransaction as any)
      );
      const networkError = new NetworkError('createTransaction', 'Connection failed');
      mockCreateTransactionPort.createTransaction.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: CreateTransactionRequestDto = {
        userId: 'user-123',
        description: 'Test transaction',
        amount: 1000,
        type: TransactionType.EXPENSE,
        accountId: 'account-123',
        categoryId: 'category-123',
        budgetId: 'budget-123',
        transactionDate: '2024-01-15T10:00:00Z',
      };

      spyOn(TransactionRequestMapper, 'fromCreateRequestToTransaction').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
