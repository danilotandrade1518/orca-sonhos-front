import { AccountType } from '@models/shared/enums/account-type';

export interface CreateAccountRequestDto {
  userId: string;
  name: string;
  type: AccountType;
  budgetId: string;
  initialBalance?: number;
  description?: string;
}
