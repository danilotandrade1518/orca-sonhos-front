import { Uuid } from '@models/shared/value-objects/Uuid';

export interface ListBudgetsQuery {
  userId: Uuid;
}

export interface BudgetListItem {
  id: string;
  name: string;
  type: string;
  participantsCount: number;
}

export interface BudgetOverviewQuery {
  budgetId: Uuid;
  userId: Uuid;
}

export interface BudgetOverviewResult {
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

export interface IBudgetQueriesPort {
  listBudgets(q: ListBudgetsQuery): Promise<BudgetListItem[]>;
  getBudgetOverview(q: BudgetOverviewQuery): Promise<BudgetOverviewResult>;
}
