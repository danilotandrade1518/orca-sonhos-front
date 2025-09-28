import { ListBudgetsQueryHandler } from './list-budgets-query-handler';
import { IListBudgetsPort } from '../../ports/list-budgets.port';
import { ListBudgetsQueryRequestDto } from '../../dtos/request/list-budgets-query-request.dto';
import { ListBudgetsQueryResponseDto } from '../../dtos/response/list-budgets-query-response.dto';
import { Either } from '../../../shared/core/either/either';
import { ApplicationError } from '../../errors/application-error';
import { NetworkError } from '../../errors/network-error';
import { UnexpectedError } from '../../errors/unexpected-error';

describe('ListBudgetsQueryHandler', () => {
  let queryHandler: ListBudgetsQueryHandler;
  let mockListBudgetsPort: jasmine.SpyObj<IListBudgetsPort>;

  beforeEach(() => {
    mockListBudgetsPort = jasmine.createSpyObj('IListBudgetsPort', ['listBudgets']);
    queryHandler = new ListBudgetsQueryHandler(mockListBudgetsPort);
  });

  describe('execute', () => {
    it('should list budgets successfully via HTTP', async () => {
      const validRequest: ListBudgetsQueryRequestDto = {
        userId: 'user-123',
      };

      const mockBudgets: ListBudgetsQueryResponseDto[] = [
        {
          id: 'budget-1',
          name: 'Personal Budget',
          type: 'PERSONAL',
          participantsCount: 1,
        },
        {
          id: 'budget-2',
          name: 'Family Budget',
          type: 'FAMILY',
          participantsCount: 3,
        },
      ];

      mockListBudgetsPort.listBudgets.and.returnValue(Promise.resolve(Either.success(mockBudgets)));

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBudgets);
      expect(mockListBudgetsPort.listBudgets).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when userId is empty', async () => {
      const invalidRequest: ListBudgetsQueryRequestDto = {
        userId: '',
      };

      const result = await queryHandler.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('User ID is required');
      expect(mockListBudgetsPort.listBudgets).not.toHaveBeenCalled();
    });

    it('should return validation error when userId is not provided', async () => {
      const invalidRequest: ListBudgetsQueryRequestDto = {
        userId: undefined as any,
      };

      const result = await queryHandler.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('User ID is required');
      expect(mockListBudgetsPort.listBudgets).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: ListBudgetsQueryRequestDto = {
        userId: 'user-123',
      };

      const networkError = new NetworkError('listBudgets', 'Connection failed');
      mockListBudgetsPort.listBudgets.and.returnValue(Promise.resolve(Either.error(networkError)));

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: ListBudgetsQueryRequestDto = {
        userId: 'user-123',
      };

      mockListBudgetsPort.listBudgets.and.throwError('Unexpected port error');

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });

    it('should return empty array when no budgets found', async () => {
      const validRequest: ListBudgetsQueryRequestDto = {
        userId: 'user-123',
      };

      mockListBudgetsPort.listBudgets.and.returnValue(Promise.resolve(Either.success([])));

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual([]);
    });
  });
});
