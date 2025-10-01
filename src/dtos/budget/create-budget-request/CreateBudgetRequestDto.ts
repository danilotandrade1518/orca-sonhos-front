import { BudgetType } from '@dtos/shared';

export interface CreateBudgetRequestDto {
  readonly name: string;
  readonly ownerId: string;
  readonly participantIds?: string[];
  readonly type?: BudgetType;
}

export class CreateBudgetRequestDtoHelper {
  static isValid(dto: unknown): dto is CreateBudgetRequestDto {
    if (typeof dto !== 'object' || dto === null) {
      return false;
    }

    const obj = dto as Record<string, unknown>;

    return (
      typeof obj['name'] === 'string' &&
      obj['name'].length > 0 &&
      typeof obj['ownerId'] === 'string' &&
      obj['ownerId'].length > 0 &&
      (obj['participantIds'] === undefined ||
        (Array.isArray(obj['participantIds']) &&
          obj['participantIds'].every((id) => typeof id === 'string'))) &&
      (obj['type'] === undefined ||
        (typeof obj['type'] === 'string' && ['PERSONAL', 'SHARED'].includes(obj['type'])))
    );
  }

  static create(data: {
    name: string;
    ownerId: string;
    participantIds?: string[];
    type?: BudgetType;
  }): CreateBudgetRequestDto {
    return {
      name: data.name,
      ownerId: data.ownerId,
      participantIds: data.participantIds,
      type: data.type,
    };
  }

  static validateName(name: string): boolean {
    return typeof name === 'string' && name.trim().length > 0 && name.length <= 100;
  }

  static validateOwnerId(ownerId: string): boolean {
    return typeof ownerId === 'string' && ownerId.length > 0;
  }

  static validateParticipantIds(participantIds: string[]): boolean {
    return (
      Array.isArray(participantIds) &&
      participantIds.every((id) => typeof id === 'string' && id.length > 0)
    );
  }
}
