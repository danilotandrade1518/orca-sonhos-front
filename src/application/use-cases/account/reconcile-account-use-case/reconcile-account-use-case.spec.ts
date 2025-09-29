import { ReconcileAccountUseCase } from './reconcile-account-use-case';
import { IReconcileAccountPort } from '../../../ports/account/reconcile-account.port';
import { ReconcileAccountRequestDto } from '../../../dtos/account/request/reconcile-account-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { AccountRequestMapper } from '../../../mappers/account/account-request-mapper/account-request-mapper';

describe('ReconcileAccountUseCase', () => {
  let useCase: ReconcileAccountUseCase;
  let mockReconcileAccountPort: jasmine.SpyObj<IReconcileAccountPort>;

  beforeEach(() => {
    mockReconcileAccountPort = jasmine.createSpyObj('IReconcileAccountPort', ['reconcileAccount']);
    useCase = new ReconcileAccountUseCase(mockReconcileAccountPort);
  });

  describe('execute', () => {
    it('should reconcile account successfully via HTTP', async () => {
      const validRequest: ReconcileAccountRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-123',
        accountId: 'account-123',
        realBalance: 1500,
      };

      const mockAccount = {
        id: 'account-123',
        userId: 'user-123',
        name: 'Test Account',
        type: 'CHECKING',
        budgetId: 'budget-123',
        balanceInCents: 150000,
        description: 'Test account description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      spyOn(AccountRequestMapper, 'validateReconcileRequest').and.returnValue(
        Either.success(true)
      );
      const mockBackendResponse = { accountId: 'account-123', reconciledBalance: 1500 };
      mockReconcileAccountPort.reconcileAccount.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(AccountRequestMapper.validateReconcileRequest).toHaveBeenCalledWith(validRequest);
      expect(mockReconcileAccountPort.reconcileAccount).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when account data is invalid', async () => {
      const invalidRequest: ReconcileAccountRequestDto = {
        userId: '',
        budgetId: '',
        accountId: '',
        realBalance: -100,
      };

      const validationError = new ValidationError('accountId', 'Account ID is required');
      spyOn(AccountRequestMapper, 'validateReconcileRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockReconcileAccountPort.reconcileAccount).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: ReconcileAccountRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-123',
        accountId: 'account-123',
        realBalance: 1500,
      };

      const mockAccount = {
        id: 'account-123',
        userId: 'user-123',
        name: 'Test Account',
        type: 'CHECKING',
        budgetId: 'budget-123',
        balanceInCents: 150000,
        description: 'Test account description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      spyOn(AccountRequestMapper, 'validateReconcileRequest').and.returnValue(
        Either.success(true)
      );
      const networkError = new NetworkError('reconcileAccount', 'Connection failed');
      mockReconcileAccountPort.reconcileAccount.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: ReconcileAccountRequestDto = {
        userId: 'user-123',
        budgetId: 'budget-123',
        accountId: 'account-123',
        realBalance: 1500,
      };

      spyOn(AccountRequestMapper, 'validateReconcileRequest').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
