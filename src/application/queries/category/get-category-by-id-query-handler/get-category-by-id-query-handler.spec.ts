import { GetCategoryByIdQueryHandler } from './get-category-by-id-query-handler';
import { IGetCategoryByIdPort } from '../../../ports/category/get-category-by-id.port';
import { GetCategoryByIdQueryRequestDto } from '../../../dtos/category/request/get-category-by-id-query-request.dto';
import { GetCategoryByIdQueryResponseDto } from '../../../dtos/category/response/get-category-by-id-query-response.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { CategoryType } from '@models/shared/enums/category-type';

describe('GetCategoryByIdQueryHandler', () => {
  let queryHandler: GetCategoryByIdQueryHandler;
  let mockGetCategoryByIdPort: jasmine.SpyObj<IGetCategoryByIdPort>;

  beforeEach(() => {
    mockGetCategoryByIdPort = jasmine.createSpyObj('IGetCategoryByIdPort', ['getCategoryById']);
    queryHandler = new GetCategoryByIdQueryHandler(mockGetCategoryByIdPort);
  });

  describe('execute', () => {
    it('should get category by id successfully via HTTP', async () => {
      const validRequest: GetCategoryByIdQueryRequestDto = {
        categoryId: 'category-123',
      };

      const mockResponse: GetCategoryByIdQueryResponseDto = {
        category: {
          id: 'category-123',
          name: 'Salary',
          type: CategoryType.INCOME,
          budgetId: 'budget-123',
          description: 'Monthly salary',
          color: '#00FF00',
          icon: 'money',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          transactionCount: 5,
          totalAmount: {
            valueInCents: 500000,
            valueInMonetary: 5000.0,
            formatted: 'R$ 5.000,00',
          },
          lastTransactionDate: '2024-01-15T10:30:00Z',
        },
      };

      mockGetCategoryByIdPort.getCategoryById.and.returnValue(
        Promise.resolve(Either.success(mockResponse))
      );

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockResponse);
      expect(mockGetCategoryByIdPort.getCategoryById).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when categoryId is empty', async () => {
      const invalidRequest: GetCategoryByIdQueryRequestDto = {
        categoryId: '',
      };

      const result = await queryHandler.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Category ID is required');
      expect(mockGetCategoryByIdPort.getCategoryById).not.toHaveBeenCalled();
    });

    it('should return validation error when categoryId is not provided', async () => {
      const invalidRequest = {} as GetCategoryByIdQueryRequestDto;

      const result = await queryHandler.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Category ID is required');
      expect(mockGetCategoryByIdPort.getCategoryById).not.toHaveBeenCalled();
    });

    it('should return validation error when categoryId is only whitespace', async () => {
      const invalidRequest: GetCategoryByIdQueryRequestDto = {
        categoryId: '   ',
      };

      const result = await queryHandler.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Category ID is required');
      expect(mockGetCategoryByIdPort.getCategoryById).not.toHaveBeenCalled();
    });

    it('should return validation error when port returns error', async () => {
      const validRequest: GetCategoryByIdQueryRequestDto = {
        categoryId: 'category-123',
      };

      const validationError = new ValidationError('port', 'Port error');
      mockGetCategoryByIdPort.getCategoryById.and.returnValue(
        Promise.resolve(Either.error(validationError))
      );

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: GetCategoryByIdQueryRequestDto = {
        categoryId: 'category-123',
      };

      mockGetCategoryByIdPort.getCategoryById.and.throwError('Unexpected port error');

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });

    it('should work with category without lastTransactionDate', async () => {
      const validRequest: GetCategoryByIdQueryRequestDto = {
        categoryId: 'category-123',
      };

      const responseWithoutLastTransaction: GetCategoryByIdQueryResponseDto = {
        category: {
          id: 'category-123',
          name: 'Salary',
          type: CategoryType.INCOME,
          budgetId: 'budget-123',
          description: 'Monthly salary',
          color: '#00FF00',
          icon: 'money',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          transactionCount: 0,
          totalAmount: {
            valueInCents: 0,
            valueInMonetary: 0.0,
            formatted: 'R$ 0,00',
          },
        },
      };

      mockGetCategoryByIdPort.getCategoryById.and.returnValue(
        Promise.resolve(Either.success(responseWithoutLastTransaction))
      );

      const result = await queryHandler.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(responseWithoutLastTransaction);
      expect(mockGetCategoryByIdPort.getCategoryById).toHaveBeenCalledWith(validRequest);
    });
  });
});
