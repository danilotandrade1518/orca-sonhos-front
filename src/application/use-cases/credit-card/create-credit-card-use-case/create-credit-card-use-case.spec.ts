import { CreateCreditCardUseCase } from './create-credit-card-use-case';
import { ICreateCreditCardPort } from '../../../ports/credit-card/create-credit-card.port';
import { CreateCreditCardRequestDto } from '../../../dtos/credit-card/request/create-credit-card-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { CreditCardRequestMapper } from '../../../mappers/credit-card/credit-card-request-mapper/credit-card-request-mapper';

describe('CreateCreditCardUseCase', () => {
  let useCase: CreateCreditCardUseCase;
  let mockCreateCreditCardPort: jasmine.SpyObj<ICreateCreditCardPort>;

  beforeEach(() => {
    mockCreateCreditCardPort = jasmine.createSpyObj('ICreateCreditCardPort', ['createCreditCard']);
    useCase = new CreateCreditCardUseCase(mockCreateCreditCardPort);
  });

  describe('execute', () => {
    it('should create credit card successfully via HTTP', async () => {
      const validRequest: CreateCreditCardRequestDto = {
        name: 'Test Credit Card',
        limit: 5000,
        closingDay: 15,
        dueDay: 20,
        budgetId: 'budget-123',
        brand: 'Visa',
        lastFourDigits: '1234',
      };

      const mockCreditCard = {
        id: 'credit-card-123',
        name: 'Test Credit Card',
        limitInCents: 500000,
        closingDay: 15,
        dueDay: 20,
        budgetId: 'budget-123',
        brand: 'Visa',
        lastFourDigits: '1234',
        isActive: true,
        createdAt: new Date(),
      };

      spyOn(CreditCardRequestMapper, 'fromCreateRequestToCreditCard').and.returnValue(
        Either.success(mockCreditCard as any)
      );
      const mockBackendResponse = { id: 'credit-card-123' };
      mockCreateCreditCardPort.createCreditCard.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(CreditCardRequestMapper.fromCreateRequestToCreditCard).toHaveBeenCalledWith(
        validRequest
      );
      expect(mockCreateCreditCardPort.createCreditCard).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when credit card data is invalid', async () => {
      const invalidRequest: CreateCreditCardRequestDto = {
        name: '',
        limit: -100,
        closingDay: 0,
        dueDay: 0,
        budgetId: '',
        brand: '',
        lastFourDigits: '',
      };

      const validationError = new ValidationError('name', 'Name is required');
      spyOn(CreditCardRequestMapper, 'fromCreateRequestToCreditCard').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockCreateCreditCardPort.createCreditCard).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: CreateCreditCardRequestDto = {
        name: 'Test Credit Card',
        limit: 5000,
        closingDay: 15,
        dueDay: 20,
        budgetId: 'budget-123',
        brand: 'Visa',
        lastFourDigits: '1234',
      };

      const mockCreditCard = {
        id: 'credit-card-123',
        name: 'Test Credit Card',
        limitInCents: 500000,
        closingDay: 15,
        dueDay: 20,
        budgetId: 'budget-123',
        brand: 'Visa',
        lastFourDigits: '1234',
        isActive: true,
        createdAt: new Date(),
      };

      spyOn(CreditCardRequestMapper, 'fromCreateRequestToCreditCard').and.returnValue(
        Either.success(mockCreditCard as any)
      );
      const networkError = new NetworkError('createCreditCard', 'Connection failed');
      mockCreateCreditCardPort.createCreditCard.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: CreateCreditCardRequestDto = {
        name: 'Test Credit Card',
        limit: 5000,
        closingDay: 15,
        dueDay: 20,
        budgetId: 'budget-123',
        brand: 'Visa',
        lastFourDigits: '1234',
      };

      spyOn(CreditCardRequestMapper, 'fromCreateRequestToCreditCard').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
