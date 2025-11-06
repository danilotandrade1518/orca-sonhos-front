export interface CreateCreditCardBillRequestDto {
  creditCardId: string;
  closingDate: string;
  dueDate: string;
  amount: number;
}

export interface CreateCreditCardBillResponseDto {
  id: string;
}

