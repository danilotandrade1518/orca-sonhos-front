import { UpdateEnvelopeUseCase } from './update-envelope-use-case';
import { IUpdateEnvelopePort } from '../../../ports/envelope/update-envelope.port';
import { UpdateEnvelopeRequestDto } from '../../../dtos/envelope/request/update-envelope-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { EnvelopeRequestMapper } from '../../../mappers/envelope/envelope-request-mapper/envelope-request-mapper';

describe('UpdateEnvelopeUseCase', () => {
  let useCase: UpdateEnvelopeUseCase;
  let mockUpdateEnvelopePort: jasmine.SpyObj<IUpdateEnvelopePort>;

  beforeEach(() => {
    mockUpdateEnvelopePort = jasmine.createSpyObj('IUpdateEnvelopePort', ['updateEnvelope']);
    useCase = new UpdateEnvelopeUseCase(mockUpdateEnvelopePort);
  });

  describe('execute', () => {
    it('should update envelope successfully via HTTP', async () => {
      const validRequest: UpdateEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: 'user-123',
        budgetId: 'budget-123',
        name: 'Updated Envelope',
        monthlyLimit: 1500,
      };

      spyOn(EnvelopeRequestMapper, 'validateUpdateRequest').and.returnValue(Either.success(true));
      spyOn(EnvelopeRequestMapper, 'normalizeUpdateRequest').and.returnValue(validRequest);
      const mockBackendResponse = { id: 'envelope-123' };
      mockUpdateEnvelopePort.updateEnvelope.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(EnvelopeRequestMapper.validateUpdateRequest).toHaveBeenCalledWith(validRequest);
      expect(EnvelopeRequestMapper.normalizeUpdateRequest).toHaveBeenCalledWith(validRequest);
      expect(mockUpdateEnvelopePort.updateEnvelope).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when envelope ID is invalid', async () => {
      const invalidRequest: UpdateEnvelopeRequestDto = {
        envelopeId: '',
        userId: 'user-123',
        budgetId: 'budget-123',
        name: 'Updated Envelope',
        monthlyLimit: 1500,
      };

      const validationError = new ValidationError(
        'envelopeId',
        'Envelope ID is required and must be a non-empty string'
      );
      spyOn(EnvelopeRequestMapper, 'validateUpdateRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockUpdateEnvelopePort.updateEnvelope).not.toHaveBeenCalled();
    });

    it('should return validation error when user ID is invalid', async () => {
      const invalidRequest: UpdateEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: '',
        budgetId: 'budget-123',
        name: 'Updated Envelope',
        monthlyLimit: 1500,
      };

      const validationError = new ValidationError(
        'userId',
        'User ID is required and must be a non-empty string'
      );
      spyOn(EnvelopeRequestMapper, 'validateUpdateRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockUpdateEnvelopePort.updateEnvelope).not.toHaveBeenCalled();
    });

    it('should return validation error when budget ID is invalid', async () => {
      const invalidRequest: UpdateEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: 'user-123',
        budgetId: '',
        name: 'Updated Envelope',
        monthlyLimit: 1500,
      };

      const validationError = new ValidationError(
        'budgetId',
        'Budget ID is required and must be a non-empty string'
      );
      spyOn(EnvelopeRequestMapper, 'validateUpdateRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockUpdateEnvelopePort.updateEnvelope).not.toHaveBeenCalled();
    });

    it('should return validation error when request DTO is null', async () => {
      const validationError = new ValidationError('dto', 'Request DTO is required');
      spyOn(EnvelopeRequestMapper, 'validateUpdateRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockUpdateEnvelopePort.updateEnvelope).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: UpdateEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: 'user-123',
        budgetId: 'budget-123',
        name: 'Updated Envelope',
        monthlyLimit: 1500,
      };

      spyOn(EnvelopeRequestMapper, 'validateUpdateRequest').and.returnValue(Either.success(true));
      spyOn(EnvelopeRequestMapper, 'normalizeUpdateRequest').and.returnValue(validRequest);
      const networkError = new NetworkError('updateEnvelope', 'Connection failed');
      mockUpdateEnvelopePort.updateEnvelope.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: UpdateEnvelopeRequestDto = {
        envelopeId: 'envelope-123',
        userId: 'user-123',
        budgetId: 'budget-123',
        name: 'Updated Envelope',
        monthlyLimit: 1500,
      };

      spyOn(EnvelopeRequestMapper, 'validateUpdateRequest').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
