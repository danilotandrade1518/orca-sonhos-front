import {
  AccountType,
  AccountTypeValues,
  AccountTypeLabels,
  isValidAccountType,
  getAccountTypeLabel
} from './account-type';

describe('AccountType', () => {
  describe('when using enum values', () => {
    it('should have CHECKING value', () => {
      // Arrange & Act & Assert
      expect(AccountType.CHECKING).toBe('CHECKING');
    });

    it('should have SAVINGS value', () => {
      // Arrange & Act & Assert
      expect(AccountType.SAVINGS).toBe('SAVINGS');
    });

    it('should have INVESTMENT value', () => {
      // Arrange & Act & Assert
      expect(AccountType.INVESTMENT).toBe('INVESTMENT');
    });

    it('should have CASH value', () => {
      // Arrange & Act & Assert
      expect(AccountType.CASH).toBe('CASH');
    });

    it('should have exactly 4 enum values', () => {
      // Arrange
      const enumKeys = Object.keys(AccountType);

      // Act & Assert
      expect(enumKeys.length).toBe(4);
      expect(enumKeys).toContain('CHECKING');
      expect(enumKeys).toContain('SAVINGS');
      expect(enumKeys).toContain('INVESTMENT');
      expect(enumKeys).toContain('CASH');
    });

    it('should have string values for all enum entries', () => {
      // Arrange
      const enumValues = Object.values(AccountType);

      // Act & Assert
      enumValues.forEach(value => {
        expect(typeof value).toBe('string');
      });
    });
  });

  describe('when using AccountTypeValues array', () => {
    it('should contain all enum values', () => {
      // Arrange & Act & Assert
      expect(AccountTypeValues).toContain(AccountType.CHECKING);
      expect(AccountTypeValues).toContain(AccountType.SAVINGS);
      expect(AccountTypeValues).toContain(AccountType.INVESTMENT);
      expect(AccountTypeValues).toContain(AccountType.CASH);
      expect(AccountTypeValues.length).toBe(4);
    });

    it('should be an array of strings', () => {
      // Arrange & Act & Assert
      expect(Array.isArray(AccountTypeValues)).toBe(true);
      AccountTypeValues.forEach(value => {
        expect(typeof value).toBe('string');
      });
    });

    it('should match Object.values(AccountType)', () => {
      // Arrange
      const objectValues = Object.values(AccountType);

      // Act & Assert
      expect(AccountTypeValues).toEqual(objectValues);
    });
  });

  describe('when using AccountTypeLabels', () => {
    it('should have correct label for CHECKING', () => {
      // Arrange & Act & Assert
      expect(AccountTypeLabels[AccountType.CHECKING]).toBe('Conta Corrente');
    });

    it('should have correct label for SAVINGS', () => {
      // Arrange & Act & Assert
      expect(AccountTypeLabels[AccountType.SAVINGS]).toBe('Poupança');
    });

    it('should have correct label for INVESTMENT', () => {
      // Arrange & Act & Assert
      expect(AccountTypeLabels[AccountType.INVESTMENT]).toBe('Investimento');
    });

    it('should have correct label for CASH', () => {
      // Arrange & Act & Assert
      expect(AccountTypeLabels[AccountType.CASH]).toBe('Dinheiro');
    });

    it('should have labels for all enum values', () => {
      // Arrange
      const enumValues = Object.values(AccountType);

      // Act & Assert
      enumValues.forEach(enumValue => {
        expect(AccountTypeLabels[enumValue]).toBeDefined();
        expect(typeof AccountTypeLabels[enumValue]).toBe('string');
        expect(AccountTypeLabels[enumValue].length).toBeGreaterThan(0);
      });
    });

    it('should have exactly 4 labels', () => {
      // Arrange
      const labelKeys = Object.keys(AccountTypeLabels);

      // Act & Assert
      expect(labelKeys.length).toBe(4);
    });

    it('should have unique labels', () => {
      // Arrange
      const labelValues = Object.values(AccountTypeLabels);

      // Act & Assert
      const uniqueLabels = new Set(labelValues);
      expect(uniqueLabels.size).toBe(labelValues.length);
    });
  });

  describe('when validating with isValidAccountType', () => {
    it('should return true for valid CHECKING string', () => {
      // Arrange
      const validValue = 'CHECKING';

      // Act
      const result = isValidAccountType(validValue);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for valid SAVINGS string', () => {
      // Arrange
      const validValue = 'SAVINGS';

      // Act
      const result = isValidAccountType(validValue);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for valid INVESTMENT string', () => {
      // Arrange
      const validValue = 'INVESTMENT';

      // Act
      const result = isValidAccountType(validValue);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for valid CASH string', () => {
      // Arrange
      const validValue = 'CASH';

      // Act
      const result = isValidAccountType(validValue);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for enum values', () => {
      // Arrange & Act & Assert
      expect(isValidAccountType(AccountType.CHECKING)).toBe(true);
      expect(isValidAccountType(AccountType.SAVINGS)).toBe(true);
      expect(isValidAccountType(AccountType.INVESTMENT)).toBe(true);
      expect(isValidAccountType(AccountType.CASH)).toBe(true);
    });

    it('should return false for invalid string', () => {
      // Arrange
      const invalidValue = 'INVALID';

      // Act
      const result = isValidAccountType(invalidValue);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for empty string', () => {
      // Arrange
      const emptyValue = '';

      // Act
      const result = isValidAccountType(emptyValue);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for lowercase values', () => {
      // Arrange
      const lowercaseValues = ['checking', 'savings', 'investment', 'cash'];

      // Act & Assert
      lowercaseValues.forEach(value => {
        expect(isValidAccountType(value)).toBe(false);
      });
    });

    it('should return false for numeric input', () => {
      // Arrange
      const numericValue = '123';

      // Act
      const result = isValidAccountType(numericValue);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for null and undefined', () => {
      // Arrange & Act & Assert
      expect(isValidAccountType(null as any)).toBe(false);
      expect(isValidAccountType(undefined as any)).toBe(false);
    });

    it('should validate all values in AccountTypeValues', () => {
      // Arrange & Act & Assert
      AccountTypeValues.forEach(value => {
        expect(isValidAccountType(value)).toBe(true);
      });
    });
  });

  describe('when getting labels with getAccountTypeLabel', () => {
    it('should return correct label for CHECKING', () => {
      // Arrange
      const type = AccountType.CHECKING;

      // Act
      const label = getAccountTypeLabel(type);

      // Assert
      expect(label).toBe('Conta Corrente');
    });

    it('should return correct label for SAVINGS', () => {
      // Arrange
      const type = AccountType.SAVINGS;

      // Act
      const label = getAccountTypeLabel(type);

      // Assert
      expect(label).toBe('Poupança');
    });

    it('should return correct label for INVESTMENT', () => {
      // Arrange
      const type = AccountType.INVESTMENT;

      // Act
      const label = getAccountTypeLabel(type);

      // Assert
      expect(label).toBe('Investimento');
    });

    it('should return correct label for CASH', () => {
      // Arrange
      const type = AccountType.CASH;

      // Act
      const label = getAccountTypeLabel(type);

      // Assert
      expect(label).toBe('Dinheiro');
    });

    it('should return labels for all enum values', () => {
      // Arrange
      const enumValues = Object.values(AccountType);

      // Act & Assert
      enumValues.forEach(enumValue => {
        const label = getAccountTypeLabel(enumValue);
        expect(typeof label).toBe('string');
        expect(label.length).toBeGreaterThan(0);
      });
    });

    it('should match AccountTypeLabels mapping', () => {
      // Arrange
      const enumValues = Object.values(AccountType);

      // Act & Assert
      enumValues.forEach(enumValue => {
        const functionLabel = getAccountTypeLabel(enumValue);
        const directLabel = AccountTypeLabels[enumValue];
        expect(functionLabel).toBe(directLabel);
      });
    });
  });

  describe('when using enum in real scenarios', () => {
    it('should work as object keys', () => {
      // Arrange
      const accountCounts = {
        [AccountType.CHECKING]: 5,
        [AccountType.SAVINGS]: 3,
        [AccountType.INVESTMENT]: 2,
        [AccountType.CASH]: 1,
      };

      // Act & Assert
      expect(accountCounts[AccountType.CHECKING]).toBe(5);
      expect(accountCounts[AccountType.SAVINGS]).toBe(3);
      expect(accountCounts[AccountType.INVESTMENT]).toBe(2);
      expect(accountCounts[AccountType.CASH]).toBe(1);
    });

    it('should work in switch statements', () => {
      // Arrange
      const getInterestRate = (type: AccountType): number => {
        switch (type) {
          case AccountType.CHECKING:
            return 0.0;
          case AccountType.SAVINGS:
            return 0.5;
          case AccountType.INVESTMENT:
            return 8.0;
          case AccountType.CASH:
            return 0.0;
          default:
            return 0.0;
        }
      };

      // Act & Assert
      expect(getInterestRate(AccountType.CHECKING)).toBe(0.0);
      expect(getInterestRate(AccountType.SAVINGS)).toBe(0.5);
      expect(getInterestRate(AccountType.INVESTMENT)).toBe(8.0);
      expect(getInterestRate(AccountType.CASH)).toBe(0.0);
    });

    it('should work with Array.includes', () => {
      // Arrange
      const bankAccounts = [AccountType.CHECKING, AccountType.SAVINGS, AccountType.INVESTMENT];
      const physicalAccounts = [AccountType.CASH];

      // Act & Assert
      expect(bankAccounts.includes(AccountType.CHECKING)).toBe(true);
      expect(bankAccounts.includes(AccountType.SAVINGS)).toBe(true);
      expect(bankAccounts.includes(AccountType.INVESTMENT)).toBe(true);
      expect(bankAccounts.includes(AccountType.CASH)).toBe(false);

      expect(physicalAccounts.includes(AccountType.CASH)).toBe(true);
      expect(physicalAccounts.includes(AccountType.CHECKING)).toBe(false);
    });

    it('should support filtering operations', () => {
      // Arrange
      const accounts = [
        { type: AccountType.CHECKING, balance: 1000 },
        { type: AccountType.SAVINGS, balance: 5000 },
        { type: AccountType.INVESTMENT, balance: 10000 },
        { type: AccountType.CASH, balance: 200 },
        { type: AccountType.CHECKING, balance: 2000 },
      ];

      // Act
      const checkingAccounts = accounts.filter(a => a.type === AccountType.CHECKING);
      const investmentAccounts = accounts.filter(a => a.type === AccountType.INVESTMENT);

      // Assert
      expect(checkingAccounts.length).toBe(2);
      expect(investmentAccounts.length).toBe(1);
      expect(checkingAccounts.every(a => a.type === AccountType.CHECKING)).toBe(true);
      expect(investmentAccounts.every(a => a.type === AccountType.INVESTMENT)).toBe(true);
    });
  });

  describe('edge cases and boundary conditions', () => {
    it('should handle string comparison correctly', () => {
      // Arrange
      const stringValue = 'CHECKING';
      const enumValue = AccountType.CHECKING;

      // Act & Assert
      expect(stringValue === enumValue).toBe(true);
      expect(stringValue).toBe(enumValue);
    });

    it('should demonstrate enum behavior', () => {
      // Arrange
      const originalChecking = AccountType.CHECKING;
      const originalCheckingString = 'CHECKING';

      // Act & Assert - demonstrate that enum value equals string
      expect(originalChecking).toBe(originalCheckingString);
      expect(typeof originalChecking).toBe('string');

      // Enum behavior: values are string literals
      expect(AccountType.CHECKING).toBe('CHECKING');
      expect(AccountType.SAVINGS).toBe('SAVINGS');
      expect(AccountType.INVESTMENT).toBe('INVESTMENT');
      expect(AccountType.CASH).toBe('CASH');
    });

    it('should handle JSON serialization', () => {
      // Arrange
      const data = {
        type: AccountType.SAVINGS,
        balance: 5000
      };

      // Act
      const jsonString = JSON.stringify(data);
      const parsed = JSON.parse(jsonString);

      // Assert
      expect(parsed.type).toBe('SAVINGS');
      expect(isValidAccountType(parsed.type)).toBe(true);
    });

    it('should handle case sensitivity', () => {
      // Arrange & Act & Assert
      expect(isValidAccountType('CHECKING')).toBe(true); // Only exact match
      expect(isValidAccountType('checking')).toBe(false);
      expect(isValidAccountType('Checking')).toBe(false);
      expect(isValidAccountType('ChEcKiNg')).toBe(false);
    });

    it('should handle partial matches', () => {
      // Arrange & Act & Assert
      expect(isValidAccountType('CHECK')).toBe(false);
      expect(isValidAccountType('CHECKING_ACCOUNT')).toBe(false);
      expect(isValidAccountType('SAVE')).toBe(false);
      expect(isValidAccountType('INVEST')).toBe(false);
    });
  });
});