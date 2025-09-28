import { TransferBetweenEnvelopesUseCase } from './transfer-between-envelopes-use-case';
import { ITransferBetweenEnvelopesPort } from '../../../ports/envelope/transfer-between-envelopes.port';
import { TransferBetweenEnvelopesRequestDto } from '../../../dtos/envelope/request/transfer-between-envelopes-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { EnvelopeRequestMapper } from '../../../mappers/envelope/envelope-request-mapper/envelope-request-mapper';

describe('TransferBetweenEnvelopesUseCase', () => {
  let useCase: TransferBetweenEnvelopesUseCase;
  let mockTransferBetweenEnvelopesPort: jasmine.SpyObj<ITransferBetweenEnvelopesPort>;

  beforeEach(() => {
    mockTransferBetweenEnvelopesPort = jasmine.createSpyObj('ITransferBetweenEnvelopesPort', [
      'transferBetweenEnvelopes',
    ]);
    useCase = new TransferBetweenEnvelopesUseCase(mockTransferBetweenEnvelopesPort);
  });

  describe('execute', () => {
    it('should transfer between envelopes successfully via HTTP', async () => {
      const validRequest: TransferBetweenEnvelopesRequestDto = {
        sourceEnvelopeId: 'envelope-123',
        targetEnvelopeId: 'envelope-456',
        userId: 'user-123',
        budgetId: 'budget-123',
        amount: 100,
      };

      spyOn(EnvelopeRequestMapper, 'validateTransferRequest').and.returnValue(Either.success(true));
      spyOn(EnvelopeRequestMapper, 'normalizeTransferRequest').and.returnValue(validRequest);
      const mockBackendResponse = {
        sourceEnvelopeId: 'envelope-123',
        targetEnvelopeId: 'envelope-456',
        amount: 100,
        transferId: 'transfer-123',
      };
      mockTransferBetweenEnvelopesPort.transferBetweenEnvelopes.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(EnvelopeRequestMapper.validateTransferRequest).toHaveBeenCalledWith(validRequest);
      expect(EnvelopeRequestMapper.normalizeTransferRequest).toHaveBeenCalledWith(validRequest);
      expect(mockTransferBetweenEnvelopesPort.transferBetweenEnvelopes).toHaveBeenCalledWith(
        validRequest
      );
    });

    it('should return validation error when source envelope ID is invalid', async () => {
      const invalidRequest: TransferBetweenEnvelopesRequestDto = {
        sourceEnvelopeId: '',
        targetEnvelopeId: 'envelope-456',
        userId: 'user-123',
        budgetId: 'budget-123',
        amount: 100,
      };

      const validationError = new ValidationError(
        'sourceEnvelopeId',
        'Source Envelope ID is required and must be a non-empty string'
      );
      spyOn(EnvelopeRequestMapper, 'validateTransferRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockTransferBetweenEnvelopesPort.transferBetweenEnvelopes).not.toHaveBeenCalled();
    });

    it('should return validation error when target envelope ID is invalid', async () => {
      const invalidRequest: TransferBetweenEnvelopesRequestDto = {
        sourceEnvelopeId: 'envelope-123',
        targetEnvelopeId: '',
        userId: 'user-123',
        budgetId: 'budget-123',
        amount: 100,
      };

      const validationError = new ValidationError(
        'targetEnvelopeId',
        'Target Envelope ID is required and must be a non-empty string'
      );
      spyOn(EnvelopeRequestMapper, 'validateTransferRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockTransferBetweenEnvelopesPort.transferBetweenEnvelopes).not.toHaveBeenCalled();
    });

    it('should return validation error when user ID is invalid', async () => {
      const invalidRequest: TransferBetweenEnvelopesRequestDto = {
        sourceEnvelopeId: 'envelope-123',
        targetEnvelopeId: 'envelope-456',
        userId: '',
        budgetId: 'budget-123',
        amount: 100,
      };

      const validationError = new ValidationError(
        'userId',
        'User ID is required and must be a non-empty string'
      );
      spyOn(EnvelopeRequestMapper, 'validateTransferRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockTransferBetweenEnvelopesPort.transferBetweenEnvelopes).not.toHaveBeenCalled();
    });

    it('should return validation error when budget ID is invalid', async () => {
      const invalidRequest: TransferBetweenEnvelopesRequestDto = {
        sourceEnvelopeId: 'envelope-123',
        targetEnvelopeId: 'envelope-456',
        userId: 'user-123',
        budgetId: '',
        amount: 100,
      };

      const validationError = new ValidationError(
        'budgetId',
        'Budget ID is required and must be a non-empty string'
      );
      spyOn(EnvelopeRequestMapper, 'validateTransferRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockTransferBetweenEnvelopesPort.transferBetweenEnvelopes).not.toHaveBeenCalled();
    });

    it('should return validation error when amount is invalid', async () => {
      const invalidRequest: TransferBetweenEnvelopesRequestDto = {
        sourceEnvelopeId: 'envelope-123',
        targetEnvelopeId: 'envelope-456',
        userId: 'user-123',
        budgetId: 'budget-123',
        amount: -100,
      };

      const validationError = new ValidationError(
        'amount',
        'Amount is required and must be a positive number'
      );
      spyOn(EnvelopeRequestMapper, 'validateTransferRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockTransferBetweenEnvelopesPort.transferBetweenEnvelopes).not.toHaveBeenCalled();
    });

    it('should return validation error when request DTO is null', async () => {
      const validationError = new ValidationError('dto', 'Request DTO is required');
      spyOn(EnvelopeRequestMapper, 'validateTransferRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(null as any);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockTransferBetweenEnvelopesPort.transferBetweenEnvelopes).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: TransferBetweenEnvelopesRequestDto = {
        sourceEnvelopeId: 'envelope-123',
        targetEnvelopeId: 'envelope-456',
        userId: 'user-123',
        budgetId: 'budget-123',
        amount: 100,
      };

      spyOn(EnvelopeRequestMapper, 'validateTransferRequest').and.returnValue(Either.success(true));
      spyOn(EnvelopeRequestMapper, 'normalizeTransferRequest').and.returnValue(validRequest);
      const networkError = new NetworkError('transferBetweenEnvelopes', 'Connection failed');
      mockTransferBetweenEnvelopesPort.transferBetweenEnvelopes.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: TransferBetweenEnvelopesRequestDto = {
        sourceEnvelopeId: 'envelope-123',
        targetEnvelopeId: 'envelope-456',
        userId: 'user-123',
        budgetId: 'budget-123',
        amount: 100,
      };

      spyOn(EnvelopeRequestMapper, 'validateTransferRequest').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
