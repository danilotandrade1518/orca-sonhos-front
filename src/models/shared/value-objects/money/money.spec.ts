import { Money } from './money';
import { Either } from '@either';

describe('Money', () => {
  describe('when creating Money from cents', () => {
    it('should create Money with valid positive cents', () => {
      // Arrange
      const cents = 10050; // R$ 100,50

      // Act
      const result = Money.fromCents(cents);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);
      const money = result.data!;
      expect(money.valueInCents).toBe(10050);
      expect(money.valueInMonetary).toBe(100.5);
    });

    it('should create Money with zero cents', () => {
      // Arrange
      const cents = 0;

      // Act
      const result = Money.fromCents(cents);

      // Assert
      expect(result.hasData).toBe(true);
      const money = result.data!;
      expect(money.valueInCents).toBe(0);
      expect(money.valueInMonetary).toBe(0);
      expect(money.isZero()).toBe(true);
    });

    it('should round decimal cents to integer', () => {
      // Arrange
      const centsWithDecimal = 100.7;

      // Act
      const result = Money.fromCents(centsWithDecimal);

      // Assert
      expect(result.hasData).toBe(true);
      const money = result.data!;
      expect(money.valueInCents).toBe(101); // Rounded
    });

    it('should return error when cents is negative', () => {
      // Arrange
      const negativeCents = -100;

      // Act
      const result = Money.fromCents(negativeCents);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.data).toBeNull();
      expect(result.errors).toContain('Value cannot be negative');
    });

    it('should return error when cents is not a number', () => {
      // Arrange
      const invalidCents = 'not-a-number' as any;

      // Act
      const result = Money.fromCents(invalidCents);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Value must be a number');
    });

    it('should return error when cents is infinite', () => {
      // Arrange
      const infiniteCents = Infinity;

      // Act
      const result = Money.fromCents(infiniteCents);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Value must be a finite number');
    });

    it('should return error when cents is NaN', () => {
      // Arrange
      const nanCents = NaN;

      // Act
      const result = Money.fromCents(nanCents);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Value must be a finite number');
    });
  });

  describe('when creating Money from monetary value', () => {
    it('should create Money from valid monetary value', () => {
      // Arrange
      const monetary = 100.5;

      // Act
      const result = Money.fromMonetary(monetary);

      // Assert
      expect(result.hasData).toBe(true);
      const money = result.data!;
      expect(money.valueInCents).toBe(10050);
      expect(money.valueInMonetary).toBe(100.5);
    });

    it('should handle large monetary values', () => {
      // Arrange
      const largeMonetary = 999999.99;

      // Act
      const result = Money.fromMonetary(largeMonetary);

      // Assert
      expect(result.hasData).toBe(true);
      const money = result.data!;
      expect(money.valueInCents).toBe(99999999);
      expect(money.valueInMonetary).toBe(999999.99);
    });

    it('should round monetary values correctly', () => {
      // Arrange
      const monetaryWithManyDecimals = 100.567;

      // Act
      const result = Money.fromMonetary(monetaryWithManyDecimals);

      // Assert
      expect(result.hasData).toBe(true);
      const money = result.data!;
      expect(money.valueInCents).toBe(10057); // 100.567 * 100 = 10056.7, rounded to 10057
    });

    it('should return error when monetary value is negative', () => {
      // Arrange
      const negativeMonetary = -50.25;

      // Act
      const result = Money.fromMonetary(negativeMonetary);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Value cannot be negative');
    });

    it('should return error when monetary value is not a number', () => {
      // Arrange
      const invalidMonetary = 'invalid' as any;

      // Act
      const result = Money.fromMonetary(invalidMonetary);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Value must be a number');
    });

    it('should return error when monetary value is infinite', () => {
      // Arrange
      const infiniteMonetary = Infinity;

      // Act
      const result = Money.fromMonetary(infiniteMonetary);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Value must be a finite number');
    });
  });

  describe('when creating Money using static methods', () => {
    it('should create zero Money using static method', () => {
      // Arrange & Act
      const zeroMoney = Money.zero();

      // Assert
      expect(zeroMoney.valueInCents).toBe(0);
      expect(zeroMoney.valueInMonetary).toBe(0);
      expect(zeroMoney.isZero()).toBe(true);
    });

    it('should create Money from JSON with valid data', () => {
      // Arrange
      const jsonData = { valueInCents: 15000 };

      // Act
      const result = Money.fromJSON(jsonData);

      // Assert
      expect(result.hasData).toBe(true);
      const money = result.data!;
      expect(money.valueInCents).toBe(15000);
      expect(money.valueInMonetary).toBe(150);
    });

    it('should return error when creating Money from JSON with invalid data', () => {
      // Arrange
      const invalidJsonData = { valueInCents: -100 };

      // Act
      const result = Money.fromJSON(invalidJsonData);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Value cannot be negative');
    });
  });

  describe('when performing arithmetic operations', () => {
    it('should add two Money instances correctly', () => {
      // Arrange
      const money1 = Money.fromMonetary(100.5).data!;
      const money2 = Money.fromMonetary(200.25).data!;

      // Act
      const result = money1.add(money2);

      // Assert
      expect(result.valueInCents).toBe(30075); // 10050 + 20025
      expect(result.valueInMonetary).toBe(300.75);
    });

    it('should add zero Money correctly', () => {
      // Arrange
      const money = Money.fromMonetary(100.5).data!;
      const zeroMoney = Money.zero();

      // Act
      const result = money.add(zeroMoney);

      // Assert
      expect(result.valueInCents).toBe(money.valueInCents);
      expect(result.valueInMonetary).toBe(money.valueInMonetary);
    });

    it('should subtract Money instances correctly when result is positive', () => {
      // Arrange
      const money1 = Money.fromMonetary(300.75).data!;
      const money2 = Money.fromMonetary(100.25).data!;

      // Act
      const result = money1.subtract(money2);

      // Assert
      expect(result.hasData).toBe(true);
      const difference = result.data!;
      expect(difference.valueInCents).toBe(20050); // 30075 - 10025
      expect(difference.valueInMonetary).toBe(200.5);
    });

    it('should return error when subtraction result is negative', () => {
      // Arrange
      const money1 = Money.fromMonetary(100.5).data!;
      const money2 = Money.fromMonetary(200.75).data!;

      // Act
      const result = money1.subtract(money2);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Result cannot be negative');
    });

    it('should subtract equal amounts to get zero', () => {
      // Arrange
      const money1 = Money.fromMonetary(100.5).data!;
      const money2 = Money.fromMonetary(100.5).data!;

      // Act
      const result = money1.subtract(money2);

      // Assert
      expect(result.hasData).toBe(true);
      const difference = result.data!;
      expect(difference.valueInCents).toBe(0);
      expect(difference.isZero()).toBe(true);
    });

    it('should multiply Money by positive number', () => {
      // Arrange
      const money = Money.fromMonetary(100.5).data!;
      const multiplier = 2.5;

      // Act
      const result = money.multiply(multiplier);

      // Assert
      expect(result.hasData).toBe(true);
      const product = result.data!;
      expect(product.valueInCents).toBe(25125); // 10050 * 2.5 = 25125
      expect(product.valueInMonetary).toBe(251.25);
    });

    it('should multiply Money by zero', () => {
      // Arrange
      const money = Money.fromMonetary(100.5).data!;
      const multiplier = 0;

      // Act
      const result = money.multiply(multiplier);

      // Assert
      expect(result.hasData).toBe(true);
      const product = result.data!;
      expect(product.valueInCents).toBe(0);
      expect(product.isZero()).toBe(true);
    });

    it('should return error when multiplying by negative number', () => {
      // Arrange
      const money = Money.fromMonetary(100.5).data!;
      const negativeMultiplier = -2;

      // Act
      const result = money.multiply(negativeMultiplier);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Multiplier cannot be negative');
    });

    it('should return error when multiplying by non-number', () => {
      // Arrange
      const money = Money.fromMonetary(100.5).data!;
      const invalidMultiplier = 'not-a-number' as any;

      // Act
      const result = money.multiply(invalidMultiplier);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Multiplier must be a number');
    });

    it('should return error when multiplying by infinite number', () => {
      // Arrange
      const money = Money.fromMonetary(100.5).data!;
      const infiniteMultiplier = Infinity;

      // Act
      const result = money.multiply(infiniteMultiplier);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Multiplier must be a finite number');
    });

    it('should divide Money by positive number', () => {
      // Arrange
      const money = Money.fromMonetary(100.5).data!;
      const divisor = 2;

      // Act
      const result = money.divide(divisor);

      // Assert
      expect(result.hasData).toBe(true);
      const quotient = result.data!;
      expect(quotient.valueInCents).toBe(5025); // 10050 / 2 = 5025
      expect(quotient.valueInMonetary).toBe(50.25);
    });

    it('should round division result correctly', () => {
      // Arrange
      const money = Money.fromMonetary(100.0).data!;
      const divisor = 3;

      // Act
      const result = money.divide(divisor);

      // Assert
      expect(result.hasData).toBe(true);
      const quotient = result.data!;
      expect(quotient.valueInCents).toBe(3333); // 10000 / 3 = 3333.33, rounded to 3333
    });

    it('should return error when dividing by zero', () => {
      // Arrange
      const money = Money.fromMonetary(100.5).data!;
      const zeroDivisor = 0;

      // Act
      const result = money.divide(zeroDivisor);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Divisor must be positive');
    });

    it('should return error when dividing by negative number', () => {
      // Arrange
      const money = Money.fromMonetary(100.5).data!;
      const negativeDivisor = -2;

      // Act
      const result = money.divide(negativeDivisor);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Divisor must be positive');
    });

    it('should return error when dividing by non-number', () => {
      // Arrange
      const money = Money.fromMonetary(100.5).data!;
      const invalidDivisor = 'not-a-number' as any;

      // Act
      const result = money.divide(invalidDivisor);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Divisor must be a number');
    });

    it('should return error when dividing by infinite number', () => {
      // Arrange
      const money = Money.fromMonetary(100.5).data!;
      const infiniteDivisor = Infinity;

      // Act
      const result = money.divide(infiniteDivisor);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Divisor must be a finite number');
    });
  });

  describe('when comparing Money instances', () => {
    it('should correctly identify when one Money is greater than another', () => {
      // Arrange
      const money1 = Money.fromMonetary(100.5).data!;
      const money2 = Money.fromMonetary(50.25).data!;

      // Act & Assert
      expect(money1.isGreaterThan(money2)).toBe(true);
      expect(money2.isGreaterThan(money1)).toBe(false);
    });

    it('should correctly identify when one Money is less than another', () => {
      // Arrange
      const money1 = Money.fromMonetary(50.25).data!;
      const money2 = Money.fromMonetary(100.5).data!;

      // Act & Assert
      expect(money1.isLessThan(money2)).toBe(true);
      expect(money2.isLessThan(money1)).toBe(false);
    });

    it('should correctly identify when two Money instances are equal', () => {
      // Arrange
      const money1 = Money.fromMonetary(100.5).data!;
      const money2 = Money.fromCents(10050).data!;

      // Act & Assert
      expect(money1.isEqualTo(money2)).toBe(true);
      expect(money2.isEqualTo(money1)).toBe(true);
    });

    it('should correctly identify when Money instances are not equal', () => {
      // Arrange
      const money1 = Money.fromMonetary(100.5).data!;
      const money2 = Money.fromMonetary(100.51).data!;

      // Act & Assert
      expect(money1.isEqualTo(money2)).toBe(false);
      expect(money2.isEqualTo(money1)).toBe(false);
    });

    it('should identify zero Money correctly', () => {
      // Arrange
      const zeroMoney = Money.zero();
      const nonZeroMoney = Money.fromMonetary(0.01).data!;

      // Act & Assert
      expect(zeroMoney.isZero()).toBe(true);
      expect(nonZeroMoney.isZero()).toBe(false);
    });

    it('should handle edge case comparisons', () => {
      // Arrange
      const money1 = Money.fromMonetary(100.0).data!;
      const money2 = Money.fromCents(10000).data!;
      const money3 = Money.fromMonetary(99.99).data!;

      // Act & Assert
      expect(money1.isEqualTo(money2)).toBe(true);
      expect(money1.isGreaterThan(money3)).toBe(true);
      expect(money3.isLessThan(money1)).toBe(true);
    });
  });

  describe('when formatting Money values', () => {
    it('should format Money as Brazilian Real (BRL)', () => {
      // Arrange
      const money = Money.fromMonetary(1234.56).data!;

      // Act
      const formatted = money.formatBRL();

      // Assert
      expect(formatted).toBe('R$ 1.234,56');
    });

    it('should format zero Money correctly', () => {
      // Arrange
      const zeroMoney = Money.zero();

      // Act
      const formatted = zeroMoney.formatBRL();

      // Assert
      expect(formatted).toBe('R$ 0,00');
    });

    it('should format large Money values correctly', () => {
      // Arrange
      const largeMoney = Money.fromMonetary(1000000.0).data!;

      // Act
      const formatted = largeMoney.formatBRL();

      // Assert
      expect(formatted).toBe('R$ 1.000.000,00');
    });

    it('should format Money in cents format', () => {
      // Arrange
      const money = Money.fromMonetary(100.5).data!;

      // Act
      const formatted = money.formatCents();

      // Assert
      expect(formatted).toBe('10050 centavos');
    });

    it('should format zero cents correctly', () => {
      // Arrange
      const zeroMoney = Money.zero();

      // Act
      const formatted = zeroMoney.formatCents();

      // Assert
      expect(formatted).toBe('0 centavos');
    });

    it('should use BRL format when converting to string', () => {
      // Arrange
      const money = Money.fromMonetary(100.5).data!;

      // Act
      const stringRepresentation = money.toString();

      // Assert
      expect(stringRepresentation).toBe('R$ 100,50');
    });
  });

  describe('when serializing Money to JSON', () => {
    it('should serialize Money to complete JSON object', () => {
      // Arrange
      const money = Money.fromMonetary(100.5).data!;

      // Act
      const jsonRepresentation = money.toJSON();

      // Assert
      expect(jsonRepresentation).toEqual({
        valueInCents: 10050,
        valueInMonetary: 100.5,
        formatted: 'R$ 100,50',
      });
    });

    it('should serialize zero Money correctly', () => {
      // Arrange
      const zeroMoney = Money.zero();

      // Act
      const jsonRepresentation = zeroMoney.toJSON();

      // Assert
      expect(jsonRepresentation).toEqual({
        valueInCents: 0,
        valueInMonetary: 0,
        formatted: 'R$ 0,00',
      });
    });

    it('should serialize large Money values correctly', () => {
      // Arrange
      const largeMoney = Money.fromMonetary(999999.99).data!;

      // Act
      const jsonRepresentation = largeMoney.toJSON();

      // Assert
      expect(jsonRepresentation).toEqual({
        valueInCents: 99999999,
        valueInMonetary: 999999.99,
        formatted: 'R$ 999.999,99',
      });
    });
  });

  describe('when testing Money immutability', () => {
    it('should not modify original Money when performing add operation', () => {
      // Arrange
      const originalMoney = Money.fromMonetary(100.5).data!;
      const originalCents = originalMoney.valueInCents;
      const addMoney = Money.fromMonetary(50.25).data!;

      // Act
      const result = originalMoney.add(addMoney);

      // Assert
      expect(originalMoney.valueInCents).toBe(originalCents); // Original unchanged
      expect(result.valueInCents).toBe(15075); // New instance
      expect(result).not.toBe(originalMoney); // Different instances
    });

    it('should not modify original Money when performing successful subtract operation', () => {
      // Arrange
      const originalMoney = Money.fromMonetary(100.5).data!;
      const originalCents = originalMoney.valueInCents;
      const subtractMoney = Money.fromMonetary(50.25).data!;

      // Act
      const result = originalMoney.subtract(subtractMoney);

      // Assert
      expect(originalMoney.valueInCents).toBe(originalCents); // Original unchanged
      expect(result.hasData).toBe(true);
      const difference = result.data!;
      expect(difference).not.toBe(originalMoney); // Different instances
    });

    it('should not modify original Money when performing multiply operation', () => {
      // Arrange
      const originalMoney = Money.fromMonetary(100.5).data!;
      const originalCents = originalMoney.valueInCents;

      // Act
      const result = originalMoney.multiply(2);

      // Assert
      expect(originalMoney.valueInCents).toBe(originalCents); // Original unchanged
      expect(result.hasData).toBe(true);
      const product = result.data!;
      expect(product).not.toBe(originalMoney); // Different instances
    });

    it('should not modify original Money when performing divide operation', () => {
      // Arrange
      const originalMoney = Money.fromMonetary(100.5).data!;
      const originalCents = originalMoney.valueInCents;

      // Act
      const result = originalMoney.divide(2);

      // Assert
      expect(originalMoney.valueInCents).toBe(originalCents); // Original unchanged
      expect(result.hasData).toBe(true);
      const quotient = result.data!;
      expect(quotient).not.toBe(originalMoney); // Different instances
    });
  });

  describe('when testing edge cases and boundary conditions', () => {
    it('should handle very large monetary values', () => {
      // Arrange
      const largeCents = 999999999; // R$ 9,999,999.99

      // Act
      const result = Money.fromCents(largeCents);

      // Assert
      expect(result.hasData).toBe(true);
      const money = result.data!;
      expect(money.valueInCents).toBe(largeCents);
      expect(money.valueInMonetary).toBe(9999999.99);
    });

    it('should handle very small monetary values', () => {
      // Arrange
      const smallCents = 1; // R$ 0.01

      // Act
      const result = Money.fromCents(smallCents);

      // Assert
      expect(result.hasData).toBe(true);
      const money = result.data!;
      expect(money.valueInCents).toBe(1);
      expect(money.valueInMonetary).toBe(0.01);
    });

    it('should handle precision edge cases in multiplication', () => {
      // Arrange
      const money = Money.fromCents(1).data!; // R$ 0.01
      const multiplier = 0.1;

      // Act
      const result = money.multiply(multiplier);

      // Assert
      expect(result.hasData).toBe(true);
      const product = result.data!;
      expect(product.valueInCents).toBe(0); // 1 * 0.1 = 0.1, rounded to 0
    });

    it('should handle precision edge cases in division', () => {
      // Arrange
      const money = Money.fromCents(1).data!; // R$ 0.01
      const divisor = 10;

      // Act
      const result = money.divide(divisor);

      // Assert
      expect(result.hasData).toBe(true);
      const quotient = result.data!;
      expect(quotient.valueInCents).toBe(0); // 1 / 10 = 0.1, rounded to 0
    });

    it('should handle chaining operations correctly', () => {
      // Arrange
      const baseMoney = Money.fromMonetary(100.0).data!;
      const addMoney = Money.fromMonetary(50.0).data!;
      const subtractMoney = Money.fromMonetary(25.0).data!;

      // Act
      const afterAdd = baseMoney.add(addMoney);
      const multiplyResult = afterAdd.multiply(2);
      const divideResult = multiplyResult.data!.divide(3);
      const finalResult = divideResult.data!.subtract(subtractMoney);

      // Assert
      expect(afterAdd.valueInCents).toBe(15000); // 100 + 50 = 150
      expect(multiplyResult.data!.valueInCents).toBe(30000); // 150 * 2 = 300
      expect(divideResult.data!.valueInCents).toBe(10000); // 300 / 3 = 100
      expect(finalResult.data!.valueInCents).toBe(7500); // 100 - 25 = 75
    });
  });
});
