import { ListCategoriesQueryHandler } from './list-categories-query-handler';
import { IListCategoriesPort } from '../../../ports/category/list-categories.port';
import { ListCategoriesQueryRequestDto } from '../../../dtos/category/request/list-categories-query-request.dto';
import { ListCategoriesQueryResponseDto } from '../../../dtos/category/response/list-categories-query-response.dto';
import { Either } from '../../../../shared/core/either/either';
import { ApplicationError } from '../../../errors/application-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { CategoryType } from '@models/shared/enums/category-type';

describe('ListCategoriesQueryHandler', () => {
  let queryHandler: ListCategoriesQueryHandler;
  let mockListCategoriesPort: jasmine.SpyObj<IListCategoriesPort>;

  beforeEach(() => {
    mockListCategoriesPort = jasmine.createSpyObj('IListCategoriesPort', ['listCategories']);
    queryHandler = new ListCategoriesQueryHandler(mockListCategoriesPort);
  });

  describe('execute', () => {
    it('should list categories successfully via HTTP', async () => {
      const validRequest: ListCategoriesQueryRequestDto = {
        budgetId: 'budget-123',
        type: CategoryType.INCOME,
      };

      const mockResponse: ListCategoriesQueryResponseDto = {
        categories: [
          {
            id: 'category-1',
            name: 'Salary',
            type: CategoryType.INCOME,
            budgetId: 'budget-123',
            description: 'Monthly salary',
            color: '#4CAF50',
            icon: 'work',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            transactionCount: 12,
          },
          {
            id: 'category-2',
            name: 'Freelance',
            type: CategoryType.INCOME,
            budgetId: 'budget-123',
            description: 'Freelance work',
            color: '#2196F3',
            icon: 'code',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            transactionCount: 5,
          },
        ],
      };

      mockListCategoriesPort.listCategories.and.returnValue(
        Promise.resolve(Either.success(mockResponse))
      );

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockResponse);
      expect(mockListCategoriesPort.listCategories).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when budgetId is empty', async () => {
      const invalidRequest: ListCategoriesQueryRequestDto = {
        budgetId: '',
        type: CategoryType.INCOME,
      };

      const result = await queryHandler.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Budget ID is required');
      expect(mockListCategoriesPort.listCategories).not.toHaveBeenCalled();
    });

    it('should return validation error when budgetId is not provided', async () => {
      const invalidRequest: ListCategoriesQueryRequestDto = {
        budgetId: undefined as any,
        type: CategoryType.INCOME,
      };

      const result = await queryHandler.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Budget ID is required');
      expect(mockListCategoriesPort.listCategories).not.toHaveBeenCalled();
    });

    it('should list categories successfully without type filter', async () => {
      const validRequest: ListCategoriesQueryRequestDto = {
        budgetId: 'budget-123',
      };

      const mockResponse: ListCategoriesQueryResponseDto = {
        categories: [
          {
            id: 'category-1',
            name: 'Salary',
            type: CategoryType.INCOME,
            budgetId: 'budget-123',
            description: 'Monthly salary',
            color: '#4CAF50',
            icon: 'work',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            transactionCount: 12,
          },
          {
            id: 'category-2',
            name: 'Groceries',
            type: CategoryType.EXPENSE,
            budgetId: 'budget-123',
            description: 'Food and groceries',
            color: '#FF9800',
            icon: 'shopping_cart',
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            transactionCount: 25,
          },
        ],
      };

      mockListCategoriesPort.listCategories.and.returnValue(
        Promise.resolve(Either.success(mockResponse))
      );

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockResponse);
      expect(mockListCategoriesPort.listCategories).toHaveBeenCalledWith(validRequest);
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: ListCategoriesQueryRequestDto = {
        budgetId: 'budget-123',
        type: CategoryType.INCOME,
      };

      const networkError = new NetworkError('listCategories', 'Connection failed');
      mockListCategoriesPort.listCategories.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: ListCategoriesQueryRequestDto = {
        budgetId: 'budget-123',
        type: CategoryType.INCOME,
      };

      mockListCategoriesPort.listCategories.and.throwError('Unexpected port error');

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });

    it('should return empty categories array when no categories found', async () => {
      const validRequest: ListCategoriesQueryRequestDto = {
        budgetId: 'budget-123',
        type: CategoryType.INCOME,
      };

      const mockResponse: ListCategoriesQueryResponseDto = {
        categories: [],
      };

      mockListCategoriesPort.listCategories.and.returnValue(
        Promise.resolve(Either.success(mockResponse))
      );

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockResponse);
      expect(result.data!.categories).toEqual([]);
    });
  });
});
