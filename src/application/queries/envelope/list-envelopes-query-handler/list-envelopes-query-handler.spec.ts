import { ListEnvelopesQueryHandler } from './list-envelopes-query-handler';
import { IListEnvelopesPort } from '../../../ports/envelope/list-envelopes.port';
import { ListEnvelopesQueryRequestDto } from '../../../dtos/envelope/request/list-envelopes-query-request.dto';
import { ListEnvelopesQueryResponseDto } from '../../../dtos/envelope/response/list-envelopes-query-response.dto';
import { EnvelopeSummaryDto } from '../../../dtos/envelope/response/list-envelopes-query-response.dto';
import { MoneyDto } from '../../../dtos/shared/money.dto';
import { Either } from '../../../../shared/core/either/either';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

describe('ListEnvelopesQueryHandler', () => {
  let handler: ListEnvelopesQueryHandler;
  let mockPort: jasmine.SpyObj<IListEnvelopesPort>;

  beforeEach(() => {
    mockPort = jasmine.createSpyObj('IListEnvelopesPort', ['listEnvelopes']);
    handler = new ListEnvelopesQueryHandler(mockPort);
  });

  describe('execute', () => {
    it('should return success when port returns valid data', async () => {
      // Arrange
      const request: ListEnvelopesQueryRequestDto = {
        budgetId: 'budget-123',
        categoryId: 'category-123'
      };

      const envelopeDto: EnvelopeSummaryDto = {
        id: 'envelope-123',
        name: 'Test Envelope',
        limit: {
          valueInCents: 100000,
          valueInMonetary: 1000.00,
          formatted: 'R$ 1.000,00'
        } as MoneyDto,
        currentBalance: {
          valueInCents: 50000,
          valueInMonetary: 500.00,
          formatted: 'R$ 500,00'
        } as MoneyDto,
        remainingAmount: {
          valueInCents: 50000,
          valueInMonetary: 500.00,
          formatted: 'R$ 500,00'
        } as MoneyDto,
        categoryId: 'category-123',
        budgetId: 'budget-123',
        description: 'Test envelope description',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        usagePercentage: 50.0,
        status: 'active'
      };

      const response: ListEnvelopesQueryResponseDto = {
        envelopes: [envelopeDto]
      };

      mockPort.listEnvelopes.and.returnValue(
        Promise.resolve(Either.success(response))
      );

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(response);
      expect(mockPort.listEnvelopes).toHaveBeenCalledWith(request);
    });

    it('should return validation error when budgetId is empty', async () => {
      // Arrange
      const request: ListEnvelopesQueryRequestDto = {
        budgetId: '',
        categoryId: 'category-123'
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Budget ID is required');
      expect(mockPort.listEnvelopes).not.toHaveBeenCalled();
    });

    it('should return validation error when budgetId is null', async () => {
      // Arrange
      const request: ListEnvelopesQueryRequestDto = {
        budgetId: null as any,
        categoryId: 'category-123'
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Budget ID is required');
      expect(mockPort.listEnvelopes).not.toHaveBeenCalled();
    });

    it('should work without categoryId', async () => {
      // Arrange
      const request: ListEnvelopesQueryRequestDto = {
        budgetId: 'budget-123'
      };

      const envelopeDto: EnvelopeSummaryDto = {
        id: 'envelope-123',
        name: 'Test Envelope',
        limit: {
          valueInCents: 100000,
          valueInMonetary: 1000.00,
          formatted: 'R$ 1.000,00'
        } as MoneyDto,
        currentBalance: {
          valueInCents: 50000,
          valueInMonetary: 500.00,
          formatted: 'R$ 500,00'
        } as MoneyDto,
        remainingAmount: {
          valueInCents: 50000,
          valueInMonetary: 500.00,
          formatted: 'R$ 500,00'
        } as MoneyDto,
        categoryId: 'category-123',
        budgetId: 'budget-123',
        description: 'Test envelope description',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        usagePercentage: 50.0,
        status: 'active'
      };

      const response: ListEnvelopesQueryResponseDto = {
        envelopes: [envelopeDto]
      };

      mockPort.listEnvelopes.and.returnValue(
        Promise.resolve(Either.success(response))
      );

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(response);
      expect(mockPort.listEnvelopes).toHaveBeenCalledWith(request);
    });

    it('should return port errors when port returns errors', async () => {
      // Arrange
      const request: ListEnvelopesQueryRequestDto = {
        budgetId: 'budget-123',
        categoryId: 'category-123'
      };

      const portError = new ValidationError('port', 'Port error');

      mockPort.listEnvelopes.and.returnValue(
        Promise.resolve(Either.errors([portError]))
      );

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(portError);
      expect(mockPort.listEnvelopes).toHaveBeenCalledWith(request);
    });

    it('should return unexpected error when port throws exception', async () => {
      // Arrange
      const request: ListEnvelopesQueryRequestDto = {
        budgetId: 'budget-123',
        categoryId: 'category-123'
      };

      const portError = new Error('Port exception');
      mockPort.listEnvelopes.and.throwError(portError);

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(UnexpectedError);
    });
  });
});
