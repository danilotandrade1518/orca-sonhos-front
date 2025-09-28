import {
  TransactionType,
  TransactionTypeValues,
  TransactionTypeLabels,
  isValidTransactionType,
  getTransactionTypeLabel,
} from './transaction-type';

describe('TransactionType', () => {
  describe('when using enum values', () => {
    it('should have INCOME value', () => {
      // Arrange & Act & Assert
      expect(TransactionType.INCOME).toBe('INCOME');
    });

    it('should have EXPENSE value', () => {
      // Arrange & Act & Assert
      expect(TransactionType.EXPENSE).toBe('EXPENSE');
    });

    it('should have exactly 2 enum values', () => {
      // Arrange
      const enumKeys = Object.keys(TransactionType);

      // Act & Assert
      expect(enumKeys.length).toBe(2);
      expect(enumKeys).toContain('INCOME');
      expect(enumKeys).toContain('EXPENSE');
    });

    it('should have string values for all enum entries', () => {
      // Arrange
      const enumValues = Object.values(TransactionType);

      // Act & Assert
      enumValues.forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });
  });

  describe('when using TransactionTypeValues array', () => {
    it('should contain all enum values', () => {
      // Arrange & Act & Assert
      expect(TransactionTypeValues).toContain(TransactionType.INCOME);
      expect(TransactionTypeValues).toContain(TransactionType.EXPENSE);
      expect(TransactionTypeValues.length).toBe(2);
    });

    it('should be an array of strings', () => {
      // Arrange & Act & Assert
      expect(Array.isArray(TransactionTypeValues)).toBe(true);
      TransactionTypeValues.forEach((value) => {
        expect(typeof value).toBe('string');
      });
    });

    it('should match Object.values(TransactionType)', () => {
      // Arrange
      const objectValues = Object.values(TransactionType);

      // Act & Assert
      expect(TransactionTypeValues).toEqual(objectValues);
    });
  });

  describe('when using TransactionTypeLabels', () => {
    it('should have correct label for INCOME', () => {
      // Arrange & Act & Assert
      expect(TransactionTypeLabels[TransactionType.INCOME]).toBe('Receita');
    });

    it('should have correct label for EXPENSE', () => {
      // Arrange & Act & Assert
      expect(TransactionTypeLabels[TransactionType.EXPENSE]).toBe('Despesa');
    });

    it('should have labels for all enum values', () => {
      // Arrange
      const enumValues = Object.values(TransactionType);

      // Act & Assert
      enumValues.forEach((enumValue) => {
        expect(TransactionTypeLabels[enumValue]).toBeDefined();
        expect(typeof TransactionTypeLabels[enumValue]).toBe('string');
        expect(TransactionTypeLabels[enumValue].length).toBeGreaterThan(0);
      });
    });

    it('should have exactly 2 labels', () => {
      // Arrange
      const labelKeys = Object.keys(TransactionTypeLabels);

      // Act & Assert
      expect(labelKeys.length).toBe(2);
    });

    it('should have unique labels', () => {
      // Arrange
      const labelValues = Object.values(TransactionTypeLabels);

      // Act & Assert
      const uniqueLabels = new Set(labelValues);
      expect(uniqueLabels.size).toBe(labelValues.length);
    });
  });

  describe('when validating with isValidTransactionType', () => {
    it('should return true for valid INCOME string', () => {
      // Arrange
      const validValue = 'INCOME';

      // Act
      const result = isValidTransactionType(validValue);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for valid EXPENSE string', () => {
      // Arrange
      const validValue = 'EXPENSE';

      // Act
      const result = isValidTransactionType(validValue);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for enum values', () => {
      // Arrange & Act & Assert
      expect(isValidTransactionType(TransactionType.INCOME)).toBe(true);
      expect(isValidTransactionType(TransactionType.EXPENSE)).toBe(true);
    });

    it('should return false for invalid string', () => {
      // Arrange
      const invalidValue = 'INVALID';

      // Act
      const result = isValidTransactionType(invalidValue);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      // Arrange
      const emptyValue = '';

      // Act
      const result = isValidTransactionType(emptyValue);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for lowercase values', () => {
      // Arrange
      const lowercaseIncome = 'income';
      const lowercaseExpense = 'expense';

      // Act & Assert
      expect(isValidTransactionType(lowercaseIncome)).toBe(false);
      expect(isValidTransactionType(lowercaseExpense)).toBe(false);
    });

    it('should return false for numeric input', () => {
      // Arrange
      const numericValue = '123';

      // Act
      const result = isValidTransactionType(numericValue);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for null and undefined', () => {
      // Arrange & Act & Assert
      expect(isValidTransactionType(null as any)).toBe(false);
      expect(isValidTransactionType(undefined as any)).toBe(false);
    });

    it('should validate all values in TransactionTypeValues', () => {
      // Arrange & Act & Assert
      TransactionTypeValues.forEach((value) => {
        expect(isValidTransactionType(value)).toBe(true);
      });
    });
  });

  describe('when getting labels with getTransactionTypeLabel', () => {
    it('should return correct label for INCOME', () => {
      // Arrange
      const type = TransactionType.INCOME;

      // Act
      const label = getTransactionTypeLabel(type);

      // Assert
      expect(label).toBe('Receita');
    });

    it('should return correct label for EXPENSE', () => {
      // Arrange
      const type = TransactionType.EXPENSE;

      // Act
      const label = getTransactionTypeLabel(type);

      // Assert
      expect(label).toBe('Despesa');
    });

    it('should return labels for all enum values', () => {
      // Arrange
      const enumValues = Object.values(TransactionType);

      // Act & Assert
      enumValues.forEach((enumValue) => {
        const label = getTransactionTypeLabel(enumValue);
        expect(typeof label).toBe('string');
        expect(label.length).toBeGreaterThan(0);
      });
    });

    it('should match TransactionTypeLabels mapping', () => {
      // Arrange
      const enumValues = Object.values(TransactionType);

      // Act & Assert
      enumValues.forEach((enumValue) => {
        const functionLabel = getTransactionTypeLabel(enumValue);
        const directLabel = TransactionTypeLabels[enumValue];
        expect(functionLabel).toBe(directLabel);
      });
    });
  });

  describe('when using enum in real scenarios', () => {
    it('should work as object keys', () => {
      // Arrange
      const transactionCounts = {
        [TransactionType.INCOME]: 10,
        [TransactionType.EXPENSE]: 25,
      };

      // Act & Assert
      expect(transactionCounts[TransactionType.INCOME]).toBe(10);
      expect(transactionCounts[TransactionType.EXPENSE]).toBe(25);
    });

    it('should work in switch statements', () => {
      // Arrange
      const getIcon = (type: TransactionType): string => {
        switch (type) {
          case TransactionType.INCOME:
            return '+';
          case TransactionType.EXPENSE:
            return '-';
          default:
            return '?';
        }
      };

      // Act & Assert
      expect(getIcon(TransactionType.INCOME)).toBe('+');
      expect(getIcon(TransactionType.EXPENSE)).toBe('-');
    });

    it('should work with Array.includes', () => {
      // Arrange
      const incomeTypes = [TransactionType.INCOME];
      const expenseTypes = [TransactionType.EXPENSE];

      // Act & Assert
      expect(incomeTypes.includes(TransactionType.INCOME)).toBe(true);
      expect(incomeTypes.includes(TransactionType.EXPENSE)).toBe(false);
      expect(expenseTypes.includes(TransactionType.EXPENSE)).toBe(true);
      expect(expenseTypes.includes(TransactionType.INCOME)).toBe(false);
    });

    it('should support filtering operations', () => {
      // Arrange
      const transactions = [
        { type: TransactionType.INCOME, amount: 1000 },
        { type: TransactionType.EXPENSE, amount: 500 },
        { type: TransactionType.INCOME, amount: 750 },
        { type: TransactionType.EXPENSE, amount: 200 },
      ];

      // Act
      const incomes = transactions.filter((t) => t.type === TransactionType.INCOME);
      const expenses = transactions.filter((t) => t.type === TransactionType.EXPENSE);

      // Assert
      expect(incomes.length).toBe(2);
      expect(expenses.length).toBe(2);
      expect(incomes.every((t) => t.type === TransactionType.INCOME)).toBe(true);
      expect(expenses.every((t) => t.type === TransactionType.EXPENSE)).toBe(true);
    });
  });

  describe('edge cases and boundary conditions', () => {
    it('should handle string comparison correctly', () => {
      // Arrange
      const stringValue = 'INCOME';
      const enumValue = TransactionType.INCOME;

      // Act & Assert
      expect(stringValue === enumValue).toBe(true);
      expect(stringValue).toBe(enumValue);
    });

    it('should demonstrate enum behavior', () => {
      // Arrange
      const originalIncome = TransactionType.INCOME;
      const originalIncomeString = 'INCOME';

      // Act & Assert - demonstrate that enum value equals string
      expect(originalIncome).toBe(originalIncomeString);
      expect(typeof originalIncome).toBe('string');

      // Enum behavior: values are string literals
      expect(TransactionType.INCOME).toBe('INCOME');
      expect(TransactionType.EXPENSE).toBe('EXPENSE');
    });

    it('should handle JSON serialization', () => {
      // Arrange
      const data = {
        type: TransactionType.INCOME,
        amount: 1000,
      };

      // Act
      const jsonString = JSON.stringify(data);
      const parsed = JSON.parse(jsonString);

      // Assert
      expect(parsed.type).toBe('INCOME');
      expect(isValidTransactionType(parsed.type)).toBe(true);
    });

    it('should handle case sensitivity', () => {
      // Arrange
      const variations = ['income', 'Income', 'INCOME', 'InCoMe'];

      // Act & Assert
      expect(isValidTransactionType('INCOME')).toBe(true); // Only exact match
      expect(isValidTransactionType('income')).toBe(false);
      expect(isValidTransactionType('Income')).toBe(false);
      expect(isValidTransactionType('InCoMe')).toBe(false);
    });
  });
});
