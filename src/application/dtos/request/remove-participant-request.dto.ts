/**
 * DTO for removing a participant from a budget
 */
export interface RemoveParticipantRequestDto {
  budgetId: string;
  participantId: string;
}