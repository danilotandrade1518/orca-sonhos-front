import { MoneyDto } from '../../shared/money.dto';

export interface ListEnvelopesQueryResponseDto {
  envelopes: EnvelopeSummaryDto[];
}

export interface EnvelopeSummaryDto {
  id: string;
  name: string;
  limit: MoneyDto;
  currentBalance: MoneyDto;
  categoryId: string;
  budgetId: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  remainingAmount: MoneyDto;
  usagePercentage: number;
  status: string;
}
