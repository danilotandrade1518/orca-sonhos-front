import type { AccountDto } from './account-types';

export interface ListAccountsResponseDto {
  data: AccountDto[];
  meta: {
    count: number;
  };
}
