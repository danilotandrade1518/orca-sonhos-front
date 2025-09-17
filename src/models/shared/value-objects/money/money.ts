import { Either } from '@either';

export class Money {
  private readonly _valueInCents: number;

  private constructor(valueInCents: number) {
    this._valueInCents = Math.round(valueInCents);
  }

  get valueInCents(): number {
    return this._valueInCents;
  }

  get valueInMonetary(): number {
    return this._valueInCents / 100;
  }

  add(other: Money): Money {
    return new Money(this._valueInCents + other._valueInCents);
  }

  subtract(other: Money): Either<string, Money> {
    const result = this._valueInCents - other._valueInCents;

    if (result < 0) {
      return Either.error('Result cannot be negative');
    }

    return Either.success(new Money(result));
  }

  multiply(multiplier: number): Either<string, Money> {
    if (typeof multiplier !== 'number') {
      return Either.error('Multiplier must be a number');
    }

    if (!Number.isFinite(multiplier)) {
      return Either.error('Multiplier must be a finite number');
    }

    if (multiplier < 0) {
      return Either.error('Multiplier cannot be negative');
    }

    const result = Math.round(this._valueInCents * multiplier);
    return Either.success(new Money(result));
  }

  divide(divisor: number): Either<string, Money> {
    if (typeof divisor !== 'number') {
      return Either.error('Divisor must be a number');
    }

    if (!Number.isFinite(divisor)) {
      return Either.error('Divisor must be a finite number');
    }

    if (divisor <= 0) {
      return Either.error('Divisor must be positive');
    }

    const result = Math.round(this._valueInCents / divisor);
    return Either.success(new Money(result));
  }

  isGreaterThan(other: Money): boolean {
    return this._valueInCents > other._valueInCents;
  }

  isLessThan(other: Money): boolean {
    return this._valueInCents < other._valueInCents;
  }

  isEqualTo(other: Money): boolean {
    return this._valueInCents === other._valueInCents;
  }

  isZero(): boolean {
    return this._valueInCents === 0;
  }

  formatBRL(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.valueInMonetary);
  }

  formatCents(): string {
    return `${this._valueInCents} centavos`;
  }

  toJSON(): { valueInCents: number; valueInMonetary: number; formatted: string } {
    return {
      valueInCents: this._valueInCents,
      valueInMonetary: this.valueInMonetary,
      formatted: this.formatBRL(),
    };
  }

  toString(): string {
    return this.formatBRL();
  }

  static create(valueInCents: number): Either<string, Money> {
    if (typeof valueInCents !== 'number') {
      return Either.error('Value must be a number');
    }

    if (!Number.isFinite(valueInCents)) {
      return Either.error('Value must be a finite number');
    }

    if (valueInCents < 0) {
      return Either.error('Value cannot be negative');
    }

    return Either.success(new Money(valueInCents));
  }

  static fromMonetary(valueInMonetary: number): Either<string, Money> {
    if (typeof valueInMonetary !== 'number') {
      return Either.error('Value must be a number');
    }

    if (!Number.isFinite(valueInMonetary)) {
      return Either.error('Value must be a finite number');
    }

    if (valueInMonetary < 0) {
      return Either.error('Value cannot be negative');
    }

    const valueInCents = Math.round(valueInMonetary * 100);
    return Either.success(new Money(valueInCents));
  }

  static fromCents(valueInCents: number): Either<string, Money> {
    return Money.create(valueInCents);
  }

  static zero(): Money {
    return new Money(0);
  }

  static fromJSON(json: { valueInCents: number }): Either<string, Money> {
    return Money.create(json.valueInCents);
  }
}