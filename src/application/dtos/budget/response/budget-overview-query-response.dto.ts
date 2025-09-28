export interface BudgetOverviewQueryResponseDto {
  id: string;
  name: string;
  type: string;
  participants: { id: string }[];
  totals: {
    accountsBalance: number;
    monthIncome: number;
    monthExpense: number;
    netMonth: number;
  };
  accounts: {
    id: string;
    name: string;
    type: string;
    balance: number;
  }[];
}
