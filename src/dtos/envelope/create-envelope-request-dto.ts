export interface CreateEnvelopeRequestDto {
  budgetId: string;
  categoryId: string;
  name: string;
  limit: number;
}

export interface CreateEnvelopeResponseDto {
  id: string;
}

