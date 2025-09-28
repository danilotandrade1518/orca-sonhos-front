import { ListAccountsQueryHandler } from './list-accounts-query-handler';
import { IListAccountsPort } from '../../../ports/account/list-accounts.port';
import { ListAccountsQueryRequestDto } from '../../../dtos/account/request/list-accounts-query-request.dto';
import { ListAccountsQueryResponseDto } from '../../../dtos/account/response/list-accounts-query-response.dto';
import { Either } from '../../../../shared/core/either/either';
import { ApplicationError } from '../../../errors/application-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { AccountType } from '@models/shared/enums/account-type';

describe('ListAccountsQueryHandler', () => {
  let queryHandler: ListAccountsQueryHandler;
  let mockListAccountsPort: jasmine.SpyObj<IListAccountsPort>;

  beforeEach(() => {
    mockListAccountsPort = jasmine.createSpyObj('IListAccountsPort', ['listAccounts']);
    queryHandler = new ListAccountsQueryHandler(mockListAccountsPort);
  });

  describe('execute', () => {
    it('should list accounts successfully via HTTP', async () => {
      const validRequest: ListAccountsQueryRequestDto = {
        budgetId: 'budget-123',
        userId: 'user-123',
      };

      const mockResponse: ListAccountsQueryResponseDto = {
        accounts: [
          {
            id: 'account-1',
            name: 'Checking Account',
            type: AccountType.CHECKING,
            balance: {
              valueInCents: 100050,
              valueInMonetary: 1000.5,
              formatted: 'R$ 1.000,50',
            },
            description: 'Main checking account',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
          },
          {
            id: 'account-2',
            name: 'Savings Account',
            type: AccountType.SAVINGS,
            balance: {
              valueInCents: 500000,
              valueInMonetary: 5000.0,
              formatted: 'R$ 5.000,00',
            },
            description: 'Emergency fund',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
          },
        ],
      };

      mockListAccountsPort.listAccounts.and.returnValue(
        Promise.resolve(Either.success(mockResponse))
      );

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockResponse);
      expect(mockListAccountsPort.listAccounts).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when budgetId is empty', async () => {
      const invalidRequest: ListAccountsQueryRequestDto = {
        budgetId: '',
        userId: 'user-123',
      };

      const result = await queryHandler.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Budget ID is required');
      expect(mockListAccountsPort.listAccounts).not.toHaveBeenCalled();
    });

    it('should return validation error when budgetId is not provided', async () => {
      const invalidRequest: ListAccountsQueryRequestDto = {
        budgetId: undefined as any,
        userId: 'user-123',
      };

      const result = await queryHandler.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Budget ID is required');
      expect(mockListAccountsPort.listAccounts).not.toHaveBeenCalled();
    });

    it('should return validation error when userId is empty', async () => {
      const invalidRequest: ListAccountsQueryRequestDto = {
        budgetId: 'budget-123',
        userId: '',
      };

      const result = await queryHandler.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('User ID is required');
      expect(mockListAccountsPort.listAccounts).not.toHaveBeenCalled();
    });

    it('should return validation error when userId is not provided', async () => {
      const invalidRequest: ListAccountsQueryRequestDto = {
        budgetId: 'budget-123',
        userId: undefined as any,
      };

      const result = await queryHandler.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('User ID is required');
      expect(mockListAccountsPort.listAccounts).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: ListAccountsQueryRequestDto = {
        budgetId: 'budget-123',
        userId: 'user-123',
      };

      const networkError = new NetworkError('listAccounts', 'Connection failed');
      mockListAccountsPort.listAccounts.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: ListAccountsQueryRequestDto = {
        budgetId: 'budget-123',
        userId: 'user-123',
      };

      mockListAccountsPort.listAccounts.and.throwError('Unexpected port error');

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });

    it('should return empty accounts array when no accounts found', async () => {
      const validRequest: ListAccountsQueryRequestDto = {
        budgetId: 'budget-123',
        userId: 'user-123',
      };

      const mockResponse: ListAccountsQueryResponseDto = {
        accounts: [],
      };

      mockListAccountsPort.listAccounts.and.returnValue(
        Promise.resolve(Either.success(mockResponse))
      );

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockResponse);
      expect(result.data!.accounts).toEqual([]);
    });
  });
});
