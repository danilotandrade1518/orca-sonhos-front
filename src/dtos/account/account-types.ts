export type AccountType =
  | 'CHECKING_ACCOUNT'
  | 'SAVINGS_ACCOUNT'
  | 'PHYSICAL_WALLET'
  | 'DIGITAL_WALLET'
  | 'INVESTMENT_ACCOUNT'
  | 'OTHER';

export interface AccountDto {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
}
