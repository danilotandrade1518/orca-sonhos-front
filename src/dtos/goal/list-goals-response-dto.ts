import type { GoalDto } from './goal-types/goal-types';

export interface ListGoalsResponseDto {
  data: GoalDto[];
  meta?: {
    count?: number;
  };
}
