import { TransferBetweenAccountsUseCase } from './transfer-between-accounts-use-case';
import { ITransferBetweenAccountsPort } from '../../../ports/account/transfer-between-accounts.port';
import { TransferBetweenAccountsRequestDto } from '../../../dtos/account/request/transfer-between-accounts-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { AccountRequestMapper } from '../../../mappers/account/account-request-mapper/account-request-mapper';

describe('TransferBetweenAccountsUseCase', () => {
  let useCase: TransferBetweenAccountsUseCase;
  let mockTransferBetweenAccountsPort: jasmine.SpyObj<ITransferBetweenAccountsPort>;

  beforeEach(() => {
    mockTransferBetweenAccountsPort = jasmine.createSpyObj('ITransferBetweenAccountsPort', ['transferBetweenAccounts']);
    useCase = new TransferBetweenAccountsUseCase(mockTransferBetweenAccountsPort);
  });

  describe('execute', () => {
    it('should transfer between accounts successfully via HTTP', async () => {
      const validRequest: TransferBetweenAccountsRequestDto = {
        userId: 'user-123',
        fromAccountId: 'account-123',
        toAccountId: 'account-456',
        amount: 500,
        description: 'Transfer between accounts',
      };

      const mockAccount = {
        id: 'account-123',
        userId: 'user-123',
        name: 'Test Account',
        type: 'CHECKING',
        budgetId: 'budget-123',
        balanceInCents: 50000,
        description: 'Test account description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      spyOn(AccountRequestMapper, 'validateTransferRequest').and.returnValue(
        Either.success(true)
      );
      const mockBackendResponse = { 
        fromAccountId: 'account-123', 
        toAccountId: 'account-456', 
        amount: 500, 
        transferId: 'transfer-123' 
      };
      mockTransferBetweenAccountsPort.transferBetweenAccounts.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(AccountRequestMapper.validateTransferRequest).toHaveBeenCalledWith(validRequest);
      expect(mockTransferBetweenAccountsPort.transferBetweenAccounts).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when transfer data is invalid', async () => {
      const invalidRequest: TransferBetweenAccountsRequestDto = {
        userId: '',
        fromAccountId: '',
        toAccountId: '',
        amount: -100,
        description: '',
      };

      const validationError = new ValidationError('fromAccountId', 'From Account ID is required');
      spyOn(AccountRequestMapper, 'validateTransferRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockTransferBetweenAccountsPort.transferBetweenAccounts).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: TransferBetweenAccountsRequestDto = {
        userId: 'user-123',
        fromAccountId: 'account-123',
        toAccountId: 'account-456',
        amount: 500,
        description: 'Transfer between accounts',
      };

      const mockAccount = {
        id: 'account-123',
        userId: 'user-123',
        name: 'Test Account',
        type: 'CHECKING',
        budgetId: 'budget-123',
        balanceInCents: 50000,
        description: 'Test account description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      spyOn(AccountRequestMapper, 'validateTransferRequest').and.returnValue(
        Either.success(true)
      );
      const networkError = new NetworkError('transferBetweenAccounts', 'Connection failed');
      mockTransferBetweenAccountsPort.transferBetweenAccounts.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: TransferBetweenAccountsRequestDto = {
        userId: 'user-123',
        fromAccountId: 'account-123',
        toAccountId: 'account-456',
        amount: 500,
        description: 'Transfer between accounts',
      };

      spyOn(AccountRequestMapper, 'validateTransferRequest').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
