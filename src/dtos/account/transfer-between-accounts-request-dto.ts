export interface TransferBetweenAccountsRequestDto {
  userId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
}

export interface TransferBetweenAccountsResponseDto {
  success: boolean;
}
