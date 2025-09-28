import { DeleteCreditCardUseCase } from './delete-credit-card-use-case';
import { IDeleteCreditCardPort } from '../../../ports/credit-card/delete-credit-card.port';
import { DeleteCreditCardRequestDto } from '../../../dtos/credit-card/request/delete-credit-card-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { CreditCardRequestMapper } from '../../../mappers/credit-card/credit-card-request-mapper/credit-card-request-mapper';

describe('DeleteCreditCardUseCase', () => {
  let useCase: DeleteCreditCardUseCase;
  let mockDeleteCreditCardPort: jasmine.SpyObj<IDeleteCreditCardPort>;

  beforeEach(() => {
    mockDeleteCreditCardPort = jasmine.createSpyObj('IDeleteCreditCardPort', ['deleteCreditCard']);
    useCase = new DeleteCreditCardUseCase(mockDeleteCreditCardPort);
  });

  describe('execute', () => {
    it('should delete credit card successfully via HTTP', async () => {
      const validRequest: DeleteCreditCardRequestDto = {
        id: 'credit-card-123',
      };

      spyOn(CreditCardRequestMapper, 'validateDeleteRequest').and.returnValue(Either.success(true));
      spyOn(CreditCardRequestMapper, 'normalizeDeleteRequest').and.returnValue(validRequest);
      const mockBackendResponse = { id: 'credit-card-123' };
      mockDeleteCreditCardPort.deleteCreditCard.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(CreditCardRequestMapper.validateDeleteRequest).toHaveBeenCalledWith(validRequest);
      expect(CreditCardRequestMapper.normalizeDeleteRequest).toHaveBeenCalledWith(validRequest);
      expect(mockDeleteCreditCardPort.deleteCreditCard).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when credit card ID is invalid', async () => {
      const invalidRequest: DeleteCreditCardRequestDto = {
        id: '',
      };

      const validationError = new ValidationError(
        'id',
        'CreditCard ID is required and must be a non-empty string'
      );
      spyOn(CreditCardRequestMapper, 'validateDeleteRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockDeleteCreditCardPort.deleteCreditCard).not.toHaveBeenCalled();
    });

    it('should return validation error when request DTO is null', async () => {
      const validationError = new ValidationError('dto', 'Request DTO is required');
      spyOn(CreditCardRequestMapper, 'validateDeleteRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockDeleteCreditCardPort.deleteCreditCard).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: DeleteCreditCardRequestDto = {
        id: 'credit-card-123',
      };

      spyOn(CreditCardRequestMapper, 'validateDeleteRequest').and.returnValue(Either.success(true));
      spyOn(CreditCardRequestMapper, 'normalizeDeleteRequest').and.returnValue(validRequest);
      const networkError = new NetworkError('deleteCreditCard', 'Connection failed');
      mockDeleteCreditCardPort.deleteCreditCard.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: DeleteCreditCardRequestDto = {
        id: 'credit-card-123',
      };

      spyOn(CreditCardRequestMapper, 'validateDeleteRequest').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
