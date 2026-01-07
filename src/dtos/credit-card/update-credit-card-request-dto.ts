export interface UpdateCreditCardRequestDto {
  id: string;
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
}

export interface UpdateCreditCardResponseDto {
  id?: string;
  success?: boolean;
}
