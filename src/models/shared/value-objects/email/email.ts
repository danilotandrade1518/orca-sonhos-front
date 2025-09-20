import { Either } from '@either';

export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value.toLowerCase();
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

  static create(value: string): Either<string, Email> {
    if (typeof value !== 'string') {
      return Either.error('Email must be a string');
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
      return Either.error('Email cannot be empty');
    }

    if (!Email.isValidEmail(trimmedValue)) {
      return Either.error('Invalid email format');
    }

    return Either.success(new Email(trimmedValue));
  }

  static fromJSON(json: { value: string }): Either<string, Email> {
    return Email.create(json.value);
  }

  private static isValidEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }
}