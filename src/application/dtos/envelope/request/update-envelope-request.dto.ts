export interface UpdateEnvelopeRequestDto {
  envelopeId: string;
  userId: string;
  budgetId: string;
  name?: string;
  monthlyLimit?: number;
}
