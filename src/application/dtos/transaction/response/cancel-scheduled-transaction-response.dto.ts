export interface CancelScheduledTransactionResponseDto {
  transactionId: string;
  cancellationReason: string;
  cancelledAt: string;
}
