export interface RemoveParticipantResponseDto {
  /**
   * Compatibilidade:
   * - Back-end real (DefaultResponseBuilder): `{ id, traceId }`
   * - MSW/Mock legado: `{ success }`
   */
  id?: string;
  traceId?: string;
  success?: boolean;
}
