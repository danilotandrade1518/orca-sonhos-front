import { GetEnvelopeByIdQueryHandler } from './get-envelope-by-id-query-handler';
import { IGetEnvelopeByIdPort } from '../../../ports/envelope/get-envelope-by-id.port';
import { GetEnvelopeByIdQueryRequestDto } from '../../../dtos/envelope/request/get-envelope-by-id-query-request.dto';
import { GetEnvelopeByIdQueryResponseDto } from '../../../dtos/envelope/response/get-envelope-by-id-query-response.dto';
import { EnvelopeDetailDto } from '../../../dtos/envelope/response/get-envelope-by-id-query-response.dto';
import { MoneyDto } from '../../../dtos/shared/money.dto';
import { Either } from '../../../../shared/core/either/either';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

describe('GetEnvelopeByIdQueryHandler', () => {
  let handler: GetEnvelopeByIdQueryHandler;
  let mockPort: jasmine.SpyObj<IGetEnvelopeByIdPort>;

  beforeEach(() => {
    mockPort = jasmine.createSpyObj('IGetEnvelopeByIdPort', ['getEnvelopeById']);
    handler = new GetEnvelopeByIdQueryHandler(mockPort);
  });

  describe('execute', () => {
    it('should return success when port returns valid data', async () => {
      // Arrange
      const request: GetEnvelopeByIdQueryRequestDto = {
        envelopeId: 'envelope-123'
      };

      const envelopeDto: EnvelopeDetailDto = {
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
        status: 'active',
        isOverLimit: false,
        isNearLimit: false,
        transactionCount: 5
      };

      const response: GetEnvelopeByIdQueryResponseDto = {
        envelope: envelopeDto
      };

      mockPort.getEnvelopeById.and.returnValue(
        Promise.resolve(Either.success(response))
      );

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(response);
      expect(mockPort.getEnvelopeById).toHaveBeenCalledWith(request);
    });

    it('should return validation error when envelopeId is empty', async () => {
      // Arrange
      const request: GetEnvelopeByIdQueryRequestDto = {
        envelopeId: ''
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Envelope ID is required');
      expect(mockPort.getEnvelopeById).not.toHaveBeenCalled();
    });

    it('should return validation error when envelopeId is null', async () => {
      // Arrange
      const request: GetEnvelopeByIdQueryRequestDto = {
        envelopeId: null as any
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Envelope ID is required');
      expect(mockPort.getEnvelopeById).not.toHaveBeenCalled();
    });

    it('should return port errors when port returns errors', async () => {
      // Arrange
      const request: GetEnvelopeByIdQueryRequestDto = {
        envelopeId: 'envelope-123'
      };

      const portError = new ValidationError('port', 'Port error');

      mockPort.getEnvelopeById.and.returnValue(
        Promise.resolve(Either.errors([portError]))
      );

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(portError);
      expect(mockPort.getEnvelopeById).toHaveBeenCalledWith(request);
    });

    it('should return unexpected error when port throws exception', async () => {
      // Arrange
      const request: GetEnvelopeByIdQueryRequestDto = {
        envelopeId: 'envelope-123'
      };

      const portError = new Error('Port exception');
      mockPort.getEnvelopeById.and.throwError(portError);

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(UnexpectedError);
    });
  });
});
