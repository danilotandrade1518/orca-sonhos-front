export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  INVESTMENT = 'INVESTMENT',
  CASH = 'CASH',
}

export const AccountTypeValues = Object.values(AccountType);

export const AccountTypeLabels: Record<AccountType, string> = {
  [AccountType.CHECKING]: 'Conta Corrente',
  [AccountType.SAVINGS]: 'Poupança',
  [AccountType.INVESTMENT]: 'Investimento',
  [AccountType.CASH]: 'Dinheiro',
};

export function isValidAccountType(value: string): value is AccountType {
  return AccountTypeValues.includes(value as AccountType);
}

export function getAccountTypeLabel(type: AccountType): string {
  return AccountTypeLabels[type];
}