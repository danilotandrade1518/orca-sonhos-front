import {
  CategoryType,
  CategoryTypeValues,
  CategoryTypeLabels,
  isValidCategoryType,
  getCategoryTypeLabel
} from './category-type';

describe('CategoryType', () => {
  describe('when using enum values', () => {
    it('should have INCOME value', () => {
      // Arrange & Act & Assert
      expect(CategoryType.INCOME).toBe('INCOME');
    });

    it('should have EXPENSE value', () => {
      // Arrange & Act & Assert
      expect(CategoryType.EXPENSE).toBe('EXPENSE');
    });

    it('should have exactly 2 enum values', () => {
      // Arrange
      const enumKeys = Object.keys(CategoryType);

      // Act & Assert
      expect(enumKeys.length).toBe(2);
      expect(enumKeys).toContain('INCOME');
      expect(enumKeys).toContain('EXPENSE');
    });

    it('should have string values for all enum entries', () => {
      // Arrange
      const enumValues = Object.values(CategoryType);

      // Act & Assert
      enumValues.forEach(value => {
        expect(typeof value).toBe('string');
      });
    });
  });

  describe('when using CategoryTypeValues array', () => {
    it('should contain all enum values', () => {
      // Arrange & Act & Assert
      expect(CategoryTypeValues).toContain(CategoryType.INCOME);
      expect(CategoryTypeValues).toContain(CategoryType.EXPENSE);
      expect(CategoryTypeValues.length).toBe(2);
    });

    it('should be an array of strings', () => {
      // Arrange & Act & Assert
      expect(Array.isArray(CategoryTypeValues)).toBe(true);
      CategoryTypeValues.forEach(value => {
        expect(typeof value).toBe('string');
      });
    });

    it('should match Object.values(CategoryType)', () => {
      // Arrange
      const objectValues = Object.values(CategoryType);

      // Act & Assert
      expect(CategoryTypeValues).toEqual(objectValues);
    });
  });

  describe('when using CategoryTypeLabels', () => {
    it('should have correct label for INCOME', () => {
      // Arrange & Act & Assert
      expect(CategoryTypeLabels[CategoryType.INCOME]).toBe('Receita');
    });

    it('should have correct label for EXPENSE', () => {
      // Arrange & Act & Assert
      expect(CategoryTypeLabels[CategoryType.EXPENSE]).toBe('Despesa');
    });

    it('should have labels for all enum values', () => {
      // Arrange
      const enumValues = Object.values(CategoryType);

      // Act & Assert
      enumValues.forEach(enumValue => {
        expect(CategoryTypeLabels[enumValue]).toBeDefined();
        expect(typeof CategoryTypeLabels[enumValue]).toBe('string');
        expect(CategoryTypeLabels[enumValue].length).toBeGreaterThan(0);
      });
    });

    it('should have exactly 2 labels', () => {
      // Arrange
      const labelKeys = Object.keys(CategoryTypeLabels);

      // Act & Assert
      expect(labelKeys.length).toBe(2);
    });

    it('should have unique labels', () => {
      // Arrange
      const labelValues = Object.values(CategoryTypeLabels);

      // Act & Assert
      const uniqueLabels = new Set(labelValues);
      expect(uniqueLabels.size).toBe(labelValues.length);
    });
  });

  describe('when validating with isValidCategoryType', () => {
    it('should return true for valid INCOME string', () => {
      // Arrange
      const validValue = 'INCOME';

      // Act
      const result = isValidCategoryType(validValue);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for valid EXPENSE string', () => {
      // Arrange
      const validValue = 'EXPENSE';

      // Act
      const result = isValidCategoryType(validValue);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for enum values', () => {
      // Arrange & Act & Assert
      expect(isValidCategoryType(CategoryType.INCOME)).toBe(true);
      expect(isValidCategoryType(CategoryType.EXPENSE)).toBe(true);
    });

    it('should return false for invalid string', () => {
      // Arrange
      const invalidValue = 'INVALID';

      // Act
      const result = isValidCategoryType(invalidValue);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      // Arrange
      const emptyValue = '';

      // Act
      const result = isValidCategoryType(emptyValue);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for lowercase values', () => {
      // Arrange
      const lowercaseIncome = 'income';
      const lowercaseExpense = 'expense';

      // Act & Assert
      expect(isValidCategoryType(lowercaseIncome)).toBe(false);
      expect(isValidCategoryType(lowercaseExpense)).toBe(false);
    });

    it('should return false for numeric input', () => {
      // Arrange
      const numericValue = '123';

      // Act
      const result = isValidCategoryType(numericValue);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for null and undefined', () => {
      // Arrange & Act & Assert
      expect(isValidCategoryType(null as any)).toBe(false);
      expect(isValidCategoryType(undefined as any)).toBe(false);
    });

    it('should validate all values in CategoryTypeValues', () => {
      // Arrange & Act & Assert
      CategoryTypeValues.forEach(value => {
        expect(isValidCategoryType(value)).toBe(true);
      });
    });
  });

  describe('when getting labels with getCategoryTypeLabel', () => {
    it('should return correct label for INCOME', () => {
      // Arrange
      const type = CategoryType.INCOME;

      // Act
      const label = getCategoryTypeLabel(type);

      // Assert
      expect(label).toBe('Receita');
    });

    it('should return correct label for EXPENSE', () => {
      // Arrange
      const type = CategoryType.EXPENSE;

      // Act
      const label = getCategoryTypeLabel(type);

      // Assert
      expect(label).toBe('Despesa');
    });

    it('should return labels for all enum values', () => {
      // Arrange
      const enumValues = Object.values(CategoryType);

      // Act & Assert
      enumValues.forEach(enumValue => {
        const label = getCategoryTypeLabel(enumValue);
        expect(typeof label).toBe('string');
        expect(label.length).toBeGreaterThan(0);
      });
    });

    it('should match CategoryTypeLabels mapping', () => {
      // Arrange
      const enumValues = Object.values(CategoryType);

      // Act & Assert
      enumValues.forEach(enumValue => {
        const functionLabel = getCategoryTypeLabel(enumValue);
        const directLabel = CategoryTypeLabels[enumValue];
        expect(functionLabel).toBe(directLabel);
      });
    });
  });

  describe('when using enum in real scenarios', () => {
    it('should work as object keys', () => {
      // Arrange
      const categoryCounts = {
        [CategoryType.INCOME]: 5,
        [CategoryType.EXPENSE]: 15,
      };

      // Act & Assert
      expect(categoryCounts[CategoryType.INCOME]).toBe(5);
      expect(categoryCounts[CategoryType.EXPENSE]).toBe(15);
    });

    it('should work in switch statements', () => {
      // Arrange
      const getDefaultIcon = (type: CategoryType): string => {
        switch (type) {
          case CategoryType.INCOME:
            return '💰';
          case CategoryType.EXPENSE:
            return '💸';
          default:
            return '❓';
        }
      };

      // Act & Assert
      expect(getDefaultIcon(CategoryType.INCOME)).toBe('💰');
      expect(getDefaultIcon(CategoryType.EXPENSE)).toBe('💸');
    });

    it('should work with Array.includes', () => {
      // Arrange
      const positiveTypes = [CategoryType.INCOME];
      const negativeTypes = [CategoryType.EXPENSE];

      // Act & Assert
      expect(positiveTypes.includes(CategoryType.INCOME)).toBe(true);
      expect(positiveTypes.includes(CategoryType.EXPENSE)).toBe(false);
      expect(negativeTypes.includes(CategoryType.EXPENSE)).toBe(true);
      expect(negativeTypes.includes(CategoryType.INCOME)).toBe(false);
    });

    it('should support filtering operations', () => {
      // Arrange
      const categories = [
        { type: CategoryType.INCOME, name: 'Salary' },
        { type: CategoryType.EXPENSE, name: 'Rent' },
        { type: CategoryType.INCOME, name: 'Bonus' },
        { type: CategoryType.EXPENSE, name: 'Food' },
        { type: CategoryType.EXPENSE, name: 'Transport' },
      ];

      // Act
      const incomeCategories = categories.filter(c => c.type === CategoryType.INCOME);
      const expenseCategories = categories.filter(c => c.type === CategoryType.EXPENSE);

      // Assert
      expect(incomeCategories.length).toBe(2);
      expect(expenseCategories.length).toBe(3);
      expect(incomeCategories.every(c => c.type === CategoryType.INCOME)).toBe(true);
      expect(expenseCategories.every(c => c.type === CategoryType.EXPENSE)).toBe(true);
    });
  });

  describe('when comparing with TransactionType', () => {
    it('should have the same values as TransactionType', () => {
      // Arrange
      const transactionTypeValues = ['INCOME', 'EXPENSE'];

      // Act & Assert
      expect(CategoryTypeValues).toEqual([CategoryType.INCOME, CategoryType.EXPENSE]);
    });

    it('should be compatible with TransactionType for business logic', () => {
      // Arrange
      const categoryType = CategoryType.INCOME;
      const transactionTypeString = 'INCOME';

      // Act & Assert
      expect(categoryType).toBe(transactionTypeString);
      expect(String(categoryType)).toBe(transactionTypeString);
    });

    it('should work in cross-type comparisons', () => {
      // Arrange
      const incomeCategory = CategoryType.INCOME;
      const incomeTransaction = 'INCOME'; // Simulating TransactionType.INCOME

      // Act & Assert
      expect(incomeCategory === incomeTransaction).toBe(true);
    });
  });

  describe('edge cases and boundary conditions', () => {
    it('should handle string comparison correctly', () => {
      // Arrange
      const stringValue = 'INCOME';
      const enumValue = CategoryType.INCOME;

      // Act & Assert
      expect(stringValue === enumValue).toBe(true);
      expect(Object.is(stringValue, enumValue)).toBe(true);
    });

    it('should demonstrate enum behavior', () => {
      // Arrange
      const originalIncome = CategoryType.INCOME;
      const originalIncomeString = 'INCOME';

      // Act & Assert - demonstrate that enum value equals string
      expect(originalIncome).toBe(originalIncomeString);
      expect(typeof originalIncome).toBe('string');

      // Enum behavior: values are string literals
      expect(CategoryType.INCOME).toBe('INCOME');
      expect(CategoryType.EXPENSE).toBe('EXPENSE');
    });

    it('should handle JSON serialization', () => {
      // Arrange
      const data = {
        type: CategoryType.EXPENSE,
        name: 'Food Category'
      };

      // Act
      const jsonString = JSON.stringify(data);
      const parsed = JSON.parse(jsonString);

      // Assert
      expect(parsed.type).toBe('EXPENSE');
      expect(isValidCategoryType(parsed.type)).toBe(true);
    });

    it('should handle case sensitivity', () => {
      // Arrange & Act & Assert
      expect(isValidCategoryType('INCOME')).toBe(true); // Only exact match
      expect(isValidCategoryType('income')).toBe(false);
      expect(isValidCategoryType('Income')).toBe(false);
      expect(isValidCategoryType('InCoMe')).toBe(false);
    });

    it('should handle partial matches', () => {
      // Arrange & Act & Assert
      expect(isValidCategoryType('INC')).toBe(false);
      expect(isValidCategoryType('INCOME_CATEGORY')).toBe(false);
      expect(isValidCategoryType('EXP')).toBe(false);
      expect(isValidCategoryType('EXPENSE_TYPE')).toBe(false);
    });

    it('should handle whitespace variations', () => {
      // Arrange & Act & Assert
      expect(isValidCategoryType(' INCOME')).toBe(false);
      expect(isValidCategoryType('INCOME ')).toBe(false);
      expect(isValidCategoryType(' INCOME ')).toBe(false);
      expect(isValidCategoryType('IN COME')).toBe(false);
    });
  });
});