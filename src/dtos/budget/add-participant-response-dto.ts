export interface AddParticipantResponseDto {
  /**
   * Compatibilidade:
   * - Back-end real (DefaultResponseBuilder): `{ id, traceId }`
   * - MSW/Mock legado: `{ success, participantId }`
   */
  id?: string;
  traceId?: string;
  success?: boolean;
  participantId?: string;
}
