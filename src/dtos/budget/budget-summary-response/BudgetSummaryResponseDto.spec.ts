import {
  BudgetSummaryResponseDto,
  BudgetSummaryResponseDtoHelper,
} from './BudgetSummaryResponseDto';

describe('BudgetSummaryResponseDto', () => {
  const validSummary: BudgetSummaryResponseDto = {
    totalBudgets: 10,
    activeBudgets: 8,
    totalParticipants: 25,
    totalTransactions: 150,
  };

  describe('BudgetSummaryResponseDtoHelper.isValid', () => {
    it('should return true for valid DTO', () => {
      expect(BudgetSummaryResponseDtoHelper.isValid(validSummary)).toBe(true);
    });

    it('should return false for invalid DTO with negative totalBudgets', () => {
      const invalidDto = { ...validSummary, totalBudgets: -1 };

      expect(BudgetSummaryResponseDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for invalid DTO with negative activeBudgets', () => {
      const invalidDto = { ...validSummary, activeBudgets: -1 };

      expect(BudgetSummaryResponseDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for invalid DTO with negative totalParticipants', () => {
      const invalidDto = { ...validSummary, totalParticipants: -1 };

      expect(BudgetSummaryResponseDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for invalid DTO with negative totalTransactions', () => {
      const invalidDto = { ...validSummary, totalTransactions: -1 };

      expect(BudgetSummaryResponseDtoHelper.isValid(invalidDto)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(BudgetSummaryResponseDtoHelper.isValid(null)).toBe(false);
      expect(BudgetSummaryResponseDtoHelper.isValid(undefined)).toBe(false);
    });
  });

  describe('BudgetSummaryResponseDtoHelper.create', () => {
    it('should create DTO correctly', () => {
      const data = {
        totalBudgets: 10,
        activeBudgets: 8,
        totalParticipants: 25,
        totalTransactions: 150,
      };

      const dto = BudgetSummaryResponseDtoHelper.create(data);

      expect(dto).toEqual(data);
    });
  });

  describe('BudgetSummaryResponseDtoHelper calculations', () => {
    it('should calculate inactive budgets correctly', () => {
      expect(BudgetSummaryResponseDtoHelper.getInactiveBudgets(validSummary)).toBe(2);
    });

    it('should calculate active percentage correctly', () => {
      expect(BudgetSummaryResponseDtoHelper.getActivePercentage(validSummary)).toBe(80);
    });

    it('should calculate inactive percentage correctly', () => {
      expect(BudgetSummaryResponseDtoHelper.getInactivePercentage(validSummary)).toBe(20);
    });

    it('should handle zero total budgets', () => {
      const emptySummary = { ...validSummary, totalBudgets: 0, activeBudgets: 0 };
      expect(BudgetSummaryResponseDtoHelper.getActivePercentage(emptySummary)).toBe(0);
      expect(BudgetSummaryResponseDtoHelper.getInactivePercentage(emptySummary)).toBe(0);
    });

    it('should calculate average participants per budget correctly', () => {
      expect(BudgetSummaryResponseDtoHelper.getAverageParticipantsPerBudget(validSummary)).toBe(
        2.5
      );
    });

    it('should calculate average transactions per budget correctly', () => {
      expect(BudgetSummaryResponseDtoHelper.getAverageTransactionsPerBudget(validSummary)).toBe(15);
    });

    it('should handle zero total budgets in averages', () => {
      const emptySummary = { ...validSummary, totalBudgets: 0 };
      expect(BudgetSummaryResponseDtoHelper.getAverageParticipantsPerBudget(emptySummary)).toBe(0);
      expect(BudgetSummaryResponseDtoHelper.getAverageTransactionsPerBudget(emptySummary)).toBe(0);
    });
  });

  describe('BudgetSummaryResponseDtoHelper checks', () => {
    it('should detect active budgets', () => {
      expect(BudgetSummaryResponseDtoHelper.hasActiveBudgets(validSummary)).toBe(true);

      const noActiveSummary = { ...validSummary, activeBudgets: 0 };
      expect(BudgetSummaryResponseDtoHelper.hasActiveBudgets(noActiveSummary)).toBe(false);
    });

    it('should detect participants', () => {
      expect(BudgetSummaryResponseDtoHelper.hasParticipants(validSummary)).toBe(true);

      const noParticipantsSummary = { ...validSummary, totalParticipants: 0 };
      expect(BudgetSummaryResponseDtoHelper.hasParticipants(noParticipantsSummary)).toBe(false);
    });

    it('should detect transactions', () => {
      expect(BudgetSummaryResponseDtoHelper.hasTransactions(validSummary)).toBe(true);

      const noTransactionsSummary = { ...validSummary, totalTransactions: 0 };
      expect(BudgetSummaryResponseDtoHelper.hasTransactions(noTransactionsSummary)).toBe(false);
    });

    it('should detect empty summary', () => {
      const emptySummary = { ...validSummary, totalBudgets: 0 };
      expect(BudgetSummaryResponseDtoHelper.isEmpty(emptySummary)).toBe(true);
      expect(BudgetSummaryResponseDtoHelper.isEmpty(validSummary)).toBe(false);
    });
  });
});
