export interface CreditCardBillDto {
  id: string;
  creditCardId: string;
  closingDate: string;
  dueDate: string;
  amount: number;
  paid: boolean;
}
