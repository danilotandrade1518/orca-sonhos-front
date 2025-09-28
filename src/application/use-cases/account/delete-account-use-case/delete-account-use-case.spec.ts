import { DeleteAccountUseCase } from './delete-account-use-case';
import { IDeleteAccountPort } from '../../../ports/account/delete-account.port';
import { DeleteAccountRequestDto } from '../../../dtos/account/request/delete-account-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { AccountRequestMapper } from '../../../mappers/account/account-request-mapper/account-request-mapper';

describe('DeleteAccountUseCase', () => {
  let useCase: DeleteAccountUseCase;
  let mockDeleteAccountPort: jasmine.SpyObj<IDeleteAccountPort>;

  beforeEach(() => {
    mockDeleteAccountPort = jasmine.createSpyObj('IDeleteAccountPort', ['deleteAccount']);
    useCase = new DeleteAccountUseCase(mockDeleteAccountPort);
  });

  describe('execute', () => {
    it('should delete account successfully via HTTP', async () => {
      const validRequest: DeleteAccountRequestDto = {
        id: 'account-123',
        userId: 'user-123',
      };

      const mockAccount = {
        id: 'account-123',
        userId: 'user-123',
        name: 'Test Account',
        type: 'CHECKING',
        budgetId: 'budget-123',
        balanceInCents: 100000,
        description: 'Test account description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      spyOn(AccountRequestMapper, 'validateDeleteRequest').and.returnValue(
        Either.success(true)
      );
      const mockBackendResponse = { id: 'account-123' };
      mockDeleteAccountPort.deleteAccount.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(AccountRequestMapper.validateDeleteRequest).toHaveBeenCalledWith(validRequest);
      expect(mockDeleteAccountPort.deleteAccount).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when account data is invalid', async () => {
      const invalidRequest: DeleteAccountRequestDto = {
        id: '',
        userId: '',
      };

      const validationError = new ValidationError('id', 'ID is required');
      spyOn(AccountRequestMapper, 'validateDeleteRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockDeleteAccountPort.deleteAccount).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: DeleteAccountRequestDto = {
        id: 'account-123',
        userId: 'user-123',
      };

      const mockAccount = {
        id: 'account-123',
        userId: 'user-123',
        name: 'Test Account',
        type: 'CHECKING',
        budgetId: 'budget-123',
        balanceInCents: 100000,
        description: 'Test account description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      spyOn(AccountRequestMapper, 'validateDeleteRequest').and.returnValue(
        Either.success(true)
      );
      const networkError = new NetworkError('deleteAccount', 'Connection failed');
      mockDeleteAccountPort.deleteAccount.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: DeleteAccountRequestDto = {
        id: 'account-123',
        userId: 'user-123',
      };

      spyOn(AccountRequestMapper, 'validateDeleteRequest').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
