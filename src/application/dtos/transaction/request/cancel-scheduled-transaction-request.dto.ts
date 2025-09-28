export interface CancelScheduledTransactionRequestDto {
  userId: string;
  budgetId: string;
  transactionId: string;
  cancellationReason: string;
}
