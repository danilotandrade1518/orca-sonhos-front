export interface BudgetSummaryResponseDto {
  readonly totalBudgets: number;
  readonly activeBudgets: number;
  readonly totalParticipants: number;
  readonly totalTransactions: number;
}

export class BudgetSummaryResponseDtoHelper {
  static isValid(dto: unknown): dto is BudgetSummaryResponseDto {
    if (typeof dto !== 'object' || dto === null) {
      return false;
    }

    const obj = dto as Record<string, unknown>;

    return (
      typeof obj['totalBudgets'] === 'number' &&
      obj['totalBudgets'] >= 0 &&
      typeof obj['activeBudgets'] === 'number' &&
      obj['activeBudgets'] >= 0 &&
      typeof obj['totalParticipants'] === 'number' &&
      obj['totalParticipants'] >= 0 &&
      typeof obj['totalTransactions'] === 'number' &&
      obj['totalTransactions'] >= 0
    );
  }

  static create(data: {
    totalBudgets: number;
    activeBudgets: number;
    totalParticipants: number;
    totalTransactions: number;
  }): BudgetSummaryResponseDto {
    return {
      totalBudgets: data.totalBudgets,
      activeBudgets: data.activeBudgets,
      totalParticipants: data.totalParticipants,
      totalTransactions: data.totalTransactions,
    };
  }

  static getInactiveBudgets(dto: BudgetSummaryResponseDto): number {
    return dto.totalBudgets - dto.activeBudgets;
  }

  static getActivePercentage(dto: BudgetSummaryResponseDto): number {
    if (dto.totalBudgets === 0) return 0;
    return Math.round((dto.activeBudgets / dto.totalBudgets) * 100);
  }

  static getInactivePercentage(dto: BudgetSummaryResponseDto): number {
    if (dto.totalBudgets === 0) return 0;
    return Math.round((this.getInactiveBudgets(dto) / dto.totalBudgets) * 100);
  }

  static getAverageParticipantsPerBudget(dto: BudgetSummaryResponseDto): number {
    if (dto.totalBudgets === 0) return 0;
    return Math.round((dto.totalParticipants / dto.totalBudgets) * 100) / 100;
  }

  static getAverageTransactionsPerBudget(dto: BudgetSummaryResponseDto): number {
    if (dto.totalBudgets === 0) return 0;
    return Math.round((dto.totalTransactions / dto.totalBudgets) * 100) / 100;
  }

  static hasActiveBudgets(dto: BudgetSummaryResponseDto): boolean {
    return dto.activeBudgets > 0;
  }

  static hasParticipants(dto: BudgetSummaryResponseDto): boolean {
    return dto.totalParticipants > 0;
  }

  static hasTransactions(dto: BudgetSummaryResponseDto): boolean {
    return dto.totalTransactions > 0;
  }

  static isEmpty(dto: BudgetSummaryResponseDto): boolean {
    return dto.totalBudgets === 0;
  }
}
