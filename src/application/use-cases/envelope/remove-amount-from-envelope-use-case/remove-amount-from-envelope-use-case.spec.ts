import { RemoveAmountFromEnvelopeUseCase } from './remove-amount-from-envelope-use-case';
import { IRemoveAmountFromEnvelopePort } from '../../../ports/envelope/remove-amount-from-envelope.port';
import { RemoveAmountFromEnvelopeRequestDto } from '../../../dtos/envelope/request/remove-amount-from-envelope-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { EnvelopeRequestMapper } from '../../../mappers/envelope/envelope-request-mapper/envelope-request-mapper';

describe('RemoveAmountFromEnvelopeUseCase', () => {
  let useCase: RemoveAmountFromEnvelopeUseCase;
  let mockRemoveAmountFromEnvelopePort: jasmine.SpyObj<IRemoveAmountFromEnvelopePort>;

  beforeEach(() => {
    mockRemoveAmountFromEnvelopePort = jasmine.createSpyObj('IRemoveAmountFromEnvelopePort', [
      'removeAmountFromEnvelope',
    ]);
    useCase = new RemoveAmountFromEnvelopeUseCase(mockRemoveAmountFromEnvelopePort);
  });

  describe('execute', () => {
    it('should remove amount from envelope successfully via HTTP', async () => {
      const validRequest: RemoveAmountFromEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: 'user-123',
        budgetId: 'budget-123',
        amount: 100,
      };

      spyOn(EnvelopeRequestMapper, 'validateRemoveAmountRequest').and.returnValue(
        Either.success(true)
      );
      spyOn(EnvelopeRequestMapper, 'normalizeRemoveAmountRequest').and.returnValue(validRequest);
      const mockBackendResponse = {
        envelopeId: 'envelope-123',
        amount: 100,
        newBalance: 0,
      };
      mockRemoveAmountFromEnvelopePort.removeAmountFromEnvelope.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(EnvelopeRequestMapper.validateRemoveAmountRequest).toHaveBeenCalledWith(validRequest);
      expect(EnvelopeRequestMapper.normalizeRemoveAmountRequest).toHaveBeenCalledWith(validRequest);
      expect(mockRemoveAmountFromEnvelopePort.removeAmountFromEnvelope).toHaveBeenCalledWith(
        validRequest
      );
    });

    it('should return validation error when envelope ID is invalid', async () => {
      const invalidRequest: RemoveAmountFromEnvelopeRequestDto = {
        envelopeId: '',
        userId: 'user-123',
        budgetId: 'budget-123',
        amount: 100,
      };

      const validationError = new ValidationError(
        'envelopeId',
        'Envelope ID is required and must be a non-empty string'
      );
      spyOn(EnvelopeRequestMapper, 'validateRemoveAmountRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockRemoveAmountFromEnvelopePort.removeAmountFromEnvelope).not.toHaveBeenCalled();
    });

    it('should return validation error when user ID is invalid', async () => {
      const invalidRequest: RemoveAmountFromEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: '',
        budgetId: 'budget-123',
        amount: 100,
      };

      const validationError = new ValidationError(
        'userId',
        'User ID is required and must be a non-empty string'
      );
      spyOn(EnvelopeRequestMapper, 'validateRemoveAmountRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockRemoveAmountFromEnvelopePort.removeAmountFromEnvelope).not.toHaveBeenCalled();
    });

    it('should return validation error when budget ID is invalid', async () => {
      const invalidRequest: RemoveAmountFromEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: 'user-123',
        budgetId: '',
        amount: 100,
      };

      const validationError = new ValidationError(
        'budgetId',
        'Budget ID is required and must be a non-empty string'
      );
      spyOn(EnvelopeRequestMapper, 'validateRemoveAmountRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockRemoveAmountFromEnvelopePort.removeAmountFromEnvelope).not.toHaveBeenCalled();
    });

    it('should return validation error when amount is invalid', async () => {
      const invalidRequest: RemoveAmountFromEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: 'user-123',
        budgetId: 'budget-123',
        amount: -100,
      };

      const validationError = new ValidationError(
        'amount',
        'Amount is required and must be a positive number'
      );
      spyOn(EnvelopeRequestMapper, 'validateRemoveAmountRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockRemoveAmountFromEnvelopePort.removeAmountFromEnvelope).not.toHaveBeenCalled();
    });

    it('should return validation error when request DTO is null', async () => {
      const validationError = new ValidationError('dto', 'Request DTO is required');
      spyOn(EnvelopeRequestMapper, 'validateRemoveAmountRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockRemoveAmountFromEnvelopePort.removeAmountFromEnvelope).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: RemoveAmountFromEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: 'user-123',
        budgetId: 'budget-123',
        amount: 100,
      };

      spyOn(EnvelopeRequestMapper, 'validateRemoveAmountRequest').and.returnValue(
        Either.success(true)
      );
      spyOn(EnvelopeRequestMapper, 'normalizeRemoveAmountRequest').and.returnValue(validRequest);
      const networkError = new NetworkError('removeAmountFromEnvelope', 'Connection failed');
      mockRemoveAmountFromEnvelopePort.removeAmountFromEnvelope.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: RemoveAmountFromEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: 'user-123',
        budgetId: 'budget-123',
        amount: 100,
      };

      spyOn(EnvelopeRequestMapper, 'validateRemoveAmountRequest').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
