import { DeleteTransactionUseCase } from './delete-transaction-use-case';
import { IDeleteTransactionPort } from '../../../ports/transaction/delete-transaction.port';
import { DeleteTransactionRequestDto } from '../../../dtos/transaction/request/delete-transaction-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { TransactionRequestMapper } from '../../../mappers/transaction/transaction-request-mapper/transaction-request-mapper';

describe('DeleteTransactionUseCase', () => {
  let useCase: DeleteTransactionUseCase;
  let mockDeleteTransactionPort: jasmine.SpyObj<IDeleteTransactionPort>;

  beforeEach(() => {
    mockDeleteTransactionPort = jasmine.createSpyObj('IDeleteTransactionPort', [
      'deleteTransaction',
    ]);
    useCase = new DeleteTransactionUseCase(mockDeleteTransactionPort);
  });

  describe('execute', () => {
    it('should delete transaction successfully via HTTP', async () => {
      const validRequest: DeleteTransactionRequestDto = {
        id: 'transaction-123',
        userId: 'user-123',
      };

      spyOn(TransactionRequestMapper, 'validateDeleteRequest').and.returnValue(
        Either.success(true)
      );
      spyOn(TransactionRequestMapper, 'normalizeDeleteRequest').and.returnValue(validRequest);
      const mockBackendResponse = { id: 'transaction-123' };
      mockDeleteTransactionPort.deleteTransaction.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(TransactionRequestMapper.validateDeleteRequest).toHaveBeenCalledWith(validRequest);
      expect(TransactionRequestMapper.normalizeDeleteRequest).toHaveBeenCalledWith(validRequest);
      expect(mockDeleteTransactionPort.deleteTransaction).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when request data is invalid', async () => {
      const invalidRequest: DeleteTransactionRequestDto = {
        id: '',
        userId: '',
      };

      const validationError = new ValidationError('id', 'Transaction ID is required');
      spyOn(TransactionRequestMapper, 'validateDeleteRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockDeleteTransactionPort.deleteTransaction).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: DeleteTransactionRequestDto = {
        id: 'transaction-123',
        userId: 'user-123',
      };

      spyOn(TransactionRequestMapper, 'validateDeleteRequest').and.returnValue(
        Either.success(true)
      );
      spyOn(TransactionRequestMapper, 'normalizeDeleteRequest').and.returnValue(validRequest);
      const networkError = new NetworkError('deleteTransaction', 'Connection failed');
      mockDeleteTransactionPort.deleteTransaction.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: DeleteTransactionRequestDto = {
        id: 'transaction-123',
        userId: 'user-123',
      };

      spyOn(TransactionRequestMapper, 'validateDeleteRequest').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
