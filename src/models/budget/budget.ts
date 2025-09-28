import { Either } from '@either';
import { Money } from '../shared/value-objects/money';
import { Uuid } from '../shared/value-objects/uuid';

export interface BudgetProps {
  name: string;
  limitInCents: number;
  ownerId: string;
  participantIds?: string[];
  description?: string;
  isActive?: boolean;
}

export class Budget {
  private readonly _id: Uuid;
  private readonly _name: string;
  private readonly _limit: Money;
  private readonly _ownerId: string;
  private readonly _participantIds: string[];
  private readonly _description: string;
  private readonly _isActive: boolean;
  private readonly _createdAt: Date;

  private constructor(
    id: Uuid,
    name: string,
    limit: Money,
    ownerId: string,
    participantIds: string[] = [],
    description: string = '',
    isActive: boolean = true,
    createdAt: Date = new Date(),
  ) {
    this._id = id;
    this._name = name;
    this._limit = limit;
    this._ownerId = ownerId;
    this._participantIds = participantIds;
    this._description = description;
    this._isActive = isActive;
    this._createdAt = createdAt;
  }

  get id(): string {
    return this._id.value;
  }

  get name(): string {
    return this._name;
  }

  get limit(): Money {
    return this._limit;
  }

  get ownerId(): string {
    return this._ownerId;
  }

  get participantIds(): string[] {
    return [...this._participantIds];
  }

  get description(): string {
    return this._description;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  hasParticipant(userId: string): boolean {
    return this._participantIds.includes(userId) || this._ownerId === userId;
  }

  isOwner(userId: string): boolean {
    return this._ownerId === userId;
  }

  getParticipantCount(): number {
    return this._participantIds.length + 1; // +1 for owner
  }

  formatLimit(): string {
    return this._limit.formatBRL();
  }

  toJSON(): {
    id: string;
    name: string;
    limit: { valueInCents: number; valueInMonetary: number; formatted: string };
    ownerId: string;
    participantIds: string[];
    description: string;
    isActive: boolean;
    createdAt: string;
  } {
    return {
      id: this._id.value,
      name: this._name,
      limit: this._limit.toJSON(),
      ownerId: this._ownerId,
      participantIds: [...this._participantIds],
      description: this._description,
      isActive: this._isActive,
      createdAt: this._createdAt.toISOString(),
    };
  }

  static create(props: BudgetProps): Either<string, Budget> {
    const nameValidation = Budget.validateName(props.name);
    if (nameValidation.hasError) {
      return Either.errors(nameValidation.errors);
    }

    const limitResult = Money.fromCents(props.limitInCents);
    if (limitResult.hasError) {
      return Either.error(`Invalid limit: ${limitResult.errors.join(', ')}`);
    }

    const ownerIdValidation = Budget.validateOwnerId(props.ownerId);
    if (ownerIdValidation.hasError) {
      return Either.errors(ownerIdValidation.errors);
    }

    if (props.participantIds) {
      const participantsValidation = Budget.validateParticipantIds(props.participantIds);
      if (participantsValidation.hasError) {
        return Either.errors(participantsValidation.errors);
      }
    }

    const id = Uuid.generate();
    const limit = limitResult.data!;
    const participantIds = props.participantIds || [];
    const description = props.description || '';
    const isActive = props.isActive !== undefined ? props.isActive : true;

    return Either.success(
      new Budget(id, props.name, limit, props.ownerId, participantIds, description, isActive),
    );
  }

  static fromJSON(json: {
    id: string;
    name: string;
    limit: { valueInCents: number };
    ownerId: string;
    participantIds: string[];
    description: string;
    isActive: boolean;
    createdAt: string;
  }): Either<string, Budget> {
    const idResult = Uuid.create(json.id);
    if (idResult.hasError) {
      return Either.error(`Invalid id: ${idResult.errors.join(', ')}`);
    }

    const limitResult = Money.fromJSON(json.limit);
    if (limitResult.hasError) {
      return Either.error(`Invalid limit: ${limitResult.errors.join(', ')}`);
    }

    const nameValidation = Budget.validateName(json.name);
    if (nameValidation.hasError) {
      return Either.errors(nameValidation.errors);
    }

    const ownerIdValidation = Budget.validateOwnerId(json.ownerId);
    if (ownerIdValidation.hasError) {
      return Either.errors(ownerIdValidation.errors);
    }

    const participantsValidation = Budget.validateParticipantIds(json.participantIds);
    if (participantsValidation.hasError) {
      return Either.errors(participantsValidation.errors);
    }

    const createdAt = new Date(json.createdAt);

    return Either.success(
      new Budget(
        idResult.data!,
        json.name,
        limitResult.data!,
        json.ownerId,
        json.participantIds,
        json.description,
        json.isActive,
        createdAt,
      ),
    );
  }

  private static validateName(name: string): Either<string, void> {
    if (typeof name !== 'string') {
      return Either.error('Name must be a string');
    }

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      return Either.error('Name cannot be empty');
    }

    if (trimmedName.length > 100) {
      return Either.error('Name cannot exceed 100 characters');
    }

    return Either.success(undefined);
  }

  private static validateOwnerId(ownerId: string): Either<string, void> {
    if (typeof ownerId !== 'string') {
      return Either.error('Owner ID must be a string');
    }

    if (ownerId.trim().length === 0) {
      return Either.error('Owner ID cannot be empty');
    }

    return Either.success(undefined);
  }

  private static validateParticipantIds(participantIds: string[]): Either<string, void> {
    if (!Array.isArray(participantIds)) {
      return Either.error('Participant IDs must be an array');
    }

    for (const participantId of participantIds) {
      if (typeof participantId !== 'string' || participantId.trim().length === 0) {
        return Either.error('All participant IDs must be non-empty strings');
      }
    }

    return Either.success(undefined);
  }
}
