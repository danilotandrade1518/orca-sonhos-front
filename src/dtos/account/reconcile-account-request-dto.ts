export interface ReconcileAccountRequestDto {
  userId: string;
  budgetId: string;
  accountId: string;
  realBalance: number;
}

export interface ReconcileAccountResponseDto {
  success: boolean;
}
