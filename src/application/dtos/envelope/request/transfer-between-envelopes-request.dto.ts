export interface TransferBetweenEnvelopesRequestDto {
  sourceEnvelopeId: string;
  targetEnvelopeId: string;
  userId: string;
  budgetId: string;
  amount: number;
}
