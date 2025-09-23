export interface AddParticipantRequestDto {
  budgetId: string;
  participantId: string;
  requesterId: string;
}

export interface RemoveParticipantRequestDto {
  budgetId: string;
  participantId: string;
  requesterId: string;
}