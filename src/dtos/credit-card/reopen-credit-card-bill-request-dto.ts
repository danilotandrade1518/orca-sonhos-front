export interface ReopenCreditCardBillRequestDto {
  creditCardBillId: string;
  userId: string;
  budgetId: string;
  justification: string;
}

export interface ReopenCreditCardBillResponseDto {
  success: boolean;
}
