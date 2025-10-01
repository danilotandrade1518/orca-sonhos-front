export type Money = number;

export class MoneyHelper {
  static toCents(value: number): Money {
    return Math.round(value * 100);
  }

  static toDecimal(cents: Money): number {
    return cents / 100;
  }

  static format(cents: Money, locale: string = 'pt-BR', currency: string = 'BRL'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(cents / 100);
  }

  static add(a: Money, b: Money): Money {
    return a + b;
  }

  static subtract(a: Money, b: Money): Money {
    return a - b;
  }

  static multiply(cents: Money, factor: number): Money {
    return Math.round(cents * factor);
  }

  static divide(cents: Money, divisor: number): Money {
    return Math.round(cents / divisor);
  }

  static isZero(cents: Money): boolean {
    return cents === 0;
  }

  static isPositive(cents: Money): boolean {
    return cents > 0;
  }

  static isNegative(cents: Money): boolean {
    return cents < 0;
  }
}
