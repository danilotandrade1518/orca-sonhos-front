import { UpdateTransactionUseCase } from './update-transaction-use-case';
import { IUpdateTransactionPort } from '../../../ports/transaction/update-transaction.port';
import { UpdateTransactionRequestDto } from '../../../dtos/transaction/request/update-transaction-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { TransactionRequestMapper } from '../../../mappers/transaction/transaction-request-mapper/transaction-request-mapper';
import { TransactionType } from '@models/shared/enums/transaction-type';

describe('UpdateTransactionUseCase', () => {
  let useCase: UpdateTransactionUseCase;
  let mockUpdateTransactionPort: jasmine.SpyObj<IUpdateTransactionPort>;

  beforeEach(() => {
    mockUpdateTransactionPort = jasmine.createSpyObj('IUpdateTransactionPort', [
      'updateTransaction',
    ]);
    useCase = new UpdateTransactionUseCase(mockUpdateTransactionPort);
  });

  describe('execute', () => {
    it('should update transaction successfully via HTTP', async () => {
      const validRequest: UpdateTransactionRequestDto = {
        userId: 'user-123',
        id: 'transaction-123',
        description: 'Updated transaction',
        amount: 1500,
        type: TransactionType.INCOME,
        accountId: 'account-456',
        categoryId: 'category-456',
        transactionDate: '2024-01-16T10:00:00Z',
      };

      spyOn(TransactionRequestMapper, 'validateUpdateRequest').and.returnValue(
        Either.success(true)
      );
      spyOn(TransactionRequestMapper, 'normalizeUpdateRequest').and.returnValue(validRequest);
      const mockBackendResponse = { id: 'transaction-123' };
      mockUpdateTransactionPort.updateTransaction.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(TransactionRequestMapper.validateUpdateRequest).toHaveBeenCalledWith(validRequest);
      expect(TransactionRequestMapper.normalizeUpdateRequest).toHaveBeenCalledWith(validRequest);
      expect(mockUpdateTransactionPort.updateTransaction).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when request data is invalid', async () => {
      const invalidRequest: UpdateTransactionRequestDto = {
        userId: '',
        id: '',
        description: 'Updated transaction',
        amount: 1500,
        type: TransactionType.INCOME,
        accountId: 'account-456',
        categoryId: 'category-456',
        transactionDate: '2024-01-16T10:00:00Z',
      };

      const validationError = new ValidationError('userId', 'User ID is required');
      spyOn(TransactionRequestMapper, 'validateUpdateRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockUpdateTransactionPort.updateTransaction).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: UpdateTransactionRequestDto = {
        userId: 'user-123',
        id: 'transaction-123',
        description: 'Updated transaction',
        amount: 1500,
        type: TransactionType.INCOME,
        accountId: 'account-456',
        categoryId: 'category-456',
        transactionDate: '2024-01-16T10:00:00Z',
      };

      spyOn(TransactionRequestMapper, 'validateUpdateRequest').and.returnValue(
        Either.success(true)
      );
      spyOn(TransactionRequestMapper, 'normalizeUpdateRequest').and.returnValue(validRequest);
      const networkError = new NetworkError('updateTransaction', 'Connection failed');
      mockUpdateTransactionPort.updateTransaction.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: UpdateTransactionRequestDto = {
        userId: 'user-123',
        id: 'transaction-123',
        description: 'Updated transaction',
        amount: 1500,
        type: TransactionType.INCOME,
        accountId: 'account-456',
        categoryId: 'category-456',
        transactionDate: '2024-01-16T10:00:00Z',
      };

      spyOn(TransactionRequestMapper, 'validateUpdateRequest').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
