export interface CreateEnvelopeRequestDto {
  name: string;
  monthlyLimit: number;
  budgetId: string;
  categoryId: string;
  userId: string;
  description?: string;
}
