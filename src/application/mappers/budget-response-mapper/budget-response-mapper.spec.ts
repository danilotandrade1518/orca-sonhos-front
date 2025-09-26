import { BudgetResponseMapper } from './budget-response-mapper';
import { Budget } from '../../../models/budget';
import { createPaginationMeta } from '../../types';

describe('BudgetResponseMapper', () => {
  let sampleBudget: Budget;

  beforeEach(() => {
    const budgetResult = Budget.create({
      name: 'Test Budget',
      limitInCents: 100000,
      ownerId: 'user-123',
      participantIds: ['user-456', 'user-789'],
      description: 'Test description',
      isActive: true,
    });

    if (budgetResult.hasError) {
      throw new Error('Failed to create test budget');
    }

    sampleBudget = budgetResult.data!;
  });

  describe('fromBudgetToResponse', () => {
    it('should convert Budget to BudgetResponseDto', () => {
      const result = BudgetResponseMapper.fromBudgetToResponse(sampleBudget);

      expect(result).toEqual(sampleBudget.toJSON());
      expect(result.id).toBe(sampleBudget.id);
      expect(result.name).toBe(sampleBudget.name);
      expect(result.ownerId).toBe(sampleBudget.ownerId);
      expect(result.participantIds).toEqual(sampleBudget.participantIds);
      expect(result.description).toBe(sampleBudget.description);
      expect(result.isActive).toBe(sampleBudget.isActive);
    });
  });

  describe('fromBudgetJSONToResponse', () => {
    it('should convert Budget JSON to BudgetResponseDto', () => {
      const budgetJSON = sampleBudget.toJSON();
      const result = BudgetResponseMapper.fromBudgetJSONToResponse(budgetJSON);

      expect(result).toEqual(budgetJSON);
    });
  });

  describe('fromBudgetsToListResponse', () => {
    it('should convert array of Budgets to BudgetListResponseDto', () => {
      const budgets = [sampleBudget];
      const pagination = createPaginationMeta(
        { page: 1, limit: 10, offset: 0 },
        1
      );

      const result = BudgetResponseMapper.fromBudgetsToListResponse(budgets, pagination);

      expect(result.data.length).toBe(1);
      expect(result.data[0]).toEqual(sampleBudget.toJSON());
      expect(result.pagination).toEqual(pagination);
    });

    it('should handle empty array', () => {
      const budgets: Budget[] = [];
      const pagination = createPaginationMeta(
        { page: 1, limit: 10, offset: 0 },
        0
      );

      const result = BudgetResponseMapper.fromBudgetsToListResponse(budgets, pagination);

      expect(result.data.length).toBe(0);
      expect(result.pagination).toEqual(pagination);
    });
  });

  describe('fromBudgetToOverviewResponse', () => {
    it('should convert Budget to BudgetOverviewResponseDto for owner', () => {
      const userId = 'user-123'; // Owner
      const result = BudgetResponseMapper.fromBudgetToOverviewResponse(sampleBudget, userId);

      expect(result).toEqual({
        ...sampleBudget.toJSON(),
        participantCount: sampleBudget.getParticipantCount(),
        isOwner: true,
        hasParticipant: true,
      });
    });

    it('should convert Budget to BudgetOverviewResponseDto for participant', () => {
      const userId = 'user-456'; // Participant
      const result = BudgetResponseMapper.fromBudgetToOverviewResponse(sampleBudget, userId);

      expect(result).toEqual({
        ...sampleBudget.toJSON(),
        participantCount: sampleBudget.getParticipantCount(),
        isOwner: false,
        hasParticipant: true,
      });
    });

    it('should convert Budget to BudgetOverviewResponseDto for non-participant', () => {
      const userId = 'user-999'; // Not a participant
      const result = BudgetResponseMapper.fromBudgetToOverviewResponse(sampleBudget, userId);

      expect(result).toEqual({
        ...sampleBudget.toJSON(),
        participantCount: sampleBudget.getParticipantCount(),
        isOwner: false,
        hasParticipant: false,
      });
    });
  });

  describe('fromBudgetJSONToOverviewResponse', () => {
    it('should convert Budget JSON to BudgetOverviewResponseDto', () => {
      const budgetJSON = sampleBudget.toJSON();
      const userId = 'user-123';
      const participantCount = 3;

      const result = BudgetResponseMapper.fromBudgetJSONToOverviewResponse(
        budgetJSON,
        userId,
        participantCount
      );

      expect(result).toEqual({
        ...budgetJSON,
        participantCount,
        isOwner: true,
        hasParticipant: true,
      });
    });
  });
});