import { UpdateAccountUseCase } from './update-account-use-case';
import { IUpdateAccountPort } from '../../../ports/account/update-account.port';
import { UpdateAccountRequestDto } from '../../../dtos/account/request/update-account-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { AccountRequestMapper } from '../../../mappers/account/account-request-mapper/account-request-mapper';

describe('UpdateAccountUseCase', () => {
  let useCase: UpdateAccountUseCase;
  let mockUpdateAccountPort: jasmine.SpyObj<IUpdateAccountPort>;

  beforeEach(() => {
    mockUpdateAccountPort = jasmine.createSpyObj('IUpdateAccountPort', ['updateAccount']);
    useCase = new UpdateAccountUseCase(mockUpdateAccountPort);
  });

  describe('execute', () => {
    it('should update account successfully via HTTP', async () => {
      const validRequest: UpdateAccountRequestDto = {
        id: 'account-123',
        userId: 'user-123',
        name: 'Updated Account',
        description: 'Updated description',
        initialBalance: 2000,
      };

      const mockAccount = {
        id: 'account-123',
        userId: 'user-123',
        name: 'Updated Account',
        type: 'CHECKING',
        budgetId: 'budget-123',
        balanceInCents: 200000,
        description: 'Updated description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      spyOn(AccountRequestMapper, 'validateUpdateRequest').and.returnValue(
        Either.success(true)
      );
      const mockBackendResponse = { id: 'account-123' };
      mockUpdateAccountPort.updateAccount.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(AccountRequestMapper.validateUpdateRequest).toHaveBeenCalledWith(validRequest);
      expect(mockUpdateAccountPort.updateAccount).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when account data is invalid', async () => {
      const invalidRequest: UpdateAccountRequestDto = {
        id: '',
        userId: '',
        name: '',
        description: '',
        initialBalance: -100,
      };

      const validationError = new ValidationError('id', 'ID is required');
      spyOn(AccountRequestMapper, 'validateUpdateRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockUpdateAccountPort.updateAccount).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: UpdateAccountRequestDto = {
        id: 'account-123',
        userId: 'user-123',
        name: 'Updated Account',
        description: 'Updated description',
        initialBalance: 2000,
      };

      const mockAccount = {
        id: 'account-123',
        userId: 'user-123',
        name: 'Updated Account',
        type: 'CHECKING',
        budgetId: 'budget-123',
        balanceInCents: 200000,
        description: 'Updated description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      spyOn(AccountRequestMapper, 'validateUpdateRequest').and.returnValue(
        Either.success(true)
      );
      const networkError = new NetworkError('updateAccount', 'Connection failed');
      mockUpdateAccountPort.updateAccount.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: UpdateAccountRequestDto = {
        id: 'account-123',
        userId: 'user-123',
        name: 'Updated Account',
        description: 'Updated description',
        initialBalance: 2000,
      };

      spyOn(AccountRequestMapper, 'validateUpdateRequest').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
