import { BaseRequestDto } from '@dtos/common';

export interface RemoveParticipantRequestDto extends BaseRequestDto {
  userId: string;
  budgetId: string;
  participantId: string;
}
