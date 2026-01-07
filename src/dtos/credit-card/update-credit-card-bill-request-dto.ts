export interface UpdateCreditCardBillRequestDto {
  id: string;
  closingDate: string;
  dueDate: string;
  amount: number;
}

export interface UpdateCreditCardBillResponseDto {
  id?: string;
  success?: boolean;
}
