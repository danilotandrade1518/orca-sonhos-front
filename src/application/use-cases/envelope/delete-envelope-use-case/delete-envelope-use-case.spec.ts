import { DeleteEnvelopeUseCase } from './delete-envelope-use-case';
import { IDeleteEnvelopePort } from '../../../ports/envelope/delete-envelope.port';
import { DeleteEnvelopeRequestDto } from '../../../dtos/envelope/request/delete-envelope-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { EnvelopeRequestMapper } from '../../../mappers/envelope/envelope-request-mapper/envelope-request-mapper';

describe('DeleteEnvelopeUseCase', () => {
  let useCase: DeleteEnvelopeUseCase;
  let mockDeleteEnvelopePort: jasmine.SpyObj<IDeleteEnvelopePort>;

  beforeEach(() => {
    mockDeleteEnvelopePort = jasmine.createSpyObj('IDeleteEnvelopePort', ['deleteEnvelope']);
    useCase = new DeleteEnvelopeUseCase(mockDeleteEnvelopePort);
  });

  describe('execute', () => {
    it('should delete envelope successfully via HTTP', async () => {
      const validRequest: DeleteEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: 'user-123',
        budgetId: 'budget-123',
      };

      spyOn(EnvelopeRequestMapper, 'validateDeleteRequest').and.returnValue(Either.success(true));
      spyOn(EnvelopeRequestMapper, 'normalizeDeleteRequest').and.returnValue(validRequest);
      const mockBackendResponse = { id: 'envelope-123' };
      mockDeleteEnvelopePort.deleteEnvelope.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(EnvelopeRequestMapper.validateDeleteRequest).toHaveBeenCalledWith(validRequest);
      expect(EnvelopeRequestMapper.normalizeDeleteRequest).toHaveBeenCalledWith(validRequest);
      expect(mockDeleteEnvelopePort.deleteEnvelope).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when envelope ID is invalid', async () => {
      const invalidRequest: DeleteEnvelopeRequestDto = {
        envelopeId: '',
        userId: 'user-123',
        budgetId: 'budget-123',
      };

      const validationError = new ValidationError(
        'envelopeId',
        'Envelope ID is required and must be a non-empty string'
      );
      spyOn(EnvelopeRequestMapper, 'validateDeleteRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockDeleteEnvelopePort.deleteEnvelope).not.toHaveBeenCalled();
    });

    it('should return validation error when user ID is invalid', async () => {
      const invalidRequest: DeleteEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: '',
        budgetId: 'budget-123',
      };

      const validationError = new ValidationError(
        'userId',
        'User ID is required and must be a non-empty string'
      );
      spyOn(EnvelopeRequestMapper, 'validateDeleteRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockDeleteEnvelopePort.deleteEnvelope).not.toHaveBeenCalled();
    });

    it('should return validation error when budget ID is invalid', async () => {
      const invalidRequest: DeleteEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: 'user-123',
        budgetId: '',
      };

      const validationError = new ValidationError(
        'budgetId',
        'Budget ID is required and must be a non-empty string'
      );
      spyOn(EnvelopeRequestMapper, 'validateDeleteRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockDeleteEnvelopePort.deleteEnvelope).not.toHaveBeenCalled();
    });

    it('should return validation error when request DTO is null', async () => {
      const validationError = new ValidationError('dto', 'Request DTO is required');
      spyOn(EnvelopeRequestMapper, 'validateDeleteRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockDeleteEnvelopePort.deleteEnvelope).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: DeleteEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: 'user-123',
        budgetId: 'budget-123',
      };

      spyOn(EnvelopeRequestMapper, 'validateDeleteRequest').and.returnValue(Either.success(true));
      spyOn(EnvelopeRequestMapper, 'normalizeDeleteRequest').and.returnValue(validRequest);
      const networkError = new NetworkError('deleteEnvelope', 'Connection failed');
      mockDeleteEnvelopePort.deleteEnvelope.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: DeleteEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: 'user-123',
        budgetId: 'budget-123',
      };

      spyOn(EnvelopeRequestMapper, 'validateDeleteRequest').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
