export type AccountType =
  | 'checking'
  | 'savings'
  | 'cash'
  | 'digital_wallet'
  | 'credit_card'
  | 'investment'
  | 'other';

export class AccountTypeHelper {
  static readonly ALL_TYPES: readonly AccountType[] = [
    'checking',
    'savings',
    'cash',
    'digital_wallet',
    'credit_card',
    'investment',
    'other',
  ] as const;

  static isValid(value: unknown): value is AccountType {
    return typeof value === 'string' && this.ALL_TYPES.includes(value as AccountType);
  }

  static getLabel(type: AccountType): string {
    switch (type) {
      case 'checking':
        return 'Conta Corrente';
      case 'savings':
        return 'Poupança';
      case 'cash':
        return 'Dinheiro';
      case 'digital_wallet':
        return 'Carteira Digital';
      case 'credit_card':
        return 'Cartão de Crédito';
      case 'investment':
        return 'Investimento';
      case 'other':
        return 'Outro';
      default:
        return 'Desconhecido';
    }
  }

  static getLabelEn(type: AccountType): string {
    switch (type) {
      case 'checking':
        return 'Checking Account';
      case 'savings':
        return 'Savings Account';
      case 'cash':
        return 'Cash';
      case 'digital_wallet':
        return 'Digital Wallet';
      case 'credit_card':
        return 'Credit Card';
      case 'investment':
        return 'Investment';
      case 'other':
        return 'Other';
      default:
        return 'Unknown';
    }
  }

  static getIcon(type: AccountType): string {
    switch (type) {
      case 'checking':
        return 'account_balance';
      case 'savings':
        return 'savings';
      case 'cash':
        return 'payments';
      case 'digital_wallet':
        return 'account_balance_wallet';
      case 'credit_card':
        return 'credit_card';
      case 'investment':
        return 'trending_up';
      case 'other':
        return 'help_outline';
      default:
        return 'account_balance';
    }
  }

  static getColorClass(type: AccountType): string {
    switch (type) {
      case 'checking':
        return 'text-blue-600';
      case 'savings':
        return 'text-green-600';
      case 'cash':
        return 'text-yellow-600';
      case 'digital_wallet':
        return 'text-purple-600';
      case 'credit_card':
        return 'text-red-600';
      case 'investment':
        return 'text-indigo-600';
      case 'other':
        return 'text-gray-600';
      default:
        return 'text-gray-400';
    }
  }

  static isBankAccount(type: AccountType): boolean {
    return type === 'checking' || type === 'savings';
  }

  static isCreditAccount(type: AccountType): boolean {
    return type === 'credit_card';
  }

  static isCashAccount(type: AccountType): boolean {
    return type === 'cash';
  }

  static isInvestmentAccount(type: AccountType): boolean {
    return type === 'investment';
  }

  static isDigitalAccount(type: AccountType): boolean {
    return type === 'digital_wallet';
  }

  static getBankAccountTypes(): AccountType[] {
    return ['checking', 'savings'];
  }

  static getCreditAccountTypes(): AccountType[] {
    return ['credit_card'];
  }

  static getLiquidAccountTypes(): AccountType[] {
    return ['checking', 'savings', 'cash', 'digital_wallet'];
  }

  static getInvestmentAccountTypes(): AccountType[] {
    return ['investment'];
  }

  static sortForDisplay(types: AccountType[]): AccountType[] {
    const order: Record<AccountType, number> = {
      checking: 1,
      savings: 2,
      cash: 3,
      digital_wallet: 4,
      credit_card: 5,
      investment: 6,
      other: 7,
    };

    return [...types].sort((a, b) => order[a] - order[b]);
  }

  static getPriority(type: AccountType): number {
    switch (type) {
      case 'checking':
        return 1;
      case 'savings':
        return 2;
      case 'cash':
        return 3;
      case 'digital_wallet':
        return 4;
      case 'credit_card':
        return 5;
      case 'investment':
        return 6;
      case 'other':
        return 7;
      default:
        return 999;
    }
  }
}
