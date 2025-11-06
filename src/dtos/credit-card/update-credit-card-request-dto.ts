export interface UpdateCreditCardRequestDto {
  id: string;
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
}

export interface UpdateCreditCardResponseDto {
  success: boolean;
}

