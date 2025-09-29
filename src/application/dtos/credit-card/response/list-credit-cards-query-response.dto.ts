import { MoneyDto } from '../../shared/money.dto';

export interface ListCreditCardsQueryResponseDto {
  creditCards: CreditCardSummaryDto[];
}

export interface CreditCardSummaryDto {
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
}
