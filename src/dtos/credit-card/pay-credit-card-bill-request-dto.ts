export interface PayCreditCardBillRequestDto {
  creditCardBillId: string;
  accountId: string;
  userId: string;
  budgetId: string;
  amount: number;
  paymentCategoryId: string;
}

export interface PayCreditCardBillResponseDto {
  success: boolean;
}

