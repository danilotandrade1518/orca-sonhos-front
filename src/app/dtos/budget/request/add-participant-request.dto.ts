import { BaseRequestDto } from '@dtos/common';

export interface AddParticipantRequestDto extends BaseRequestDto {
  userId: string;
  budgetId: string;
  participantId: string;
}
