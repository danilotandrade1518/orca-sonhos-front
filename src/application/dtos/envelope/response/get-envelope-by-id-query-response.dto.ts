import { MoneyDto } from '../../shared/money.dto';

export interface GetEnvelopeByIdQueryResponseDto {
  envelope: EnvelopeDetailDto;
}

export interface EnvelopeDetailDto {
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
  isOverLimit: boolean;
  isNearLimit: boolean;
  transactionCount: number;
}
