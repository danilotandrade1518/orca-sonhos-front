import { Either } from '@either';

export class Uuid {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  toJSON(): { value: string } {
    return {
      value: this._value,
    };
  }

  static create(value: string): Either<string, Uuid> {
    if (typeof value !== 'string') {
      return Either.error('UUID must be a string');
    }

    if (!Uuid.isValidUuid(value)) {
      return Either.error('Invalid UUID format');
    }

    return Either.success(new Uuid(value));
  }

  static generate(): Uuid {
    const uuid = crypto.randomUUID();
    return new Uuid(uuid);
  }

  static fromJSON(json: { value: string }): Either<string, Uuid> {
    return Uuid.create(json.value);
  }

  private static isValidUuid(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }
}
