import { BaseEntityDto, BudgetType } from '@dtos/shared';

export interface BudgetResponseDto extends BaseEntityDto {
  readonly name: string;
  readonly description?: string;
  readonly type: BudgetType;
  readonly ownerId: string;
  readonly participantIds: string[];
  readonly isActive: boolean;
}

export class BudgetResponseDtoHelper {
  static isValid(dto: unknown): dto is BudgetResponseDto {
    if (typeof dto !== 'object' || dto === null) {
      return false;
    }

    const obj = dto as Record<string, unknown>;

    return (
      typeof obj['id'] === 'string' &&
      obj['id'].length > 0 &&
      typeof obj['createdAt'] === 'string' &&
      typeof obj['updatedAt'] === 'string' &&
      typeof obj['name'] === 'string' &&
      obj['name'].length > 0 &&
      (obj['description'] === undefined || typeof obj['description'] === 'string') &&
      typeof obj['type'] === 'string' &&
      ['PERSONAL', 'SHARED'].includes(obj['type']) &&
      typeof obj['ownerId'] === 'string' &&
      obj['ownerId'].length > 0 &&
      Array.isArray(obj['participantIds']) &&
      obj['participantIds'].every((id) => typeof id === 'string') &&
      typeof obj['isActive'] === 'boolean'
    );
  }

  static create(data: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    description?: string;
    type: BudgetType;
    ownerId: string;
    participantIds: string[];
    isActive: boolean;
  }): BudgetResponseDto {
    return {
      id: data.id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      name: data.name,
      description: data.description,
      type: data.type,
      ownerId: data.ownerId,
      participantIds: data.participantIds,
      isActive: data.isActive,
    };
  }

  static isOwner(dto: BudgetResponseDto, userId: string): boolean {
    return dto.ownerId === userId;
  }

  static isParticipant(dto: BudgetResponseDto, userId: string): boolean {
    return dto.participantIds.includes(userId);
  }

  static hasAccess(dto: BudgetResponseDto, userId: string): boolean {
    return this.isOwner(dto, userId) || this.isParticipant(dto, userId);
  }

  static getParticipantCount(dto: BudgetResponseDto): number {
    return dto.participantIds.length;
  }

  static isShared(dto: BudgetResponseDto): boolean {
    return dto.type === 'SHARED';
  }

  static isPersonal(dto: BudgetResponseDto): boolean {
    return dto.type === 'PERSONAL';
  }
}
