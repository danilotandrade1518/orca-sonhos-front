import { GetAccountByIdQueryHandler } from './get-account-by-id-query-handler';
import { IGetAccountByIdPort } from '../../../ports/account/get-account-by-id.port';
import { GetAccountByIdQueryRequestDto } from '../../../dtos/account/request/get-account-by-id-query-request.dto';
import { GetAccountByIdQueryResponseDto } from '../../../dtos/account/response/get-account-by-id-query-response.dto';
import { Either } from '../../../../shared/core/either/either';
import { ApplicationError } from '../../../errors/application-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { AccountType } from '@models/shared/enums/account-type';

describe('GetAccountByIdQueryHandler', () => {
  let queryHandler: GetAccountByIdQueryHandler;
  let mockGetAccountByIdPort: jasmine.SpyObj<IGetAccountByIdPort>;

  beforeEach(() => {
    mockGetAccountByIdPort = jasmine.createSpyObj('IGetAccountByIdPort', ['getAccountById']);
    queryHandler = new GetAccountByIdQueryHandler(mockGetAccountByIdPort);
  });

  describe('execute', () => {
    it('should get account by id successfully via HTTP', async () => {
      const validRequest: GetAccountByIdQueryRequestDto = {
        accountId: 'account-123',
        userId: 'user-123',
      };

      const mockResponse: GetAccountByIdQueryResponseDto = {
        account: {
          id: 'account-123',
          name: 'Checking Account',
          type: AccountType.CHECKING,
          balance: {
            valueInCents: 100050,
            valueInMonetary: 1000.5,
            formatted: 'R$ 1.000,50',
          },
          budgetId: 'budget-123',
          description: 'Main checking account',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          transactionCount: 15,
          lastTransactionDate: '2024-12-19T10:30:00Z',
        },
      };

      mockGetAccountByIdPort.getAccountById.and.returnValue(
        Promise.resolve(Either.success(mockResponse))
      );

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockResponse);
      expect(mockGetAccountByIdPort.getAccountById).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when accountId is empty', async () => {
      const invalidRequest: GetAccountByIdQueryRequestDto = {
        accountId: '',
        userId: 'user-123',
      };

      const result = await queryHandler.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Account ID is required');
      expect(mockGetAccountByIdPort.getAccountById).not.toHaveBeenCalled();
    });

    it('should return validation error when accountId is not provided', async () => {
      const invalidRequest: GetAccountByIdQueryRequestDto = {
        accountId: undefined as any,
        userId: 'user-123',
      };

      const result = await queryHandler.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Account ID is required');
      expect(mockGetAccountByIdPort.getAccountById).not.toHaveBeenCalled();
    });

    it('should return validation error when userId is empty', async () => {
      const invalidRequest: GetAccountByIdQueryRequestDto = {
        accountId: 'account-123',
        userId: '',
      };

      const result = await queryHandler.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('User ID is required');
      expect(mockGetAccountByIdPort.getAccountById).not.toHaveBeenCalled();
    });

    it('should return validation error when userId is not provided', async () => {
      const invalidRequest: GetAccountByIdQueryRequestDto = {
        accountId: 'account-123',
        userId: undefined as any,
      };

      const result = await queryHandler.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('User ID is required');
      expect(mockGetAccountByIdPort.getAccountById).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: GetAccountByIdQueryRequestDto = {
        accountId: 'account-123',
        userId: 'user-123',
      };

      const networkError = new NetworkError('getAccountById', 'Connection failed');
      mockGetAccountByIdPort.getAccountById.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: GetAccountByIdQueryRequestDto = {
        accountId: 'account-123',
        userId: 'user-123',
      };

      mockGetAccountByIdPort.getAccountById.and.throwError('Unexpected port error');

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });

    it('should return account without lastTransactionDate when not available', async () => {
      const validRequest: GetAccountByIdQueryRequestDto = {
        accountId: 'account-123',
        userId: 'user-123',
      };

      const mockResponse: GetAccountByIdQueryResponseDto = {
        account: {
          id: 'account-123',
          name: 'New Account',
          type: AccountType.SAVINGS,
          balance: {
            valueInCents: 0,
            valueInMonetary: 0.0,
            formatted: 'R$ 0,00',
          },
          budgetId: 'budget-123',
          description: 'Newly created account',
          isActive: true,
          createdAt: '2024-12-19T00:00:00Z',
          transactionCount: 0,
          lastTransactionDate: undefined,
        },
      };

      mockGetAccountByIdPort.getAccountById.and.returnValue(
        Promise.resolve(Either.success(mockResponse))
      );

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockResponse);
      expect(result.data!.account.lastTransactionDate).toBeUndefined();
    });
  });
});
