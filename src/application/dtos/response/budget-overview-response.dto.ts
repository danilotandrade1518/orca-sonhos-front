import { BudgetResponseDto } from './budget-response.dto';

export interface ParticipantInfoDto {
  id: string;
  name?: string;
  email?: string;
  joinedAt: string;
  isOwner: boolean;
}

export interface BudgetOverviewResponseDto extends BudgetResponseDto {
  participants: ParticipantInfoDto[];
  statistics: {
    totalSpent: {
      valueInCents: number;
      formatted: string;
    };
    remainingLimit: {
      valueInCents: number;
      formatted: string;
    };
    utilizationPercentage: number;
    transactionCount: number;
    lastTransactionAt?: string;
  };
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canAddParticipants: boolean;
    canRemoveParticipants: boolean;
    canViewTransactions: boolean;
  };
}