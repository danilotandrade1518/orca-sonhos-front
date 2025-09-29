import { CreateEnvelopeUseCase } from './create-envelope-use-case';
import { ICreateEnvelopePort } from '../../../ports/envelope/create-envelope.port';
import { CreateEnvelopeRequestDto } from '../../../dtos/envelope/request/create-envelope-request.dto';
import { Either } from '../../../../shared/core/either/either';
import { ValidationError } from '../../../errors/validation-error';
import { NetworkError } from '../../../errors/network-error';
import { UnexpectedError } from '../../../errors/unexpected-error';
import { EnvelopeRequestMapper } from '../../../mappers/envelope/envelope-request-mapper/envelope-request-mapper';

describe('CreateEnvelopeUseCase', () => {
  let useCase: CreateEnvelopeUseCase;
  let mockCreateEnvelopePort: jasmine.SpyObj<ICreateEnvelopePort>;

  beforeEach(() => {
    mockCreateEnvelopePort = jasmine.createSpyObj('ICreateEnvelopePort', ['createEnvelope']);
    useCase = new CreateEnvelopeUseCase(mockCreateEnvelopePort);
  });

  describe('execute', () => {
    it('should create envelope successfully via HTTP', async () => {
      const validRequest: CreateEnvelopeRequestDto = {
        name: 'Test Envelope',
        monthlyLimit: 1000,
        budgetId: 'budget-123',
        categoryId: 'category-123',
        userId: 'user-123',
        description: 'Test envelope description',
      };

      const mockEnvelope = {
        id: 'envelope-123',
        name: 'Test Envelope',
        limitInCents: 100000,
        currentBalanceInCents: 0,
        budgetId: 'budget-123',
        categoryId: 'category-123',
        description: 'Test envelope description',
        createdAt: new Date(),
      };

      spyOn(EnvelopeRequestMapper, 'fromCreateRequestToEnvelope').and.returnValue(
        Either.success(mockEnvelope as any)
      );
      const mockBackendResponse = { id: 'envelope-123' };
      mockCreateEnvelopePort.createEnvelope.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(EnvelopeRequestMapper.fromCreateRequestToEnvelope).toHaveBeenCalledWith(validRequest);
      expect(mockCreateEnvelopePort.createEnvelope).toHaveBeenCalledWith(validRequest);
    });

    it('should return validation error when envelope data is invalid', async () => {
      const invalidRequest: CreateEnvelopeRequestDto = {
        name: '',
        monthlyLimit: -100,
        budgetId: '',
        categoryId: '',
        userId: '',
        description: '',
      };

      const validationError = new ValidationError('name', 'Name is required');
      spyOn(EnvelopeRequestMapper, 'fromCreateRequestToEnvelope').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockCreateEnvelopePort.createEnvelope).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: CreateEnvelopeRequestDto = {
        name: 'Test Envelope',
        monthlyLimit: 1000,
        budgetId: 'budget-123',
        categoryId: 'category-123',
        userId: 'user-123',
        description: 'Test envelope description',
      };

      const mockEnvelope = {
        id: 'envelope-123',
        name: 'Test Envelope',
        limitInCents: 100000,
        currentBalanceInCents: 0,
        budgetId: 'budget-123',
        categoryId: 'category-123',
        description: 'Test envelope description',
        createdAt: new Date(),
      };

      spyOn(EnvelopeRequestMapper, 'fromCreateRequestToEnvelope').and.returnValue(
        Either.success(mockEnvelope as any)
      );
      const networkError = new NetworkError('createEnvelope', 'Connection failed');
      mockCreateEnvelopePort.createEnvelope.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: CreateEnvelopeRequestDto = {
        name: 'Test Envelope',
        monthlyLimit: 1000,
        budgetId: 'budget-123',
        categoryId: 'category-123',
        userId: 'user-123',
        description: 'Test envelope description',
      };

      spyOn(EnvelopeRequestMapper, 'fromCreateRequestToEnvelope').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
