import { MoneyDto } from '../../shared/money.dto';

export interface GetCreditCardByIdQueryResponseDto {
  creditCard: CreditCardDetailDto;
}

export interface CreditCardDetailDto {
  id: string;
  name: string;
  limit: MoneyDto;
  budgetId: string;
  closingDay: number;
  dueDay: number;
  brand: string;
  lastFourDigits: string;
  isActive: boolean;
  createdAt: string;
  currentBalance: MoneyDto;
  availableLimit: MoneyDto;
  nextClosingDate: string;
  nextDueDate: string;
  billCount: number;
}
