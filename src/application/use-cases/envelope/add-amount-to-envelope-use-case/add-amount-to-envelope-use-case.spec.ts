import { AddAmountToEnvelopeUseCase } from './add-amount-to-envelope-use-case';
import { IAddAmountToEnvelopePort } from '../../../ports/envelope/add-amount-to-envelope.port';
import { AddAmountToEnvelopeRequestDto } from '../../../dtos/envelope/request/add-amount-to-envelope-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { EnvelopeRequestMapper } from '../../../mappers/envelope/envelope-request-mapper/envelope-request-mapper';

describe('AddAmountToEnvelopeUseCase', () => {
  let useCase: AddAmountToEnvelopeUseCase;
  let mockAddAmountToEnvelopePort: jasmine.SpyObj<IAddAmountToEnvelopePort>;

  beforeEach(() => {
    mockAddAmountToEnvelopePort = jasmine.createSpyObj('IAddAmountToEnvelopePort', [
      'addAmountToEnvelope',
    ]);
    useCase = new AddAmountToEnvelopeUseCase(mockAddAmountToEnvelopePort);
  });

  describe('execute', () => {
    it('should add amount to envelope successfully via HTTP', async () => {
      const validRequest: AddAmountToEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: 'user-123',
        budgetId: 'budget-123',
        amount: 100,
      };

      spyOn(EnvelopeRequestMapper, 'validateAddAmountRequest').and.returnValue(
        Either.success(true)
      );
      spyOn(EnvelopeRequestMapper, 'normalizeAddAmountRequest').and.returnValue(validRequest);
      const mockBackendResponse = {
        envelopeId: 'envelope-123',
        amount: 100,
        newBalance: 100,
      };
      mockAddAmountToEnvelopePort.addAmountToEnvelope.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(EnvelopeRequestMapper.validateAddAmountRequest).toHaveBeenCalledWith(validRequest);
      expect(EnvelopeRequestMapper.normalizeAddAmountRequest).toHaveBeenCalledWith(validRequest);
      expect(mockAddAmountToEnvelopePort.addAmountToEnvelope).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when envelope ID is invalid', async () => {
      const invalidRequest: AddAmountToEnvelopeRequestDto = {
        envelopeId: '',
        userId: 'user-123',
        budgetId: 'budget-123',
        amount: 100,
      };

      const validationError = new ValidationError(
        'envelopeId',
        'Envelope ID is required and must be a non-empty string'
      );
      spyOn(EnvelopeRequestMapper, 'validateAddAmountRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockAddAmountToEnvelopePort.addAmountToEnvelope).not.toHaveBeenCalled();
    });

    it('should return validation error when user ID is invalid', async () => {
      const invalidRequest: AddAmountToEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: '',
        budgetId: 'budget-123',
        amount: 100,
      };

      const validationError = new ValidationError(
        'userId',
        'User ID is required and must be a non-empty string'
      );
      spyOn(EnvelopeRequestMapper, 'validateAddAmountRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockAddAmountToEnvelopePort.addAmountToEnvelope).not.toHaveBeenCalled();
    });

    it('should return validation error when budget ID is invalid', async () => {
      const invalidRequest: AddAmountToEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: 'user-123',
        budgetId: '',
        amount: 100,
      };

      const validationError = new ValidationError(
        'budgetId',
        'Budget ID is required and must be a non-empty string'
      );
      spyOn(EnvelopeRequestMapper, 'validateAddAmountRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockAddAmountToEnvelopePort.addAmountToEnvelope).not.toHaveBeenCalled();
    });

    it('should return validation error when amount is invalid', async () => {
      const invalidRequest: AddAmountToEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: 'user-123',
        budgetId: 'budget-123',
        amount: -100,
      };

      const validationError = new ValidationError(
        'amount',
        'Amount is required and must be a positive number'
      );
      spyOn(EnvelopeRequestMapper, 'validateAddAmountRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockAddAmountToEnvelopePort.addAmountToEnvelope).not.toHaveBeenCalled();
    });

    it('should return validation error when request DTO is null', async () => {
      const validationError = new ValidationError('dto', 'Request DTO is required');
      spyOn(EnvelopeRequestMapper, 'validateAddAmountRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockAddAmountToEnvelopePort.addAmountToEnvelope).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: AddAmountToEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: 'user-123',
        budgetId: 'budget-123',
        amount: 100,
      };

      spyOn(EnvelopeRequestMapper, 'validateAddAmountRequest').and.returnValue(
        Either.success(true)
      );
      spyOn(EnvelopeRequestMapper, 'normalizeAddAmountRequest').and.returnValue(validRequest);
      const networkError = new NetworkError('addAmountToEnvelope', 'Connection failed');
      mockAddAmountToEnvelopePort.addAmountToEnvelope.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: AddAmountToEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: 'user-123',
        budgetId: 'budget-123',
        amount: 100,
      };

      spyOn(EnvelopeRequestMapper, 'validateAddAmountRequest').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
