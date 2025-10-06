import { PaginatedResponseDto } from '../../common';
import { GoalResponseDto } from './goal-response.dto';

/**
 * DTO for goal list response
 */
export interface GoalListResponseDto extends PaginatedResponseDto<GoalResponseDto> {
  readonly _type: 'goal-list';
}

/**
 * DTO for goal summary response
 */
export interface GoalSummaryResponseDto {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  totalTargetAmount: number;
  totalCurrentAmount: number;
  totalRemainingAmount: number;
  averageProgress: number;
}
