import { MarkTransactionLateUseCase } from './mark-transaction-late-use-case';
import { IMarkTransactionLatePort } from '../../../ports/transaction/mark-transaction-late.port';
import { MarkTransactionLateRequestDto } from '../../../dtos/transaction/request/mark-transaction-late-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { TransactionRequestMapper } from '../../../mappers/transaction/transaction-request-mapper/transaction-request-mapper';

describe('MarkTransactionLateUseCase', () => {
  let useCase: MarkTransactionLateUseCase;
  let mockMarkTransactionLatePort: jasmine.SpyObj<IMarkTransactionLatePort>;

  beforeEach(() => {
    mockMarkTransactionLatePort = jasmine.createSpyObj('IMarkTransactionLatePort', [
      'markTransactionLate',
    ]);
    useCase = new MarkTransactionLateUseCase(mockMarkTransactionLatePort);
  });

  describe('execute', () => {
    it('should mark transaction as late successfully via HTTP', async () => {
      const validRequest: MarkTransactionLateRequestDto = {
        transactionId: 'transaction-123',
        lateDate: '2024-01-15T10:00:00Z',
      };

      spyOn(TransactionRequestMapper, 'validateMarkLateRequest').and.returnValue(
        Either.success(true)
      );
      spyOn(TransactionRequestMapper, 'normalizeMarkLateRequest').and.returnValue(validRequest);
      const mockBackendResponse = {
        transactionId: 'transaction-123',
        lateDate: '2024-01-15T10:00:00Z',
      };
      mockMarkTransactionLatePort.markTransactionLate.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(TransactionRequestMapper.validateMarkLateRequest).toHaveBeenCalledWith(validRequest);
      expect(TransactionRequestMapper.normalizeMarkLateRequest).toHaveBeenCalledWith(validRequest);
      expect(mockMarkTransactionLatePort.markTransactionLate).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when request data is invalid', async () => {
      const invalidRequest: MarkTransactionLateRequestDto = {
        transactionId: '',
        lateDate: '2024-01-15T10:00:00Z',
      };

      const validationError = new ValidationError('transactionId', 'Transaction ID is required');
      spyOn(TransactionRequestMapper, 'validateMarkLateRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockMarkTransactionLatePort.markTransactionLate).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: MarkTransactionLateRequestDto = {
        transactionId: 'transaction-123',
        lateDate: '2024-01-15T10:00:00Z',
      };

      spyOn(TransactionRequestMapper, 'validateMarkLateRequest').and.returnValue(
        Either.success(true)
      );
      spyOn(TransactionRequestMapper, 'normalizeMarkLateRequest').and.returnValue(validRequest);
      const networkError = new NetworkError('markTransactionLate', 'Connection failed');
      mockMarkTransactionLatePort.markTransactionLate.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: MarkTransactionLateRequestDto = {
        transactionId: 'transaction-123',
        lateDate: '2024-01-15T10:00:00Z',
      };

      spyOn(TransactionRequestMapper, 'validateMarkLateRequest').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
