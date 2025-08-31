// Money value object to avoid floating point issues; stores amounts in minor units (cents)
export class Money {
  private constructor(private readonly _cents: number) {}

  static fromNumber(amount: number): Money {
    if (!Number.isFinite(amount)) throw new Error('Invalid amount');
    const cents = Math.round(amount * 100);
    return new Money(cents);
  }

  static fromCents(cents: number): Money {
    if (!Number.isInteger(cents)) throw new Error('Invalid cents');
    return new Money(cents);
  }

  add(other: Money): Money {
    return new Money(this._cents + other._cents);
  }

  subtract(other: Money): Money {
    return new Money(this._cents - other._cents);
  }

  negate(): Money {
    return new Money(-this._cents);
  }

  isNegative(): boolean {
    return this._cents < 0;
  }

  toCurrency(): number {
    return this._cents / 100;
  }

  toCents(): number {
    return this._cents;
  }
}
