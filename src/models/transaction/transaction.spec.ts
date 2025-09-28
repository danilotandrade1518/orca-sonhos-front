import { Transaction, TransactionProps } from './transaction';
import { TransactionType } from '../shared/enums/transaction-type';

describe('Transaction', () => {
  describe('when creating a new Transaction with valid props', () => {
    it('should create transaction successfully with all required fields', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 150.75,
        type: TransactionType.INCOME,
        accountId: 'account-123',
        categoryId: 'category-456',
      };

      // Act
      const result = Transaction.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);

      const transaction = result.data!;
      expect(transaction.amount.valueInMonetary).toBe(150.75);
      expect(transaction.type).toBe(TransactionType.INCOME);
      expect(transaction.accountId).toBe('account-123');
      expect(transaction.categoryId).toBe('category-456');
      expect(transaction.description).toBe('');
      expect(transaction.isRecurring).toBe(false);
      expect(transaction.id).toBeDefined();
      expect(transaction.executedAt).toBeInstanceOf(Date);
      expect(transaction.createdAt).toBeInstanceOf(Date);
    });

    it('should create transaction successfully with all optional fields', () => {
      // Arrange
      const executedAt = new Date('2024-01-15T10:30:00Z');
      const props: TransactionProps = {
        amount: 299.99,
        type: TransactionType.EXPENSE,
        accountId: 'account-789',
        categoryId: 'category-101',
        description: 'Monthly subscription payment',
        executedAt: executedAt,
        isRecurring: true,
      };

      // Act
      const result = Transaction.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);

      const transaction = result.data!;
      expect(transaction.amount.valueInMonetary).toBe(299.99);
      expect(transaction.type).toBe(TransactionType.EXPENSE);
      expect(transaction.accountId).toBe('account-789');
      expect(transaction.categoryId).toBe('category-101');
      expect(transaction.description).toBe('Monthly subscription payment');
      expect(transaction.executedAt).toEqual(executedAt);
      expect(transaction.isRecurring).toBe(true);
    });

    it('should create transaction with zero amount', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 0,
        type: TransactionType.INCOME,
        accountId: 'account-zero',
        categoryId: 'category-zero',
      };

      // Act
      const result = Transaction.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.amount.valueInMonetary).toBe(0);
    });

    it('should create transaction with large amount', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 999999.99,
        type: TransactionType.INCOME,
        accountId: 'account-large',
        categoryId: 'category-large',
      };

      // Act
      const result = Transaction.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.amount.valueInMonetary).toBe(999999.99);
    });
  });

  describe('when creating Transaction with invalid props', () => {
    it('should return error when amount is negative', () => {
      // Arrange
      const props: TransactionProps = {
        amount: -50.0,
        type: TransactionType.EXPENSE,
        accountId: 'account-123',
        categoryId: 'category-456',
      };

      // Act
      const result = Transaction.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });

    it('should return error when type is invalid', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 100.0,
        type: 'INVALID_TYPE' as TransactionType,
        accountId: 'account-123',
        categoryId: 'category-456',
      };

      // Act
      const result = Transaction.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Invalid transaction type. Must be one of: INCOME, EXPENSE');
    });

    it('should return error when accountId is empty string', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 100.0,
        type: TransactionType.INCOME,
        accountId: '',
        categoryId: 'category-456',
      };

      // Act
      const result = Transaction.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Account ID cannot be empty');
    });

    it('should return error when accountId is whitespace only', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 100.0,
        type: TransactionType.INCOME,
        accountId: '   ',
        categoryId: 'category-456',
      };

      // Act
      const result = Transaction.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Account ID cannot be empty');
    });

    it('should return error when accountId is not a string', () => {
      // Arrange
      const props: any = {
        amount: 100.0,
        type: TransactionType.INCOME,
        accountId: 123,
        categoryId: 'category-456',
      };

      // Act
      const result = Transaction.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Account ID must be a string');
    });

    it('should return error when categoryId is empty string', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 100.0,
        type: TransactionType.INCOME,
        accountId: 'account-123',
        categoryId: '',
      };

      // Act
      const result = Transaction.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Category ID cannot be empty');
    });

    it('should return error when categoryId is whitespace only', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 100.0,
        type: TransactionType.INCOME,
        accountId: 'account-123',
        categoryId: '   ',
      };

      // Act
      const result = Transaction.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Category ID cannot be empty');
    });

    it('should return error when categoryId is not a string', () => {
      // Arrange
      const props: any = {
        amount: 100.0,
        type: TransactionType.INCOME,
        accountId: 'account-123',
        categoryId: 456,
      };

      // Act
      const result = Transaction.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Category ID must be a string');
    });

    it('should return error when amount has invalid format', () => {
      // Arrange
      const props: any = {
        amount: 'invalid-amount',
        type: TransactionType.INCOME,
        accountId: 'account-123',
        categoryId: 'category-456',
      };

      // Act
      const result = Transaction.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value must be a number');
    });
  });

  describe('when accessing Transaction properties', () => {
    let transaction: Transaction;

    beforeEach(() => {
      // Arrange
      const executedAt = new Date('2024-03-20T14:45:30Z');
      const props: TransactionProps = {
        amount: 1250.5,
        type: TransactionType.EXPENSE,
        accountId: 'account-test',
        categoryId: 'category-test',
        description: 'Test transaction description',
        executedAt: executedAt,
        isRecurring: true,
      };

      transaction = Transaction.create(props).data!;
    });

    it('should return correct id', () => {
      // Act
      const id = transaction.id;

      // Assert
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should return correct amount as Money object', () => {
      // Act
      const amount = transaction.amount;

      // Assert
      expect(amount.valueInMonetary).toBe(1250.5);
      expect(amount.valueInCents).toBe(125050);
    });

    it('should return correct type', () => {
      // Act
      const type = transaction.type;

      // Assert
      expect(type).toBe(TransactionType.EXPENSE);
    });

    it('should return correct accountId', () => {
      // Act
      const accountId = transaction.accountId;

      // Assert
      expect(accountId).toBe('account-test');
    });

    it('should return correct categoryId', () => {
      // Act
      const categoryId = transaction.categoryId;

      // Assert
      expect(categoryId).toBe('category-test');
    });

    it('should return correct description', () => {
      // Act
      const description = transaction.description;

      // Assert
      expect(description).toBe('Test transaction description');
    });

    it('should return correct executedAt date as new instance', () => {
      // Act
      const executedAt = transaction.executedAt;

      // Assert
      expect(executedAt).toEqual(new Date('2024-03-20T14:45:30Z'));
      expect(executedAt).not.toBe(transaction.executedAt); // Different instances
    });

    it('should return correct isRecurring flag', () => {
      // Act
      const isRecurring = transaction.isRecurring;

      // Assert
      expect(isRecurring).toBe(true);
    });

    it('should return correct createdAt date as new instance', () => {
      // Act
      const createdAt = transaction.createdAt;

      // Assert
      expect(createdAt).toBeInstanceOf(Date);
      expect(createdAt).not.toBe(transaction.createdAt); // Different instances
    });
  });

  describe('when using business methods', () => {
    it('should return true for isIncome when type is INCOME', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 5000.0,
        type: TransactionType.INCOME,
        accountId: 'account-income',
        categoryId: 'category-salary',
      };
      const transaction = Transaction.create(props).data!;

      // Act
      const isIncome = transaction.isIncome();

      // Assert
      expect(isIncome).toBe(true);
    });

    it('should return false for isIncome when type is EXPENSE', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 200.0,
        type: TransactionType.EXPENSE,
        accountId: 'account-expense',
        categoryId: 'category-food',
      };
      const transaction = Transaction.create(props).data!;

      // Act
      const isIncome = transaction.isIncome();

      // Assert
      expect(isIncome).toBe(false);
    });

    it('should return true for isExpense when type is EXPENSE', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 150.75,
        type: TransactionType.EXPENSE,
        accountId: 'account-expense',
        categoryId: 'category-shopping',
      };
      const transaction = Transaction.create(props).data!;

      // Act
      const isExpense = transaction.isExpense();

      // Assert
      expect(isExpense).toBe(true);
    });

    it('should return false for isExpense when type is INCOME', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 3000.0,
        type: TransactionType.INCOME,
        accountId: 'account-income',
        categoryId: 'category-bonus',
      };
      const transaction = Transaction.create(props).data!;

      // Act
      const isExpense = transaction.isExpense();

      // Assert
      expect(isExpense).toBe(false);
    });

    it('should format amount correctly in BRL', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 1234.56,
        type: TransactionType.INCOME,
        accountId: 'account-format',
        categoryId: 'category-format',
      };
      const transaction = Transaction.create(props).data!;

      // Act
      const formatted = transaction.formatAmount();

      // Assert
      expect(formatted).toBe('R$\u00a01.234,56');
    });

    it('should get correct type label for INCOME', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 2500.0,
        type: TransactionType.INCOME,
        accountId: 'account-label',
        categoryId: 'category-label',
      };
      const transaction = Transaction.create(props).data!;

      // Act
      const typeLabel = transaction.getTypeLabel();

      // Assert
      expect(typeLabel).toBe('Receita');
    });

    it('should get correct type label for EXPENSE', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 890.25,
        type: TransactionType.EXPENSE,
        accountId: 'account-label',
        categoryId: 'category-label',
      };
      const transaction = Transaction.create(props).data!;

      // Act
      const typeLabel = transaction.getTypeLabel();

      // Assert
      expect(typeLabel).toBe('Despesa');
    });
  });

  describe('when serializing to JSON', () => {
    it('should convert transaction to JSON correctly', () => {
      // Arrange
      const executedAt = new Date('2024-05-10T09:15:45Z');
      const props: TransactionProps = {
        amount: 875.3,
        type: TransactionType.EXPENSE,
        accountId: 'account-json',
        categoryId: 'category-json',
        description: 'JSON test transaction',
        executedAt: executedAt,
        isRecurring: false,
      };
      const transaction = Transaction.create(props).data!;

      // Act
      const json = transaction.toJSON();

      // Assert
      expect(json.id).toBe(transaction.id);
      expect(json.amount.valueInCents).toBe(87530);
      expect(json.amount.valueInMonetary).toBe(875.3);
      expect(json.amount.formatted).toBe('R$\u00a0875,30');
      expect(json.type).toBe(TransactionType.EXPENSE);
      expect(json.accountId).toBe('account-json');
      expect(json.categoryId).toBe('category-json');
      expect(json.description).toBe('JSON test transaction');
      expect(json.executedAt).toBe('2024-05-10T09:15:45.000Z');
      expect(json.isRecurring).toBe(false);
      expect(json.createdAt).toBeDefined();
      expect(typeof json.createdAt).toBe('string');
    });

    it('should include all fields in JSON output', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 999.99,
        type: TransactionType.INCOME,
        accountId: 'account-complete',
        categoryId: 'category-complete',
      };
      const transaction = Transaction.create(props).data!;

      // Act
      const json = transaction.toJSON();

      // Assert
      const expectedKeys = [
        'id',
        'amount',
        'type',
        'accountId',
        'categoryId',
        'description',
        'executedAt',
        'isRecurring',
        'createdAt',
      ];
      expectedKeys.forEach((key) => {
        expect(json.hasOwnProperty(key)).toBe(true);
      });

      expect(Object.keys(json).length).toBe(expectedKeys.length);
    });

    it('should handle empty description in JSON', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 500.0,
        type: TransactionType.INCOME,
        accountId: 'account-empty-desc',
        categoryId: 'category-empty-desc',
      };
      const transaction = Transaction.create(props).data!;

      // Act
      const json = transaction.toJSON();

      // Assert
      expect(json.description).toBe('');
    });
  });

  describe('when deserializing from JSON', () => {
    it('should create transaction from valid JSON', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        amount: { valueInCents: 123450 },
        type: TransactionType.INCOME,
        accountId: 'account-from-json',
        categoryId: 'category-from-json',
        description: 'Restored from JSON',
        executedAt: '2024-07-25T16:30:00.000Z',
        isRecurring: true,
        createdAt: '2024-07-25T16:25:00.000Z',
      };

      // Act
      const result = Transaction.fromJSON(json);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);

      const transaction = result.data!;
      expect(transaction.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(transaction.amount.valueInCents).toBe(123450);
      expect(transaction.amount.valueInMonetary).toBe(1234.5);
      expect(transaction.type).toBe(TransactionType.INCOME);
      expect(transaction.accountId).toBe('account-from-json');
      expect(transaction.categoryId).toBe('category-from-json');
      expect(transaction.description).toBe('Restored from JSON');
      expect(transaction.executedAt).toEqual(new Date('2024-07-25T16:30:00.000Z'));
      expect(transaction.isRecurring).toBe(true);
      expect(transaction.createdAt).toEqual(new Date('2024-07-25T16:25:00.000Z'));
    });

    it('should return error when JSON has invalid id', () => {
      // Arrange
      const json = {
        id: 'invalid-uuid-format',
        amount: { valueInCents: 50000 },
        type: TransactionType.EXPENSE,
        accountId: 'account-invalid-id',
        categoryId: 'category-invalid-id',
        description: 'Invalid ID test',
        executedAt: '2024-07-25T16:30:00.000Z',
        isRecurring: false,
        createdAt: '2024-07-25T16:25:00.000Z',
      };

      // Act
      const result = Transaction.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Invalid UUID format');
    });

    it('should return error when JSON has invalid amount', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        amount: { valueInCents: -50000 },
        type: TransactionType.EXPENSE,
        accountId: 'account-invalid-amount',
        categoryId: 'category-invalid-amount',
        description: 'Invalid amount test',
        executedAt: '2024-07-25T16:30:00.000Z',
        isRecurring: false,
        createdAt: '2024-07-25T16:25:00.000Z',
      };

      // Act
      const result = Transaction.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });

    it('should return error when JSON has invalid type', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        amount: { valueInCents: 50000 },
        type: 'INVALID_TYPE' as TransactionType,
        accountId: 'account-invalid-type',
        categoryId: 'category-invalid-type',
        description: 'Invalid type test',
        executedAt: '2024-07-25T16:30:00.000Z',
        isRecurring: false,
        createdAt: '2024-07-25T16:25:00.000Z',
      };

      // Act
      const result = Transaction.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Invalid transaction type. Must be one of: INCOME, EXPENSE');
    });

    it('should return error when JSON has empty accountId', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        amount: { valueInCents: 50000 },
        type: TransactionType.EXPENSE,
        accountId: '',
        categoryId: 'category-empty-account',
        description: 'Empty account test',
        executedAt: '2024-07-25T16:30:00.000Z',
        isRecurring: false,
        createdAt: '2024-07-25T16:25:00.000Z',
      };

      // Act
      const result = Transaction.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Account ID cannot be empty');
    });

    it('should return error when JSON has empty categoryId', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        amount: { valueInCents: 50000 },
        type: TransactionType.EXPENSE,
        accountId: 'account-empty-category',
        categoryId: '',
        description: 'Empty category test',
        executedAt: '2024-07-25T16:30:00.000Z',
        isRecurring: false,
        createdAt: '2024-07-25T16:25:00.000Z',
      };

      // Act
      const result = Transaction.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Category ID cannot be empty');
    });
  });

  describe('when using Transaction in real scenarios', () => {
    it('should work in collections and filtering', () => {
      // Arrange
      const incomeProps: TransactionProps = {
        amount: 5000.0,
        type: TransactionType.INCOME,
        accountId: 'account-salary',
        categoryId: 'category-salary',
      };

      const expenseProps1: TransactionProps = {
        amount: 1200.0,
        type: TransactionType.EXPENSE,
        accountId: 'account-checking',
        categoryId: 'category-rent',
      };

      const expenseProps2: TransactionProps = {
        amount: 350.5,
        type: TransactionType.EXPENSE,
        accountId: 'account-checking',
        categoryId: 'category-food',
      };

      const transactions = [
        Transaction.create(incomeProps).data!,
        Transaction.create(expenseProps1).data!,
        Transaction.create(expenseProps2).data!,
      ];

      // Act
      const incomes = transactions.filter((t) => t.isIncome());
      const expenses = transactions.filter((t) => t.isExpense());

      // Assert
      expect(incomes.length).toBe(1);
      expect(expenses.length).toBe(2);
      expect(incomes[0].amount.valueInMonetary).toBe(5000.0);
      expect(expenses.every((t) => t.type === TransactionType.EXPENSE)).toBe(true);
    });

    it('should calculate total amounts correctly', () => {
      // Arrange
      const transactionProps = [
        { amount: 100.0, type: TransactionType.INCOME },
        { amount: 200.5, type: TransactionType.INCOME },
        { amount: 75.25, type: TransactionType.EXPENSE },
        { amount: 150.0, type: TransactionType.EXPENSE },
      ].map((props) => ({
        ...props,
        accountId: 'account-total',
        categoryId: 'category-total',
      }));

      const transactions = transactionProps.map((props) => Transaction.create(props).data!);

      // Act
      const totalIncome = transactions
        .filter((t) => t.isIncome())
        .reduce((sum, t) => sum + t.amount.valueInMonetary, 0);

      const totalExpense = transactions
        .filter((t) => t.isExpense())
        .reduce((sum, t) => sum + t.amount.valueInMonetary, 0);

      // Assert
      expect(totalIncome).toBe(300.5);
      expect(totalExpense).toBe(225.25);
    });

    it('should work with recurring transaction identification', () => {
      // Arrange
      const recurringProps: TransactionProps = {
        amount: 99.99,
        type: TransactionType.EXPENSE,
        accountId: 'account-subscription',
        categoryId: 'category-subscription',
        description: 'Monthly subscription',
        isRecurring: true,
      };

      const oneTimeProps: TransactionProps = {
        amount: 250.0,
        type: TransactionType.EXPENSE,
        accountId: 'account-onetime',
        categoryId: 'category-onetime',
        description: 'One-time purchase',
        isRecurring: false,
      };

      const transactions = [
        Transaction.create(recurringProps).data!,
        Transaction.create(oneTimeProps).data!,
      ];

      // Act
      const recurringTransactions = transactions.filter((t) => t.isRecurring);
      const oneTimeTransactions = transactions.filter((t) => !t.isRecurring);

      // Assert
      expect(recurringTransactions.length).toBe(1);
      expect(oneTimeTransactions.length).toBe(1);
      expect(recurringTransactions[0].description).toBe('Monthly subscription');
      expect(oneTimeTransactions[0].description).toBe('One-time purchase');
    });

    it('should maintain immutability', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 500.0,
        type: TransactionType.INCOME,
        accountId: 'account-immutable',
        categoryId: 'category-immutable',
        description: 'Immutability test',
      };
      const transaction = Transaction.create(props).data!;

      // Act & Assert
      const originalExecutedAt = transaction.executedAt;
      const newExecutedAt = transaction.executedAt;
      newExecutedAt.setFullYear(2000); // Try to modify returned date

      // The original transaction should not be affected
      expect(transaction.executedAt).not.toBe(newExecutedAt);
      expect(transaction.executedAt).toEqual(originalExecutedAt);
    });
  });

  describe('edge cases and boundary conditions', () => {
    it('should handle minimum positive amount', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 0.01,
        type: TransactionType.INCOME,
        accountId: 'account-min',
        categoryId: 'category-min',
      };

      // Act
      const result = Transaction.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.amount.valueInMonetary).toBe(0.01);
      expect(result.data!.amount.valueInCents).toBe(1);
    });

    it('should handle maximum reasonable amount', () => {
      // Arrange
      const props: TransactionProps = {
        amount: 999999999.99,
        type: TransactionType.INCOME,
        accountId: 'account-max',
        categoryId: 'category-max',
      };

      // Act
      const result = Transaction.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.amount.valueInMonetary).toBe(999999999.99);
    });

    it('should handle very long description', () => {
      // Arrange
      const longDescription = 'A'.repeat(1000);
      const props: TransactionProps = {
        amount: 100.0,
        type: TransactionType.EXPENSE,
        accountId: 'account-long-desc',
        categoryId: 'category-long-desc',
        description: longDescription,
      };

      // Act
      const result = Transaction.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.description).toBe(longDescription);
      expect(result.data!.description.length).toBe(1000);
    });

    it('should handle future execution dates', () => {
      // Arrange
      const futureDate = new Date('2030-12-31T23:59:59Z');
      const props: TransactionProps = {
        amount: 100.0,
        type: TransactionType.INCOME,
        accountId: 'account-future',
        categoryId: 'category-future',
        executedAt: futureDate,
      };

      // Act
      const result = Transaction.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.executedAt).toEqual(futureDate);
    });

    it('should handle past execution dates', () => {
      // Arrange
      const pastDate = new Date('1990-01-01T00:00:00Z');
      const props: TransactionProps = {
        amount: 100.0,
        type: TransactionType.EXPENSE,
        accountId: 'account-past',
        categoryId: 'category-past',
        executedAt: pastDate,
      };

      // Act
      const result = Transaction.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.executedAt).toEqual(pastDate);
    });

    it('should handle JSON serialization round-trip', () => {
      // Arrange
      const originalProps: TransactionProps = {
        amount: 1337.42,
        type: TransactionType.EXPENSE,
        accountId: 'account-roundtrip',
        categoryId: 'category-roundtrip',
        description: 'Round-trip test',
        isRecurring: true,
      };
      const originalTransaction = Transaction.create(originalProps).data!;

      // Act
      const json = originalTransaction.toJSON();
      const restoredResult = Transaction.fromJSON(json);

      // Assert
      expect(restoredResult.hasData).toBe(true);
      const restoredTransaction = restoredResult.data!;

      expect(restoredTransaction.id).toBe(originalTransaction.id);
      expect(restoredTransaction.amount.valueInMonetary).toBe(
        originalTransaction.amount.valueInMonetary,
      );
      expect(restoredTransaction.type).toBe(originalTransaction.type);
      expect(restoredTransaction.accountId).toBe(originalTransaction.accountId);
      expect(restoredTransaction.categoryId).toBe(originalTransaction.categoryId);
      expect(restoredTransaction.description).toBe(originalTransaction.description);
      expect(restoredTransaction.isRecurring).toBe(originalTransaction.isRecurring);
      expect(restoredTransaction.executedAt).toEqual(originalTransaction.executedAt);
      expect(restoredTransaction.createdAt).toEqual(originalTransaction.createdAt);
    });
  });
});
