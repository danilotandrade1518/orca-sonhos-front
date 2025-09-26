import { ListBudgetsQueryHandler } from './list-budgets-query-handler';
import { ListBudgetsPort } from '../../../application/ports';
import { ListBudgetsRequestDto, BudgetListResponseDto } from '../../../application/dtos';
import { ApplicationError, ValidationError, NetworkError } from '../../../application/errors';
import { Either } from '../../../shared/core/either';

describe('ListBudgetsQueryHandler', () => {
  let queryHandler: ListBudgetsQueryHandler;
  let mockListBudgetsPort: jasmine.SpyObj<ListBudgetsPort>;

  beforeEach(() => {
    mockListBudgetsPort = jasmine.createSpyObj('ListBudgetsPort', ['list']);
    queryHandler = new ListBudgetsQueryHandler(mockListBudgetsPort);
  });

  describe('execute', () => {
    it('should list budgets successfully with valid data', async () => {
      // Arrange
      const request: ListBudgetsRequestDto = {
        page: 1,
        limit: 10,
        offset: 0,
        ownerId: 'user-123',
        isActive: true,
      };

      const expectedResponse: BudgetListResponseDto = {
        data: [
          {
            id: 'budget-123',
            name: 'Test Budget 1',
            limit: {
              valueInCents: 100000,
              valueInMonetary: 1000,
              formatted: 'R$ 1.000,00',
            },
            ownerId: 'user-123',
            participantIds: ['user-456'],
            description: 'Test description 1',
            isActive: true,
            createdAt: '2025-09-26T18:45:00.000Z',
          },
          {
            id: 'budget-456',
            name: 'Test Budget 2',
            limit: {
              valueInCents: 200000,
              valueInMonetary: 2000,
              formatted: 'R$ 2.000,00',
            },
            ownerId: 'user-123',
            participantIds: [],
            description: 'Test description 2',
            isActive: true,
            createdAt: '2025-09-26T18:45:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };

      mockListBudgetsPort.list.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await queryHandler.execute(request);

      // Assert
      expect(result.hasError).toBe(false);
      if (!result.hasError && result.data) {
        expect(result.data).toEqual(expectedResponse);
      }
      expect(mockListBudgetsPort.list).toHaveBeenCalledWith(request);
    });

    it('should normalize pagination parameters', async () => {
      // Arrange
      const request: ListBudgetsRequestDto = {
        page: 0, // Invalid: should be normalized to 1
        limit: 150, // Invalid: should be normalized to 100
        offset: 0,
      };

      const expectedResponse: BudgetListResponseDto = {
        data: [],
        pagination: {
          page: 1,
          limit: 100,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
        },
      };

      mockListBudgetsPort.list.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await queryHandler.execute(request);

      // Assert
      expect(result.hasError).toBe(false);
      expect(mockListBudgetsPort.list).toHaveBeenCalledWith({
        page: 1,
        limit: 100,
        offset: 0,
        ownerId: undefined,
        isActive: undefined,
      });
    });

    it('should return validation error for invalid ownerId', async () => {
      // Arrange
      const request: ListBudgetsRequestDto = {
        page: 1,
        limit: 10,
        offset: 0,
        ownerId: '', // Invalid: empty string
      };

      // Act
      const result = await queryHandler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('Owner ID must be a non-empty string');
        expect(result.errors[0].field).toBe('ownerId');
      }
      expect(mockListBudgetsPort.list).not.toHaveBeenCalled();
    });

    it('should return validation error for invalid isActive', async () => {
      // Arrange
      const request: ListBudgetsRequestDto = {
        page: 1,
        limit: 10,
        offset: 0,
        isActive: 'true' as any, // Invalid: not a boolean
      };

      // Act
      const result = await queryHandler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(ValidationError);
        expect(result.errors[0].message).toBe('isActive must be a boolean');
        expect(result.errors[0].field).toBe('isActive');
      }
      expect(mockListBudgetsPort.list).not.toHaveBeenCalled();
    });

    it('should return error when port fails', async () => {
      // Arrange
      const request: ListBudgetsRequestDto = {
        page: 1,
        limit: 10,
        offset: 0,
      };

      const portError = new ApplicationError('Database error', 'DATABASE_ERROR', 500);
      mockListBudgetsPort.list.and.returnValue(
        Promise.resolve(Either.error(portError))
      );

      // Act
      const result = await queryHandler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBe(portError);
      }
    });

    it('should return network error when port throws exception', async () => {
      // Arrange
      const request: ListBudgetsRequestDto = {
        page: 1,
        limit: 10,
        offset: 0,
      };

      const networkError = new Error('Network timeout');
      mockListBudgetsPort.list.and.throwError(networkError);

      // Act
      const result = await queryHandler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      if (result.hasError) {
        expect(result.errors[0]).toBeInstanceOf(NetworkError);
        expect(result.errors[0].message).toBe('Failed to list budgets due to network error');
      }
    });

    it('should handle minimal request without filters', async () => {
      // Arrange
      const request: ListBudgetsRequestDto = {
        page: 1,
        limit: 10,
        offset: 0,
        // No ownerId or isActive filters
      };

      const expectedResponse: BudgetListResponseDto = {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false,
        },
      };

      mockListBudgetsPort.list.and.returnValue(
        Promise.resolve(Either.success(expectedResponse))
      );

      // Act
      const result = await queryHandler.execute(request);

      // Assert
      expect(result.hasError).toBe(false);
      if (!result.hasError && result.data) {
        expect(result.data).toEqual(expectedResponse);
      }
    });
  });
});