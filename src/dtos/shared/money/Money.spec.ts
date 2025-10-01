import { Money, MoneyHelper } from './Money';

describe('Money', () => {
  it('should work with Money type', () => {
    const amount: Money = 1050;
    expect(amount).toBe(1050);
  });

  it('should convert decimal to cents', () => {
    const cents = MoneyHelper.toCents(10.5);
    expect(cents).toBe(1050);
  });

  it('should convert cents to decimal', () => {
    const decimal = MoneyHelper.toDecimal(1050);
    expect(decimal).toBe(10.5);
  });

  it('should format money correctly', () => {
    const formatted = MoneyHelper.format(1050);
    expect(formatted).toContain('R$');
    expect(formatted).toContain('10,50');
  });

  it('should add money values', () => {
    const sum = MoneyHelper.add(1000, 500);
    expect(sum).toBe(1500);
  });

  it('should check if money is zero', () => {
    expect(MoneyHelper.isZero(0)).toBe(true);
    expect(MoneyHelper.isZero(100)).toBe(false);
  });
});
