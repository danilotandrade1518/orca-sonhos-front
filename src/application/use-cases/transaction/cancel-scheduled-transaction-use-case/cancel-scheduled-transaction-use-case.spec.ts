import { CancelScheduledTransactionUseCase } from './cancel-scheduled-transaction-use-case';
import { ICancelScheduledTransactionPort } from '../../../ports/transaction/cancel-scheduled-transaction.port';
import { CancelScheduledTransactionRequestDto } from '../../../dtos/transaction/request/cancel-scheduled-transaction-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { TransactionRequestMapper } from '../../../mappers/transaction/transaction-request-mapper/transaction-request-mapper';

describe('CancelScheduledTransactionUseCase', () => {
  let useCase: CancelScheduledTransactionUseCase;
  let mockCancelScheduledTransactionPort: jasmine.SpyObj<ICancelScheduledTransactionPort>;

  beforeEach(() => {
    mockCancelScheduledTransactionPort = jasmine.createSpyObj('ICancelScheduledTransactionPort', [
      'cancelScheduledTransaction',
    ]);
    useCase = new CancelScheduledTransactionUseCase(mockCancelScheduledTransactionPort);
  });

  describe('execute', () => {
    it('should cancel scheduled transaction successfully via HTTP', async () => {
      const validRequest: CancelScheduledTransactionRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-123',
        transactionId: 'transaction-123',
        cancellationReason: 'User requested cancellation',
      };

      spyOn(TransactionRequestMapper, 'validateCancelScheduledRequest').and.returnValue(
        Either.success(true)
      );
      spyOn(TransactionRequestMapper, 'normalizeCancelScheduledRequest').and.returnValue(
        validRequest
      );
      const mockBackendResponse = {
        transactionId: 'transaction-123',
        cancellationReason: 'User requested cancellation',
        cancelledAt: '2024-01-15T10:00:00Z',
      };
      mockCancelScheduledTransactionPort.cancelScheduledTransaction.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(TransactionRequestMapper.validateCancelScheduledRequest).toHaveBeenCalledWith(
        validRequest
      );
      expect(TransactionRequestMapper.normalizeCancelScheduledRequest).toHaveBeenCalledWith(
        validRequest
      );
      expect(mockCancelScheduledTransactionPort.cancelScheduledTransaction).toHaveBeenCalledWith(
        validRequest
      );
    });

    it('should return validation error when request data is invalid', async () => {
      const invalidRequest: CancelScheduledTransactionRequestDto = {
        userId: '',
        budgetId: '',
        transactionId: '',
        cancellationReason: '',
      };

      const validationError = new ValidationError('userId', 'User ID is required');
      spyOn(TransactionRequestMapper, 'validateCancelScheduledRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockCancelScheduledTransactionPort.cancelScheduledTransaction).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: CancelScheduledTransactionRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-123',
        transactionId: 'transaction-123',
        cancellationReason: 'User requested cancellation',
      };

      spyOn(TransactionRequestMapper, 'validateCancelScheduledRequest').and.returnValue(
        Either.success(true)
      );
      spyOn(TransactionRequestMapper, 'normalizeCancelScheduledRequest').and.returnValue(
        validRequest
      );
      const networkError = new NetworkError('cancelScheduledTransaction', 'Connection failed');
      mockCancelScheduledTransactionPort.cancelScheduledTransaction.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: CancelScheduledTransactionRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-123',
        transactionId: 'transaction-123',
        cancellationReason: 'User requested cancellation',
      };

      spyOn(TransactionRequestMapper, 'validateCancelScheduledRequest').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
