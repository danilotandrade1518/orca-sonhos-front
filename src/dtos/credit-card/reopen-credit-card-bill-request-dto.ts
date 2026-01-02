export interface ReopenCreditCardBillRequestDto {
  creditCardBillId: string;
  userId: string;
  budgetId: string;
  justification: string;
}

export interface ReopenCreditCardBillResponseDto {
  id?: string;
  success?: boolean;
}
