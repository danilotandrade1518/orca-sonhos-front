export interface TransferBetweenAccountsRequestDto {
  userId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
}
