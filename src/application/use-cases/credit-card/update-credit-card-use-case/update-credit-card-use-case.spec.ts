import { UpdateCreditCardUseCase } from './update-credit-card-use-case';
import { IUpdateCreditCardPort } from '../../../ports/credit-card/update-credit-card.port';
import { UpdateCreditCardRequestDto } from '../../../dtos/credit-card/request/update-credit-card-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { CreditCardRequestMapper } from '../../../mappers/credit-card/credit-card-request-mapper/credit-card-request-mapper';

describe('UpdateCreditCardUseCase', () => {
  let useCase: UpdateCreditCardUseCase;
  let mockUpdateCreditCardPort: jasmine.SpyObj<IUpdateCreditCardPort>;

  beforeEach(() => {
    mockUpdateCreditCardPort = jasmine.createSpyObj('IUpdateCreditCardPort', ['updateCreditCard']);
    useCase = new UpdateCreditCardUseCase(mockUpdateCreditCardPort);
  });

  describe('execute', () => {
    it('should update credit card successfully via HTTP', async () => {
      const validRequest: UpdateCreditCardRequestDto = {
        id: 'credit-card-123',
        name: 'Updated Credit Card',
        limit: 6000,
        closingDay: 20,
        dueDay: 25,
        brand: 'Mastercard',
        lastFourDigits: '5678',
      };

      spyOn(CreditCardRequestMapper, 'validateUpdateRequest').and.returnValue(Either.success(true));
      spyOn(CreditCardRequestMapper, 'normalizeUpdateRequest').and.returnValue(validRequest);
      const mockBackendResponse = { id: 'credit-card-123' };
      mockUpdateCreditCardPort.updateCreditCard.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(CreditCardRequestMapper.validateUpdateRequest).toHaveBeenCalledWith(validRequest);
      expect(CreditCardRequestMapper.normalizeUpdateRequest).toHaveBeenCalledWith(validRequest);
      expect(mockUpdateCreditCardPort.updateCreditCard).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when credit card ID is invalid', async () => {
      const invalidRequest: UpdateCreditCardRequestDto = {
        id: '',
        name: 'Updated Credit Card',
        limit: 6000,
        closingDay: 20,
        dueDay: 25,
        brand: 'Mastercard',
        lastFourDigits: '5678',
      };

      const validationError = new ValidationError(
        'id',
        'CreditCard ID is required and must be a non-empty string'
      );
      spyOn(CreditCardRequestMapper, 'validateUpdateRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockUpdateCreditCardPort.updateCreditCard).not.toHaveBeenCalled();
    });

    it('should return validation error when request DTO is null', async () => {
      const validationError = new ValidationError('dto', 'Request DTO is required');
      spyOn(CreditCardRequestMapper, 'validateUpdateRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockUpdateCreditCardPort.updateCreditCard).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: UpdateCreditCardRequestDto = {
        id: 'credit-card-123',
        name: 'Updated Credit Card',
        limit: 6000,
        closingDay: 20,
        dueDay: 25,
        brand: 'Mastercard',
        lastFourDigits: '5678',
      };

      spyOn(CreditCardRequestMapper, 'validateUpdateRequest').and.returnValue(Either.success(true));
      spyOn(CreditCardRequestMapper, 'normalizeUpdateRequest').and.returnValue(validRequest);
      const networkError = new NetworkError('updateCreditCard', 'Connection failed');
      mockUpdateCreditCardPort.updateCreditCard.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: UpdateCreditCardRequestDto = {
        id: 'credit-card-123',
        name: 'Updated Credit Card',
        limit: 6000,
        closingDay: 20,
        dueDay: 25,
        brand: 'Mastercard',
        lastFourDigits: '5678',
      };

      spyOn(CreditCardRequestMapper, 'validateUpdateRequest').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
