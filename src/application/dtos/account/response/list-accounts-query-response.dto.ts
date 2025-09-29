import { AccountType } from '@models/shared/enums/account-type';
import { MoneyDto } from '../../shared/money.dto';

export interface ListAccountsQueryResponseDto {
  accounts: AccountSummaryDto[];
}

export interface AccountSummaryDto {
  id: string;
  name: string;
  type: AccountType;
  balance: MoneyDto;
  description: string;
  isActive: boolean;
  createdAt: string;
}
