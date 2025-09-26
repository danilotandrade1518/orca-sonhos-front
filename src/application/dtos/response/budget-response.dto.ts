/**
 * DTO for budget response data
 */
export interface BudgetResponseDto {
  id: string;
  name: string;
  limit: {
    valueInCents: number;
    valueInMonetary: number;
    formatted: string;
  };
  ownerId: string;
  participantIds: string[];
  description: string;
  isActive: boolean;
  createdAt: string;
}