export interface UpdateCreditCardRequestDto {
  id: string;
  name?: string;
  limit?: number;
  closingDay?: number;
  dueDay?: number;
  brand?: string;
  lastFourDigits?: string;
}
