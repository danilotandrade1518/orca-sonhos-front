import { GetCreditCardByIdQueryHandler } from './get-credit-card-by-id-query-handler';
import { IGetCreditCardByIdPort } from '../../../ports/credit-card/get-credit-card-by-id.port';
import { GetCreditCardByIdQueryRequestDto } from '../../../dtos/credit-card/request/get-credit-card-by-id-query-request.dto';
import { GetCreditCardByIdQueryResponseDto } from '../../../dtos/credit-card/response/get-credit-card-by-id-query-response.dto';
import { CreditCardDetailDto } from '../../../dtos/credit-card/response/get-credit-card-by-id-query-response.dto';
import { MoneyDto } from '../../../dtos/shared/money.dto';
import { Either } from '../../../../shared/core/either/either';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

describe('GetCreditCardByIdQueryHandler', () => {
  let handler: GetCreditCardByIdQueryHandler;
  let mockPort: jasmine.SpyObj<IGetCreditCardByIdPort>;

  beforeEach(() => {
    mockPort = jasmine.createSpyObj('IGetCreditCardByIdPort', ['getCreditCardById']);
    handler = new GetCreditCardByIdQueryHandler(mockPort);
  });

  describe('execute', () => {
    it('should return success when port returns valid data', async () => {
      // Arrange
      const request: GetCreditCardByIdQueryRequestDto = {
        creditCardId: 'credit-card-123',
      };

      const creditCardDto: CreditCardDetailDto = {
        id: 'credit-card-123',
        name: 'Test Credit Card',
        limit: {
          valueInCents: 500000,
          valueInMonetary: 5000.00,
          formatted: 'R$ 5.000,00'
        } as MoneyDto,
        availableLimit: {
          valueInCents: 300000,
          valueInMonetary: 3000.00,
          formatted: 'R$ 3.000,00'
        } as MoneyDto,
        currentBalance: {
          valueInCents: 200000,
          valueInMonetary: 2000.00,
          formatted: 'R$ 2.000,00'
        } as MoneyDto,
        budgetId: 'budget-123',
        dueDay: 15,
        closingDay: 10,
        brand: 'Visa',
        lastFourDigits: '1234',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        nextClosingDate: '2024-02-10T00:00:00Z',
        nextDueDate: '2024-02-15T00:00:00Z',
        billCount: 1
      };

      const response: GetCreditCardByIdQueryResponseDto = {
        creditCard: creditCardDto
      };

      mockPort.getCreditCardById.and.returnValue(
        Promise.resolve(Either.success(response))
      );

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(response);
      expect(mockPort.getCreditCardById).toHaveBeenCalledWith(request);
    });

    it('should return validation error when creditCardId is empty', async () => {
      // Arrange
      const request: GetCreditCardByIdQueryRequestDto = {
        creditCardId: '',
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Credit Card ID is required');
      expect(mockPort.getCreditCardById).not.toHaveBeenCalled();
    });

    it('should return validation error when creditCardId is null', async () => {
      // Arrange
      const request: GetCreditCardByIdQueryRequestDto = {
        creditCardId: null as any,
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Credit Card ID is required');
      expect(mockPort.getCreditCardById).not.toHaveBeenCalled();
    });

    it('should return validation error when creditCardId is empty', async () => {
      // Arrange
      const request: GetCreditCardByIdQueryRequestDto = {
        creditCardId: '',
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Credit Card ID is required');
      expect(mockPort.getCreditCardById).not.toHaveBeenCalled();
    });

    it('should return validation error when creditCardId is null', async () => {
      // Arrange
      const request: GetCreditCardByIdQueryRequestDto = {
        creditCardId: null as any,
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Credit Card ID is required');
      expect(mockPort.getCreditCardById).not.toHaveBeenCalled();
    });

    it('should return port errors when port returns errors', async () => {
      // Arrange
      const request: GetCreditCardByIdQueryRequestDto = {
        creditCardId: 'credit-card-123',
      };

      const portError = new ValidationError('port', 'Port error');

      mockPort.getCreditCardById.and.returnValue(
        Promise.resolve(Either.errors([portError]))
      );

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(portError);
      expect(mockPort.getCreditCardById).toHaveBeenCalledWith(request);
    });

    it('should return unexpected error when port throws exception', async () => {
      // Arrange
      const request: GetCreditCardByIdQueryRequestDto = {
        creditCardId: 'credit-card-123',
      };

      const portError = new Error('Port exception');
      mockPort.getCreditCardById.and.throwError(portError);

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(UnexpectedError);
    });
  });
});
