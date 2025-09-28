import { CreateAccountUseCase } from './create-account-use-case';
import { ICreateAccountPort } from '../../../ports/account/create-account.port';
import { CreateAccountRequestDto } from '../../../dtos/account/request/create-account-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { AccountRequestMapper } from '../../../mappers/account/account-request-mapper/account-request-mapper';
import { AccountType } from '@models/shared/enums/account-type';

describe('CreateAccountUseCase', () => {
  let useCase: CreateAccountUseCase;
  let mockCreateAccountPort: jasmine.SpyObj<ICreateAccountPort>;

  beforeEach(() => {
    mockCreateAccountPort = jasmine.createSpyObj('ICreateAccountPort', ['createAccount']);
    useCase = new CreateAccountUseCase(mockCreateAccountPort);
  });

  describe('execute', () => {
    it('should create account successfully via HTTP', async () => {
      const validRequest: CreateAccountRequestDto = {
        userId: 'user-123',
        name: 'Test Account',
        type: AccountType.CHECKING,
        budgetId: 'budget-123',
        initialBalance: 1000,
        description: 'Test account description',
      };

      const mockAccount = {
        id: 'account-123',
        userId: 'user-123',
        name: 'Test Account',
        type: AccountType.CHECKING,
        budgetId: 'budget-123',
        balanceInCents: 100000,
        description: 'Test account description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      spyOn(AccountRequestMapper, 'fromCreateRequestToAccount').and.returnValue(
        Either.success(mockAccount as any)
      );
      const mockBackendResponse = { id: 'account-123' };
      mockCreateAccountPort.createAccount.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(AccountRequestMapper.fromCreateRequestToAccount).toHaveBeenCalledWith(validRequest);
      expect(mockCreateAccountPort.createAccount).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when account data is invalid', async () => {
      const invalidRequest: CreateAccountRequestDto = {
        userId: '',
        name: '',
        type: AccountType.CHECKING,
        budgetId: '',
        initialBalance: -100,
        description: '',
      };

      const validationError = new ValidationError('name', 'Name is required');
      spyOn(AccountRequestMapper, 'fromCreateRequestToAccount').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockCreateAccountPort.createAccount).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: CreateAccountRequestDto = {
        userId: 'user-123',
        name: 'Test Account',
        type: AccountType.CHECKING,
        budgetId: 'budget-123',
        initialBalance: 1000,
        description: 'Test account description',
      };

      const mockAccount = {
        id: 'account-123',
        userId: 'user-123',
        name: 'Test Account',
        type: AccountType.CHECKING,
        budgetId: 'budget-123',
        balanceInCents: 100000,
        description: 'Test account description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      spyOn(AccountRequestMapper, 'fromCreateRequestToAccount').and.returnValue(
        Either.success(mockAccount as any)
      );
      const networkError = new NetworkError('createAccount', 'Connection failed');
      mockCreateAccountPort.createAccount.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: CreateAccountRequestDto = {
        userId: 'user-123',
        name: 'Test Account',
        type: AccountType.CHECKING,
        budgetId: 'budget-123',
        initialBalance: 1000,
        description: 'Test account description',
      };

      spyOn(AccountRequestMapper, 'fromCreateRequestToAccount').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
