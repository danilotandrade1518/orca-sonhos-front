/**
 * DTO for creating a new budget
 */
export interface CreateBudgetRequestDto {
  name: string;
  limitInCents: number;
  ownerId: string;
  participantIds?: string[];
  description?: string;
  isActive?: boolean;
}