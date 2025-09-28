export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export const TransactionTypeValues = Object.values(TransactionType);

export const TransactionTypeLabels: Record<TransactionType, string> = {
  [TransactionType.INCOME]: 'Receita',
  [TransactionType.EXPENSE]: 'Despesa',
};

export function isValidTransactionType(value: string): value is TransactionType {
  return TransactionTypeValues.includes(value as TransactionType);
}

export function getTransactionTypeLabel(type: TransactionType): string {
  return TransactionTypeLabels[type];
}
