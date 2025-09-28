import { RemoveParticipantFromBudgetUseCase } from './remove-participant-from-budget-use-case';
import { IRemoveParticipantFromBudgetPort } from '../../ports/remove-participant-from-budget.port';
import { RemoveParticipantRequestDto } from '../../dtos/request/add-participant-request.dto';
import { Either } from '../../../shared/core/either/either';
import { ValidationError } from '../../errors/validation-error';
import { NetworkError } from '../../errors/network-error';
import { UnexpectedError } from '../../errors/unexpected-error';
import { BudgetRequestMapper } from '../../mappers/budget-request-mapper/budget-request-mapper';

describe('RemoveParticipantFromBudgetUseCase', () => {
  let useCase: RemoveParticipantFromBudgetUseCase;
  let mockRemoveParticipantFromBudgetPort: jasmine.SpyObj<IRemoveParticipantFromBudgetPort>;

  beforeEach(() => {
    mockRemoveParticipantFromBudgetPort = jasmine.createSpyObj('IRemoveParticipantFromBudgetPort', [
      'removeParticipantFromBudget',
    ]);
    useCase = new RemoveParticipantFromBudgetUseCase(mockRemoveParticipantFromBudgetPort);
  });

  describe('execute', () => {
    it('should remove participant from budget successfully via HTTP', async () => {
      const validRequest: RemoveParticipantRequestDto = {
        budgetId: 'budget-123',
        participantId: 'participant-456',
        requesterId: 'user-123',
      };

      spyOn(BudgetRequestMapper, 'validateParticipantRequest').and.returnValue(
        Either.success(true)
      );
      const mockBackendResponse = { id: 'budget-123' };
      mockRemoveParticipantFromBudgetPort.removeParticipantFromBudget.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(BudgetRequestMapper.validateParticipantRequest).toHaveBeenCalledWith(validRequest);
      expect(mockRemoveParticipantFromBudgetPort.removeParticipantFromBudget).toHaveBeenCalledWith(
        validRequest
      );
    });

    it('should return validation error when request data is invalid', async () => {
      const invalidRequest: RemoveParticipantRequestDto = {
        budgetId: '',
        participantId: '',
        requesterId: '',
      };

      const validationError = new ValidationError('budgetId', 'Budget ID is required');
      spyOn(BudgetRequestMapper, 'validateParticipantRequest').and.returnValue(
        Either.error(validationError)
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(
        mockRemoveParticipantFromBudgetPort.removeParticipantFromBudget
      ).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: RemoveParticipantRequestDto = {
        budgetId: 'budget-123',
        participantId: 'participant-456',
        requesterId: 'user-123',
      };

      spyOn(BudgetRequestMapper, 'validateParticipantRequest').and.returnValue(
        Either.success(true)
      );
      const networkError = new NetworkError('removeParticipantFromBudget', 'Connection failed');
      mockRemoveParticipantFromBudgetPort.removeParticipantFromBudget.and.returnValue(
        Promise.resolve(Either.error(networkError))
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: RemoveParticipantRequestDto = {
        budgetId: 'budget-123',
        participantId: 'participant-456',
        requesterId: 'user-123',
      };

      spyOn(BudgetRequestMapper, 'validateParticipantRequest').and.throwError(
        'Unexpected mapper error'
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
