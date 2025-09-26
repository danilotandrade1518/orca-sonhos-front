import { BudgetResponseDto } from './budget-response.dto';

/**
 * DTO for budget overview response with additional metadata
 */
export interface BudgetOverviewResponseDto extends BudgetResponseDto {
  participantCount: number;
  isOwner: boolean;
  hasParticipant: boolean;
}