export interface UpdateEnvelopeRequestDto {
  envelopeId: string;
  budgetId: string;
  name?: string;
  limit?: number;
}

export interface UpdateEnvelopeResponseDto {
  success: boolean;
}

