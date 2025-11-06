export interface CreateCreditCardRequestDto {
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  budgetId: string;
}

export interface CreateCreditCardResponseDto {
  id: string;
}
