export interface RemoveParticipantRequestDto {
  readonly userId: string;
  readonly budgetId: string;
  readonly participantId: string;
}

export class RemoveParticipantRequestDtoHelper {
  static isValid(dto: unknown): dto is RemoveParticipantRequestDto {
    if (typeof dto !== 'object' || dto === null) {
      return false;
    }

    const obj = dto as Record<string, unknown>;

    return (
      typeof obj['userId'] === 'string' &&
      obj['userId'].length > 0 &&
      typeof obj['budgetId'] === 'string' &&
      obj['budgetId'].length > 0 &&
      typeof obj['participantId'] === 'string' &&
      obj['participantId'].length > 0
    );
  }

  static create(data: {
    userId: string;
    budgetId: string;
    participantId: string;
  }): RemoveParticipantRequestDto {
    return {
      userId: data.userId,
      budgetId: data.budgetId,
      participantId: data.participantId,
    };
  }

  static validateUserId(userId: string): boolean {
    return typeof userId === 'string' && userId.length > 0;
  }

  static validateBudgetId(budgetId: string): boolean {
    return typeof budgetId === 'string' && budgetId.length > 0;
  }

  static validateParticipantId(participantId: string): boolean {
    return typeof participantId === 'string' && participantId.length > 0;
  }

  static isSelfRemoval(dto: RemoveParticipantRequestDto): boolean {
    return dto.userId === dto.participantId;
  }
}
