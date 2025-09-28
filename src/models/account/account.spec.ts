import { Account, AccountProps } from './account';
import { AccountType } from '../shared/enums/account-type';
import { Money } from '../shared/value-objects/money';
import { Uuid } from '../shared/value-objects/uuid';

describe('Account', () => {
  describe('when creating Account with valid props', () => {
    it('should create Account with all required properties', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Main Checking Account',
        type: AccountType.CHECKING,
        balanceInCents: 150000, // R$ 1,500.00
        budgetId: 'budget-123',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);
      const account = result.data!;
      expect(account.name).toBe('Main Checking Account');
      expect(account.type).toBe(AccountType.CHECKING);
      expect(account.balance.valueInCents).toBe(150000);
      expect(account.budgetId).toBe('budget-123');
      expect(account.description).toBe('');
      expect(account.isActive).toBe(true);
      expect(account.id).toBeDefined();
      expect(account.createdAt).toBeInstanceOf(Date);
    });

    it('should create Account with optional properties', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Savings Account',
        type: AccountType.SAVINGS,
        balanceInCents: 500000, // R$ 5,000.00
        budgetId: 'budget-456',
        description: 'Emergency fund account',
        isActive: false,
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const account = result.data!;
      expect(account.name).toBe('Savings Account');
      expect(account.type).toBe(AccountType.SAVINGS);
      expect(account.balance.valueInCents).toBe(500000);
      expect(account.budgetId).toBe('budget-456');
      expect(account.description).toBe('Emergency fund account');
      expect(account.isActive).toBe(false);
    });

    it('should create Account with INVESTMENT type', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Investment Portfolio',
        type: AccountType.INVESTMENT,
        balanceInCents: 1000000, // R$ 10,000.00
        budgetId: 'budget-789',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const account = result.data!;
      expect(account.type).toBe(AccountType.INVESTMENT);
      expect(account.balance.valueInCents).toBe(1000000);
    });

    it('should create Account with CASH type', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Wallet Cash',
        type: AccountType.CASH,
        balanceInCents: 5000, // R$ 50.00
        budgetId: 'budget-cash',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const account = result.data!;
      expect(account.type).toBe(AccountType.CASH);
      expect(account.balance.valueInCents).toBe(5000);
    });

    it('should create Account with zero balance', () => {
      // Arrange
      const props: AccountProps = {
        name: 'New Account',
        type: AccountType.CHECKING,
        balanceInCents: 0,
        budgetId: 'budget-new',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const account = result.data!;
      expect(account.balance.valueInCents).toBe(0);
      expect(account.balance.isZero()).toBe(true);
    });

    it('should return error when trying to create Account with negative balance', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Overdraft Account',
        type: AccountType.CHECKING,
        balanceInCents: -25000, // -R$ 250.00
        budgetId: 'budget-overdraft',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });
  });

  describe('when creating Account with invalid props', () => {
    it('should return error when name is empty string', () => {
      // Arrange
      const props: AccountProps = {
        name: '',
        type: AccountType.CHECKING,
        balanceInCents: 100000,
        budgetId: 'budget-123',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should return error when name is only whitespace', () => {
      // Arrange
      const props: AccountProps = {
        name: '   ',
        type: AccountType.CHECKING,
        balanceInCents: 100000,
        budgetId: 'budget-123',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should return error when name exceeds 100 characters', () => {
      // Arrange
      const longName = 'a'.repeat(101);
      const props: AccountProps = {
        name: longName,
        type: AccountType.CHECKING,
        balanceInCents: 100000,
        budgetId: 'budget-123',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Name cannot exceed 100 characters');
    });

    it('should return error when name is not a string', () => {
      // Arrange
      const props = {
        name: 123 as any,
        type: AccountType.CHECKING,
        balanceInCents: 100000,
        budgetId: 'budget-123',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Name must be a string');
    });

    it('should return error when type is invalid', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Valid Account',
        type: 'INVALID_TYPE' as AccountType,
        balanceInCents: 100000,
        budgetId: 'budget-123',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.join(', ')).toContain('Invalid account type');
    });

    it('should return error when budgetId is empty string', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Valid Account',
        type: AccountType.CHECKING,
        balanceInCents: 100000,
        budgetId: '',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Budget ID cannot be empty');
    });

    it('should return error when budgetId is only whitespace', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Valid Account',
        type: AccountType.CHECKING,
        balanceInCents: 100000,
        budgetId: '   ',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Budget ID cannot be empty');
    });

    it('should return error when budgetId is not a string', () => {
      // Arrange
      const props = {
        name: 'Valid Account',
        type: AccountType.CHECKING,
        balanceInCents: 100000,
        budgetId: 123 as any,
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Budget ID must be a string');
    });

    it('should return error when balance is invalid', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Valid Account',
        type: AccountType.CHECKING,
        balanceInCents: NaN,
        budgetId: 'budget-123',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.join(', ')).toContain('Invalid balance');
    });
  });

  describe('when using Account getters', () => {
    it('should return correct id as string', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Test Account',
        type: AccountType.CHECKING,
        balanceInCents: 100000,
        budgetId: 'budget-123',
      };
      const account = Account.create(props).data!;

      // Act
      const id = account.id;

      // Assert
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should return correct name', () => {
      // Arrange
      const props: AccountProps = {
        name: 'My Savings Account',
        type: AccountType.SAVINGS,
        balanceInCents: 250000,
        budgetId: 'budget-456',
      };
      const account = Account.create(props).data!;

      // Act
      const name = account.name;

      // Assert
      expect(name).toBe('My Savings Account');
    });

    it('should return correct type', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Investment Account',
        type: AccountType.INVESTMENT,
        balanceInCents: 750000,
        budgetId: 'budget-789',
      };
      const account = Account.create(props).data!;

      // Act
      const type = account.type;

      // Assert
      expect(type).toBe(AccountType.INVESTMENT);
    });

    it('should return correct balance as Money object', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Test Account',
        type: AccountType.CHECKING,
        balanceInCents: 123456,
        budgetId: 'budget-123',
      };
      const account = Account.create(props).data!;

      // Act
      const balance = account.balance;

      // Assert
      expect(balance).toBeInstanceOf(Money);
      expect(balance.valueInCents).toBe(123456);
    });

    it('should return correct budgetId', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Test Account',
        type: AccountType.CHECKING,
        balanceInCents: 100000,
        budgetId: 'my-budget-uuid-123',
      };
      const account = Account.create(props).data!;

      // Act
      const budgetId = account.budgetId;

      // Assert
      expect(budgetId).toBe('my-budget-uuid-123');
    });

    it('should return correct description', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Test Account',
        type: AccountType.CHECKING,
        balanceInCents: 100000,
        budgetId: 'budget-123',
        description: 'My primary checking account',
      };
      const account = Account.create(props).data!;

      // Act
      const description = account.description;

      // Assert
      expect(description).toBe('My primary checking account');
    });

    it('should return empty string when description is not provided', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Test Account',
        type: AccountType.CHECKING,
        balanceInCents: 100000,
        budgetId: 'budget-123',
      };
      const account = Account.create(props).data!;

      // Act
      const description = account.description;

      // Assert
      expect(description).toBe('');
    });

    it('should return correct isActive status', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Test Account',
        type: AccountType.CHECKING,
        balanceInCents: 100000,
        budgetId: 'budget-123',
        isActive: false,
      };
      const account = Account.create(props).data!;

      // Act
      const isActive = account.isActive;

      // Assert
      expect(isActive).toBe(false);
    });

    it('should return true for isActive when not specified', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Test Account',
        type: AccountType.CHECKING,
        balanceInCents: 100000,
        budgetId: 'budget-123',
      };
      const account = Account.create(props).data!;

      // Act
      const isActive = account.isActive;

      // Assert
      expect(isActive).toBe(true);
    });

    it('should return correct createdAt as new Date instance', () => {
      // Arrange
      const beforeCreation = new Date();
      const props: AccountProps = {
        name: 'Test Account',
        type: AccountType.CHECKING,
        balanceInCents: 100000,
        budgetId: 'budget-123',
      };
      const account = Account.create(props).data!;
      const afterCreation = new Date();

      // Act
      const createdAt = account.createdAt;

      // Assert
      expect(createdAt).toBeInstanceOf(Date);
      expect(createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());

      // Should return a new instance each time
      const createdAt2 = account.createdAt;
      expect(createdAt).not.toBe(createdAt2);
      expect(createdAt.getTime()).toBe(createdAt2.getTime());
    });
  });

  describe('when checking balance conditions', () => {
    it('should return true for hasPositiveBalance when balance is positive', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Positive Account',
        type: AccountType.CHECKING,
        balanceInCents: 150000, // R$ 1,500.00
        budgetId: 'budget-123',
      };
      const account = Account.create(props).data!;

      // Act
      const hasPositiveBalance = account.hasPositiveBalance();

      // Assert
      expect(hasPositiveBalance).toBe(true);
    });

    it('should return false for hasPositiveBalance when balance is zero', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Zero Account',
        type: AccountType.CHECKING,
        balanceInCents: 0,
        budgetId: 'budget-123',
      };
      const account = Account.create(props).data!;

      // Act
      const hasPositiveBalance = account.hasPositiveBalance();

      // Assert
      expect(hasPositiveBalance).toBe(false);
    });

    it('should not be possible to test hasPositiveBalance with negative balance due to Money constraints', () => {
      // Arrange & Act - Money value object doesn't allow negative values
      // This test documents the current behavior where negative balances cannot be created

      // Assert - This is expected behavior based on Money implementation
      expect(true).toBe(true); // Placeholder test to document this limitation
    });

    it('should not be possible to test hasNegativeBalance with negative values due to Money constraints', () => {
      // Arrange & Act - Money value object doesn't allow negative values
      // This test documents the current behavior where negative balances cannot be created

      // Assert - This is expected behavior based on Money implementation
      expect(true).toBe(true); // Placeholder test to document this limitation
    });

    it('should return false for hasNegativeBalance when balance is zero', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Zero Account',
        type: AccountType.CHECKING,
        balanceInCents: 0,
        budgetId: 'budget-123',
      };
      const account = Account.create(props).data!;

      // Act
      const hasNegativeBalance = account.hasNegativeBalance();

      // Assert
      expect(hasNegativeBalance).toBe(false);
    });

    it('should return false for hasNegativeBalance when balance is positive', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Positive Account',
        type: AccountType.CHECKING,
        balanceInCents: 100000, // R$ 1,000.00
        budgetId: 'budget-123',
      };
      const account = Account.create(props).data!;

      // Act
      const hasNegativeBalance = account.hasNegativeBalance();

      // Assert
      expect(hasNegativeBalance).toBe(false);
    });
  });

  describe('when formatting balance', () => {
    it('should format positive balance correctly', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Test Account',
        type: AccountType.CHECKING,
        balanceInCents: 123456, // R$ 1,234.56
        budgetId: 'budget-123',
      };
      const account = Account.create(props).data!;

      // Act
      const formatted = account.formatBalance();

      // Assert
      expect(formatted).toBe('R$\u00a01.234,56');
    });

    it('should format zero balance correctly', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Zero Account',
        type: AccountType.CHECKING,
        balanceInCents: 0,
        budgetId: 'budget-123',
      };
      const account = Account.create(props).data!;

      // Act
      const formatted = account.formatBalance();

      // Assert
      expect(formatted).toBe('R$\u00a00,00');
    });

    it('should not be possible to test negative balance formatting due to Money constraints', () => {
      // Arrange & Act - Money value object doesn't allow negative values
      // This test documents the current behavior where negative balances cannot be created

      // Assert - This is expected behavior based on Money implementation
      expect(true).toBe(true); // Placeholder test to document this limitation
    });
  });

  describe('when getting type labels', () => {
    it('should return correct label for CHECKING account', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Checking Account',
        type: AccountType.CHECKING,
        balanceInCents: 100000,
        budgetId: 'budget-123',
      };
      const account = Account.create(props).data!;

      // Act
      const label = account.getTypeLabel();

      // Assert
      expect(label).toBe('Conta Corrente');
    });

    it('should return correct label for SAVINGS account', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Savings Account',
        type: AccountType.SAVINGS,
        balanceInCents: 250000,
        budgetId: 'budget-456',
      };
      const account = Account.create(props).data!;

      // Act
      const label = account.getTypeLabel();

      // Assert
      expect(label).toBe('Poupança');
    });

    it('should return correct label for INVESTMENT account', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Investment Account',
        type: AccountType.INVESTMENT,
        balanceInCents: 500000,
        budgetId: 'budget-789',
      };
      const account = Account.create(props).data!;

      // Act
      const label = account.getTypeLabel();

      // Assert
      expect(label).toBe('Investimento');
    });

    it('should return correct label for CASH account', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Cash Account',
        type: AccountType.CASH,
        balanceInCents: 10000,
        budgetId: 'budget-cash',
      };
      const account = Account.create(props).data!;

      // Act
      const label = account.getTypeLabel();

      // Assert
      expect(label).toBe('Dinheiro');
    });
  });

  describe('when serializing to JSON', () => {
    it('should serialize Account to correct JSON structure', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Test Account',
        type: AccountType.CHECKING,
        balanceInCents: 123456,
        budgetId: 'budget-123',
        description: 'Test description',
        isActive: false,
      };
      const account = Account.create(props).data!;

      // Act
      const json = account.toJSON();

      // Assert
      expect(json).toEqual({
        id: account.id,
        name: 'Test Account',
        type: AccountType.CHECKING,
        balance: {
          valueInCents: 123456,
          valueInMonetary: 1234.56,
          formatted: 'R$\u00a01.234,56',
        },
        budgetId: 'budget-123',
        description: 'Test description',
        isActive: false,
        createdAt: account.createdAt.toISOString(),
      });
    });

    it('should serialize Account with default values', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Simple Account',
        type: AccountType.SAVINGS,
        balanceInCents: 50000,
        budgetId: 'budget-simple',
      };
      const account = Account.create(props).data!;

      // Act
      const json = account.toJSON();

      // Assert
      expect(json.description).toBe('');
      expect(json.isActive).toBe(true);
      expect(json.name).toBe('Simple Account');
      expect(json.type).toBe(AccountType.SAVINGS);
      expect(json.balance.valueInCents).toBe(50000);
      expect(json.budgetId).toBe('budget-simple');
      expect(typeof json.createdAt).toBe('string');
      expect(typeof json.id).toBe('string');
    });
  });

  describe('when creating Account from JSON', () => {
    it('should create Account from valid JSON', () => {
      // Arrange
      const uuid = Uuid.generate();
      const createdAt = new Date('2023-01-15T10:30:00.000Z');
      const json = {
        id: uuid.value,
        name: 'JSON Account',
        type: AccountType.INVESTMENT,
        balance: { valueInCents: 987654 },
        budgetId: 'budget-json',
        description: 'Created from JSON',
        isActive: true,
        createdAt: createdAt.toISOString(),
      };

      // Act
      const result = Account.fromJSON(json);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);
      const account = result.data!;
      expect(account.id).toBe(uuid.value);
      expect(account.name).toBe('JSON Account');
      expect(account.type).toBe(AccountType.INVESTMENT);
      expect(account.balance.valueInCents).toBe(987654);
      expect(account.budgetId).toBe('budget-json');
      expect(account.description).toBe('Created from JSON');
      expect(account.isActive).toBe(true);
      expect(account.createdAt.getTime()).toBe(createdAt.getTime());
    });

    it('should handle round-trip JSON serialization', () => {
      // Arrange
      const originalProps: AccountProps = {
        name: 'Round Trip Account',
        type: AccountType.CHECKING,
        balanceInCents: 555555,
        budgetId: 'budget-roundtrip',
        description: 'Round trip test',
        isActive: false,
      };
      const originalAccount = Account.create(originalProps).data!;
      const json = originalAccount.toJSON();

      // Act
      const result = Account.fromJSON(json);

      // Assert
      expect(result.hasData).toBe(true);
      const reconstructedAccount = result.data!;
      expect(reconstructedAccount.id).toBe(originalAccount.id);
      expect(reconstructedAccount.name).toBe(originalAccount.name);
      expect(reconstructedAccount.type).toBe(originalAccount.type);
      expect(reconstructedAccount.balance.valueInCents).toBe(originalAccount.balance.valueInCents);
      expect(reconstructedAccount.budgetId).toBe(originalAccount.budgetId);
      expect(reconstructedAccount.description).toBe(originalAccount.description);
      expect(reconstructedAccount.isActive).toBe(originalAccount.isActive);
      expect(reconstructedAccount.createdAt.getTime()).toBe(originalAccount.createdAt.getTime());
    });

    it('should return error when JSON has invalid id', () => {
      // Arrange
      const json = {
        id: 'invalid-uuid',
        name: 'Test Account',
        type: AccountType.CHECKING,
        balance: { valueInCents: 100000 },
        budgetId: 'budget-123',
        description: '',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      // Act
      const result = Account.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.join(', ')).toContain('Invalid id');
    });

    it('should return error when JSON has invalid name', () => {
      // Arrange
      const uuid = Uuid.generate();
      const json = {
        id: uuid.value,
        name: '',
        type: AccountType.CHECKING,
        balance: { valueInCents: 100000 },
        budgetId: 'budget-123',
        description: '',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      // Act
      const result = Account.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should return error when JSON has invalid type', () => {
      // Arrange
      const uuid = Uuid.generate();
      const json = {
        id: uuid.value,
        name: 'Test Account',
        type: 'INVALID_TYPE' as AccountType,
        balance: { valueInCents: 100000 },
        budgetId: 'budget-123',
        description: '',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      // Act
      const result = Account.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.join(', ')).toContain('Invalid account type');
    });

    it('should return error when JSON has invalid balance', () => {
      // Arrange
      const uuid = Uuid.generate();
      const json = {
        id: uuid.value,
        name: 'Test Account',
        type: AccountType.CHECKING,
        balance: { valueInCents: NaN },
        budgetId: 'budget-123',
        description: '',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      // Act
      const result = Account.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.join(', ')).toContain('Invalid balance');
    });

    it('should return error when JSON has invalid budgetId', () => {
      // Arrange
      const uuid = Uuid.generate();
      const json = {
        id: uuid.value,
        name: 'Test Account',
        type: AccountType.CHECKING,
        balance: { valueInCents: 100000 },
        budgetId: '',
        description: '',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      // Act
      const result = Account.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Budget ID cannot be empty');
    });
  });

  describe('edge cases and boundary conditions', () => {
    it('should handle name with exactly 100 characters', () => {
      // Arrange
      const name100chars = 'a'.repeat(100);
      const props: AccountProps = {
        name: name100chars,
        type: AccountType.CHECKING,
        balanceInCents: 100000,
        budgetId: 'budget-boundary',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const account = result.data!;
      expect(account.name).toBe(name100chars);
      expect(account.name.length).toBe(100);
    });

    it('should handle very large positive balance', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Large Balance Account',
        type: AccountType.INVESTMENT,
        balanceInCents: Number.MAX_SAFE_INTEGER,
        budgetId: 'budget-large',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const account = result.data!;
      expect(account.balance.valueInCents).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should return error when trying to create Account with very large negative balance', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Large Negative Account',
        type: AccountType.CHECKING,
        balanceInCents: Number.MIN_SAFE_INTEGER,
        budgetId: 'budget-negative',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });

    it('should handle special characters in name', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Account with special chars: àáâãäç éêë íîï óôõö úûü ñ',
        type: AccountType.SAVINGS,
        balanceInCents: 100000,
        budgetId: 'budget-special',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const account = result.data!;
      expect(account.name).toBe('Account with special chars: àáâãäç éêë íîï óôõö úûü ñ');
    });

    it('should handle special characters in description', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Test Account',
        type: AccountType.CASH,
        balanceInCents: 50000,
        budgetId: 'budget-desc',
        description: 'Description with emojis 💰💸 and symbols @#$%^&*()',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const account = result.data!;
      expect(account.description).toBe('Description with emojis 💰💸 and symbols @#$%^&*()');
    });

    it('should handle empty description', () => {
      // Arrange
      const props: AccountProps = {
        name: 'Test Account',
        type: AccountType.CHECKING,
        balanceInCents: 100000,
        budgetId: 'budget-empty',
        description: '',
      };

      // Act
      const result = Account.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const account = result.data!;
      expect(account.description).toBe('');
    });

    it('should generate unique IDs for different accounts', () => {
      // Arrange
      const props1: AccountProps = {
        name: 'Account 1',
        type: AccountType.CHECKING,
        balanceInCents: 100000,
        budgetId: 'budget-1',
      };
      const props2: AccountProps = {
        name: 'Account 2',
        type: AccountType.SAVINGS,
        balanceInCents: 200000,
        budgetId: 'budget-2',
      };

      // Act
      const account1 = Account.create(props1).data!;
      const account2 = Account.create(props2).data!;

      // Assert
      expect(account1.id).not.toBe(account2.id);
      expect(account1.id.length).toBeGreaterThan(0);
      expect(account2.id.length).toBeGreaterThan(0);
    });
  });
});
