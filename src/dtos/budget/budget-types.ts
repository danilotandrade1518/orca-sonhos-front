export type BudgetType = 'PERSONAL' | 'SHARED';

export type AccountType =
  | 'CHECKING_ACCOUNT'
  | 'SAVINGS_ACCOUNT'
  | 'PHYSICAL_WALLET'
  | 'DIGITAL_WALLET'
  | 'INVESTMENT_ACCOUNT';

export interface BudgetParticipantDto {
  id: string;
  name: string;
  email: string;
}

export interface BudgetTotalsDto {
  accountsBalance: number;
  monthIncome: number;
  monthExpense: number;
  netMonth: number;
}

export interface AccountDto {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
}

export interface BudgetDto {
  id: string;
  name: string;
  type: BudgetType;
  participantsCount: number;
}

export interface BudgetOverviewDto {
  id: string;
  name: string;
  type: BudgetType;
  participants: BudgetParticipantDto[];
  totals: BudgetTotalsDto;
  accounts: AccountDto[];
}
