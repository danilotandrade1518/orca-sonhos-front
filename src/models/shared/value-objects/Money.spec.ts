import { Money } from './Money';

describe('Money', () => {
  it('creates from cents and number and converts back', () => {
    const m1 = Money.fromCents(150);
    expect(m1.toCents()).toBe(150);
    const m2 = Money.fromNumber(1.5);
    expect(m2.toCents()).toBe(150);
    expect(m2.toCurrency()).toBeCloseTo(1.5, 6);
  });

  it('adds, subtracts, and negates', () => {
    const a = Money.fromCents(200);
    const b = Money.fromCents(50);
    expect(a.add(b).toCents()).toBe(250);
    expect(a.subtract(b).toCents()).toBe(150);
  });

  it('validates inputs', () => {
    expect(() => Money.fromCents(1.2 as unknown as number)).toThrow();
    expect(() => Money.fromNumber(Number.NaN)).toThrow();
  });
});
