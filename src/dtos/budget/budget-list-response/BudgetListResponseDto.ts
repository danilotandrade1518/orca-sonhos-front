import { BudgetResponseDto, BudgetResponseDtoHelper } from '../budget-response/BudgetResponseDto';

export interface BudgetListResponseDto {
  readonly budgets: BudgetResponseDto[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export class BudgetListResponseDtoHelper {
  static isValid(dto: unknown): dto is BudgetListResponseDto {
    if (typeof dto !== 'object' || dto === null) {
      return false;
    }

    const obj = dto as Record<string, unknown>;

    return (
      Array.isArray(obj['budgets']) &&
      obj['budgets'].every((budget) => BudgetResponseDtoHelper.isValid(budget)) &&
      typeof obj['total'] === 'number' &&
      obj['total'] >= 0 &&
      typeof obj['page'] === 'number' &&
      obj['page'] >= 1 &&
      typeof obj['pageSize'] === 'number' &&
      obj['pageSize'] > 0
    );
  }

  static create(data: {
    budgets: BudgetResponseDto[];
    total: number;
    page: number;
    pageSize: number;
  }): BudgetListResponseDto {
    return {
      budgets: data.budgets,
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
    };
  }

  static getTotalPages(dto: BudgetListResponseDto): number {
    return Math.ceil(dto.total / dto.pageSize);
  }

  static hasNextPage(dto: BudgetListResponseDto): boolean {
    return dto.page < this.getTotalPages(dto);
  }

  static hasPreviousPage(dto: BudgetListResponseDto): boolean {
    return dto.page > 1;
  }

  static isEmpty(dto: BudgetListResponseDto): boolean {
    return dto.budgets.length === 0;
  }

  static getActiveBudgets(dto: BudgetListResponseDto): BudgetResponseDto[] {
    return dto.budgets.filter((budget) => budget.isActive);
  }

  static getPersonalBudgets(dto: BudgetListResponseDto): BudgetResponseDto[] {
    return dto.budgets.filter((budget) => budget.type === 'PERSONAL');
  }

  static getSharedBudgets(dto: BudgetListResponseDto): BudgetResponseDto[] {
    return dto.budgets.filter((budget) => budget.type === 'SHARED');
  }

  static getBudgetsByOwner(dto: BudgetListResponseDto, ownerId: string): BudgetResponseDto[] {
    return dto.budgets.filter((budget) => budget.ownerId === ownerId);
  }

  static getBudgetsByParticipant(
    dto: BudgetListResponseDto,
    participantId: string
  ): BudgetResponseDto[] {
    return dto.budgets.filter((budget) => budget.participantIds.includes(participantId));
  }
}
