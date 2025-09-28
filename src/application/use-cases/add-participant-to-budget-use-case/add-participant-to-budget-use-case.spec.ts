import { AddParticipantToBudgetUseCase } from './add-participant-to-budget-use-case';
import { IAddParticipantToBudgetPort } from '../../ports/add-participant-to-budget.port';
import { AddParticipantRequestDto } from '../../dtos/request/add-participant-request.dto';
import { Either } from '../../../shared/core/either/either';
import { ValidationError } from '../../errors/validation-error';
import { NetworkError } from '../../errors/network-error';
import { UnexpectedError } from '../../errors/unexpected-error';
import { BudgetRequestMapper } from '../../mappers/budget-request-mapper/budget-request-mapper';

describe('AddParticipantToBudgetUseCase', () => {
  let useCase: AddParticipantToBudgetUseCase;
  let mockAddParticipantToBudgetPort: jasmine.SpyObj<IAddParticipantToBudgetPort>;

  beforeEach(() => {
    mockAddParticipantToBudgetPort = jasmine.createSpyObj('IAddParticipantToBudgetPort', [
      'addParticipantToBudget',
    ]);
    useCase = new AddParticipantToBudgetUseCase(mockAddParticipantToBudgetPort);
  });

  describe('execute', () => {
    it('should add participant to budget successfully via HTTP', async () => {
      const validRequest: AddParticipantRequestDto = {
        budgetId: 'budget-123',
        participantId: 'participant-456',
        requesterId: 'user-123',
      };

      spyOn(BudgetRequestMapper, 'validateParticipantRequest').and.returnValue(
        Either.success(true),
      );
      const mockBackendResponse = { id: 'budget-123' };
      mockAddParticipantToBudgetPort.addParticipantToBudget.and.returnValue(
        Promise.resolve(Either.success(mockBackendResponse)),
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(false);
      expect(result.data).toEqual(mockBackendResponse);
      expect(BudgetRequestMapper.validateParticipantRequest).toHaveBeenCalledWith(validRequest);
      expect(mockAddParticipantToBudgetPort.addParticipantToBudget).toHaveBeenCalledWith(
        validRequest,
      );
    });

    it('should return validation error when request data is invalid', async () => {
      const invalidRequest: AddParticipantRequestDto = {
        budgetId: '',
        participantId: '',
        requesterId: '',
      };

      const validationError = new ValidationError('budgetId', 'Budget ID is required');
      spyOn(BudgetRequestMapper, 'validateParticipantRequest').and.returnValue(
        Either.error(validationError),
      );

      const result = await useCase.execute(invalidRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(validationError);
      expect(mockAddParticipantToBudgetPort.addParticipantToBudget).not.toHaveBeenCalled();
    });

    it('should return network error when HTTP port fails', async () => {
      const validRequest: AddParticipantRequestDto = {
        budgetId: 'budget-123',
        participantId: 'participant-456',
        requesterId: 'user-123',
      };

      spyOn(BudgetRequestMapper, 'validateParticipantRequest').and.returnValue(
        Either.success(true),
      );
      const networkError = new NetworkError('addParticipantToBudget', 'Connection failed');
      mockAddParticipantToBudgetPort.addParticipantToBudget.and.returnValue(
        Promise.resolve(Either.error(networkError)),
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors).toContain(networkError);
    });

    it('should handle unexpected errors gracefully', async () => {
      const validRequest: AddParticipantRequestDto = {
        budgetId: 'budget-123',
        participantId: 'participant-456',
        requesterId: 'user-123',
      };

      spyOn(BudgetRequestMapper, 'validateParticipantRequest').and.throwError(
        'Unexpected mapper error',
      );

      const result = await useCase.execute(validRequest);

      expect(result.hasError).toBe(true);
      expect(result.errors[0].message).toContain('Unexpected error during');
    });
  });
});
