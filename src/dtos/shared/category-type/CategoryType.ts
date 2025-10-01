export type CategoryType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export class CategoryTypeHelper {
  static readonly ALL_TYPES: readonly CategoryType[] = ['INCOME', 'EXPENSE', 'TRANSFER'] as const;

  static isValid(value: unknown): value is CategoryType {
    return typeof value === 'string' && this.ALL_TYPES.includes(value as CategoryType);
  }

  static getLabel(type: CategoryType): string {
    switch (type) {
      case 'INCOME':
        return 'Receita';
      case 'EXPENSE':
        return 'Despesa';
      case 'TRANSFER':
        return 'Transferência';
      default:
        return 'Desconhecido';
    }
  }

  static getLabelEn(type: CategoryType): string {
    switch (type) {
      case 'INCOME':
        return 'Income';
      case 'EXPENSE':
        return 'Expense';
      case 'TRANSFER':
        return 'Transfer';
      default:
        return 'Unknown';
    }
  }

  static getIcon(type: CategoryType): string {
    switch (type) {
      case 'INCOME':
        return 'trending_up';
      case 'EXPENSE':
        return 'trending_down';
      case 'TRANSFER':
        return 'swap_horiz';
      default:
        return 'help_outline';
    }
  }

  static getColorClass(type: CategoryType): string {
    switch (type) {
      case 'INCOME':
        return 'text-green-600';
      case 'EXPENSE':
        return 'text-red-600';
      case 'TRANSFER':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  }

  static isIncome(type: CategoryType): boolean {
    return type === 'INCOME';
  }

  static isExpense(type: CategoryType): boolean {
    return type === 'EXPENSE';
  }

  static isTransfer(type: CategoryType): boolean {
    return type === 'TRANSFER';
  }

  static getOpposite(type: CategoryType): CategoryType | null {
    switch (type) {
      case 'INCOME':
        return 'EXPENSE';
      case 'EXPENSE':
        return 'INCOME';
      case 'TRANSFER':
        return null;
      default:
        return null;
    }
  }

  static getMoneyMovementTypes(): CategoryType[] {
    return ['INCOME', 'EXPENSE'];
  }

  static getNonMoneyMovementTypes(): CategoryType[] {
    return ['TRANSFER'];
  }

  static sortForDisplay(types: CategoryType[]): CategoryType[] {
    const order: Record<CategoryType, number> = {
      INCOME: 1,
      EXPENSE: 2,
      TRANSFER: 3,
    };

    return [...types].sort((a, b) => order[a] - order[b]);
  }

  static getPriority(type: CategoryType): number {
    switch (type) {
      case 'INCOME':
        return 1;
      case 'EXPENSE':
        return 2;
      case 'TRANSFER':
        return 3;
      default:
        return 999;
    }
  }

  static getDefault(): CategoryType {
    return 'EXPENSE';
  }

  static getBudgetTypes(): CategoryType[] {
    return ['INCOME', 'EXPENSE'];
  }
}
