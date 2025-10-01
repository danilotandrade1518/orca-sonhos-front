export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export class TransactionTypeHelper {
  static readonly ALL_TYPES: readonly TransactionType[] = [
    'INCOME',
    'EXPENSE',
    'TRANSFER',
  ] as const;

  static isValid(value: unknown): value is TransactionType {
    return typeof value === 'string' && this.ALL_TYPES.includes(value as TransactionType);
  }

  static getLabel(type: TransactionType): string {
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

  static getLabelEn(type: TransactionType): string {
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

  static getIcon(type: TransactionType): string {
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

  static getColorClass(type: TransactionType): string {
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

  static isIncoming(type: TransactionType): boolean {
    return type === 'INCOME';
  }

  static isOutgoing(type: TransactionType): boolean {
    return type === 'EXPENSE';
  }

  static isTransfer(type: TransactionType): boolean {
    return type === 'TRANSFER';
  }

  static getOpposite(type: TransactionType): TransactionType | null {
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

  static getMoneyMovementTypes(): TransactionType[] {
    return ['INCOME', 'EXPENSE'];
  }

  static getNonMoneyMovementTypes(): TransactionType[] {
    return ['TRANSFER'];
  }

  static sortForDisplay(types: TransactionType[]): TransactionType[] {
    const order: Record<TransactionType, number> = {
      INCOME: 1,
      EXPENSE: 2,
      TRANSFER: 3,
    };

    return [...types].sort((a, b) => order[a] - order[b]);
  }
}
