import { AccountType } from '@models/shared/enums/account-type';
import { MoneyDto } from '../../shared/money.dto';

export interface GetAccountByIdQueryResponseDto {
  account: AccountDetailDto;
}

export interface AccountDetailDto {
  id: string;
  name: string;
  type: AccountType;
  balance: MoneyDto;
  budgetId: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  transactionCount: number;
  lastTransactionDate?: string;
}
