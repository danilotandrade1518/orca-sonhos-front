import { ListCreditCardsQueryHandler } from './list-credit-cards-query-handler';
import { IListCreditCardsPort } from '../../../ports/credit-card/list-credit-cards.port';
import { ListCreditCardsQueryRequestDto } from '../../../dtos/credit-card/request/list-credit-cards-query-request.dto';
import { ListCreditCardsQueryResponseDto } from '../../../dtos/credit-card/response/list-credit-cards-query-response.dto';
import { CreditCardSummaryDto } from '../../../dtos/credit-card/response/list-credit-cards-query-response.dto';
import { MoneyDto } from '../../../dtos/shared/money.dto';
import { Either } from '../../../../shared/core/either/either';
import { ApplicationError } from '../../../errors/application-error';
import { ValidationError } from '../../../errors/validation-error';
import { UnexpectedError } from '../../../errors/unexpected-error';

describe('ListCreditCardsQueryHandler', () => {
  let handler: ListCreditCardsQueryHandler;
  let mockPort: jasmine.SpyObj<IListCreditCardsPort>;

  beforeEach(() => {
    mockPort = jasmine.createSpyObj('IListCreditCardsPort', ['listCreditCards']);
    handler = new ListCreditCardsQueryHandler(mockPort);
  });

  describe('execute', () => {
    it('should return success when port returns valid data', async () => {
      // Arrange
      const request: ListCreditCardsQueryRequestDto = {
        budgetId: 'budget-123',
      };

      const creditCardDto: CreditCardSummaryDto = {
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
        createdAt: '2024-01-01T00:00:00Z'
      };

      const response: ListCreditCardsQueryResponseDto = {
        creditCards: [creditCardDto]
      };

      mockPort.listCreditCards.and.returnValue(
        Promise.resolve(Either.success(response))
      );

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(response);
      expect(mockPort.listCreditCards).toHaveBeenCalledWith(request);
    });

    it('should return validation error when budgetId is empty', async () => {
      // Arrange
      const request: ListCreditCardsQueryRequestDto = {
        budgetId: '',
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Budget ID is required');
      expect(mockPort.listCreditCards).not.toHaveBeenCalled();
    });

    it('should return validation error when budgetId is null', async () => {
      // Arrange
      const request: ListCreditCardsQueryRequestDto = {
        budgetId: null as any,
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Budget ID is required');
      expect(mockPort.listCreditCards).not.toHaveBeenCalled();
    });

    it('should return validation error when budgetId is empty', async () => {
      // Arrange
      const request: ListCreditCardsQueryRequestDto = {
        budgetId: '',
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Budget ID is required');
      expect(mockPort.listCreditCards).not.toHaveBeenCalled();
    });

    it('should return validation error when budgetId is null', async () => {
      // Arrange
      const request: ListCreditCardsQueryRequestDto = {
        budgetId: null as any,
      };

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Budget ID is required');
      expect(mockPort.listCreditCards).not.toHaveBeenCalled();
    });

    it('should return port errors when port returns errors', async () => {
      // Arrange
      const request: ListCreditCardsQueryRequestDto = {
        budgetId: 'budget-123',
      };

      const portError = new ValidationError('port', 'Port error');

      mockPort.listCreditCards.and.returnValue(
        Promise.resolve(Either.errors([portError]))
      );

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(portError);
      expect(mockPort.listCreditCards).toHaveBeenCalledWith(request);
    });

    it('should return unexpected error when port throws exception', async () => {
      // Arrange
      const request: ListCreditCardsQueryRequestDto = {
        budgetId: 'budget-123',
      };

      const portError = new Error('Port exception');
      mockPort.listCreditCards.and.throwError(portError);

      // Act
      const result = await handler.execute(request);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors[0]).toBeInstanceOf(UnexpectedError);
    });
  });
});
