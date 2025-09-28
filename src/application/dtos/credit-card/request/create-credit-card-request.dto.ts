export interface CreateCreditCardRequestDto {
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  budgetId: string;
  brand?: string;
  lastFourDigits?: string;
}
