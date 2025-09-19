import { Envelope, EnvelopeProps } from './envelope';
import { Money } from '../shared/value-objects/money';

describe('Envelope', () => {
  describe('when creating a new Envelope with valid props', () => {
    it('should create envelope successfully with all required fields', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Food Budget',
        limitInCents: 80000, // R$ 800.00
        currentBalanceInCents: 35000, // R$ 350.00
        categoryId: 'category-food',
        budgetId: 'budget-123'
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);

      const envelope = result.data!;
      expect(envelope.name).toBe('Food Budget');
      expect(envelope.limit.valueInCents).toBe(80000);
      expect(envelope.limit.valueInMonetary).toBe(800.00);
      expect(envelope.currentBalance.valueInCents).toBe(35000);
      expect(envelope.currentBalance.valueInMonetary).toBe(350.00);
      expect(envelope.categoryId).toBe('category-food');
      expect(envelope.budgetId).toBe('budget-123');
      expect(envelope.description).toBe('');
      expect(envelope.isActive).toBe(true);
      expect(envelope.id).toBeDefined();
      expect(envelope.createdAt).toBeInstanceOf(Date);
    });

    it('should create envelope successfully with all optional fields', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Entertainment Budget',
        limitInCents: 50000, // R$ 500.00
        currentBalanceInCents: 45000, // R$ 450.00
        categoryId: 'category-entertainment',
        budgetId: 'budget-premium',
        description: 'Monthly entertainment allowance',
        isActive: false
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);

      const envelope = result.data!;
      expect(envelope.name).toBe('Entertainment Budget');
      expect(envelope.limit.valueInCents).toBe(50000);
      expect(envelope.currentBalance.valueInCents).toBe(45000);
      expect(envelope.categoryId).toBe('category-entertainment');
      expect(envelope.budgetId).toBe('budget-premium');
      expect(envelope.description).toBe('Monthly entertainment allowance');
      expect(envelope.isActive).toBe(false);
    });

    it('should create envelope with zero balance', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'New Budget',
        limitInCents: 100000,
        currentBalanceInCents: 0,
        categoryId: 'category-new',
        budgetId: 'budget-new'
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.currentBalance.valueInMonetary).toBe(0);
    });

    it('should create envelope with zero limit', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'No Limit Budget',
        limitInCents: 0,
        currentBalanceInCents: 0,
        categoryId: 'category-unlimited',
        budgetId: 'budget-unlimited'
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.limit.valueInMonetary).toBe(0);
    });

    it('should create envelope with balance equal to limit', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Maxed Out Budget',
        limitInCents: 75000,
        currentBalanceInCents: 75000,
        categoryId: 'category-maxed',
        budgetId: 'budget-maxed'
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.limit.valueInMonetary).toBe(750.00);
      expect(result.data!.currentBalance.valueInMonetary).toBe(750.00);
    });
  });

  describe('when creating Envelope with invalid props', () => {
    it('should return error when name is empty string', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: '',
        limitInCents: 50000,
        currentBalanceInCents: 25000,
        categoryId: 'category-123',
        budgetId: 'budget-123'
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should return error when name is whitespace only', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: '   ',
        limitInCents: 50000,
        currentBalanceInCents: 25000,
        categoryId: 'category-123',
        budgetId: 'budget-123'
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should return error when name is not a string', () => {
      // Arrange
      const props: any = {
        name: 123,
        limitInCents: 50000,
        currentBalanceInCents: 25000,
        categoryId: 'category-123',
        budgetId: 'budget-123'
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Name must be a string');
    });

    it('should return error when name exceeds 100 characters', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'A'.repeat(101),
        limitInCents: 50000,
        currentBalanceInCents: 25000,
        categoryId: 'category-123',
        budgetId: 'budget-123'
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Name cannot exceed 100 characters');
    });

    it('should return error when limitInCents is negative', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Valid Envelope',
        limitInCents: -50000,
        currentBalanceInCents: 25000,
        categoryId: 'category-123',
        budgetId: 'budget-123'
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });

    it('should return error when currentBalanceInCents is negative', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Valid Envelope',
        limitInCents: 50000,
        currentBalanceInCents: -25000,
        categoryId: 'category-123',
        budgetId: 'budget-123'
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });

    it('should return error when categoryId is empty string', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Valid Envelope',
        limitInCents: 50000,
        currentBalanceInCents: 25000,
        categoryId: '',
        budgetId: 'budget-123'
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Category ID cannot be empty');
    });

    it('should return error when categoryId is whitespace only', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Valid Envelope',
        limitInCents: 50000,
        currentBalanceInCents: 25000,
        categoryId: '   ',
        budgetId: 'budget-123'
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Category ID cannot be empty');
    });

    it('should return error when categoryId is not a string', () => {
      // Arrange
      const props: any = {
        name: 'Valid Envelope',
        limitInCents: 50000,
        currentBalanceInCents: 25000,
        categoryId: 123,
        budgetId: 'budget-123'
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Category ID must be a string');
    });

    it('should return error when budgetId is empty string', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Valid Envelope',
        limitInCents: 50000,
        currentBalanceInCents: 25000,
        categoryId: 'category-123',
        budgetId: ''
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Budget ID cannot be empty');
    });

    it('should return error when budgetId is whitespace only', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Valid Envelope',
        limitInCents: 50000,
        currentBalanceInCents: 25000,
        categoryId: 'category-123',
        budgetId: '   '
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Budget ID cannot be empty');
    });

    it('should return error when budgetId is not a string', () => {
      // Arrange
      const props: any = {
        name: 'Valid Envelope',
        limitInCents: 50000,
        currentBalanceInCents: 25000,
        categoryId: 'category-123',
        budgetId: 123
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Budget ID must be a string');
    });
  });

  describe('when accessing Envelope properties', () => {
    let envelope: Envelope;

    beforeEach(() => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Travel Fund',
        limitInCents: 150000, // R$ 1500.00
        currentBalanceInCents: 87500, // R$ 875.00
        categoryId: 'category-travel',
        budgetId: 'budget-travel',
        description: 'Saving for vacation',
        isActive: true
      };

      envelope = Envelope.create(props).data!;
    });

    it('should return correct id', () => {
      // Act
      const id = envelope.id;

      // Assert
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should return correct name', () => {
      // Act
      const name = envelope.name;

      // Assert
      expect(name).toBe('Travel Fund');
    });

    it('should return correct limit as Money object', () => {
      // Act
      const limit = envelope.limit;

      // Assert
      expect(limit.valueInCents).toBe(150000);
      expect(limit.valueInMonetary).toBe(1500.00);
    });

    it('should return correct currentBalance as Money object', () => {
      // Act
      const currentBalance = envelope.currentBalance;

      // Assert
      expect(currentBalance.valueInCents).toBe(87500);
      expect(currentBalance.valueInMonetary).toBe(875.00);
    });

    it('should return correct categoryId', () => {
      // Act
      const categoryId = envelope.categoryId;

      // Assert
      expect(categoryId).toBe('category-travel');
    });

    it('should return correct budgetId', () => {
      // Act
      const budgetId = envelope.budgetId;

      // Assert
      expect(budgetId).toBe('budget-travel');
    });

    it('should return correct description', () => {
      // Act
      const description = envelope.description;

      // Assert
      expect(description).toBe('Saving for vacation');
    });

    it('should return correct isActive flag', () => {
      // Act
      const isActive = envelope.isActive;

      // Assert
      expect(isActive).toBe(true);
    });

    it('should return correct createdAt date as new instance', () => {
      // Act
      const createdAt = envelope.createdAt;

      // Assert
      expect(createdAt).toBeInstanceOf(Date);
      expect(createdAt).not.toBe(envelope.createdAt); // Different instances
    });
  });

  describe('when using business methods', () => {
    it('should calculate remaining amount correctly', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Shopping Fund',
        limitInCents: 100000, // R$ 1000.00
        currentBalanceInCents: 35000, // R$ 350.00
        categoryId: 'category-shopping',
        budgetId: 'budget-shopping'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const remaining = envelope.getRemainingAmount();

      // Assert
      expect(remaining.valueInCents).toBe(65000); // R$ 650.00
      expect(remaining.valueInMonetary).toBe(650.00);
    });

    it('should return zero remaining amount when balance exceeds limit', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Over Budget',
        limitInCents: 50000, // R$ 500.00
        currentBalanceInCents: 75000, // R$ 750.00
        categoryId: 'category-over',
        budgetId: 'budget-over'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const remaining = envelope.getRemainingAmount();

      // Assert
      expect(remaining.valueInCents).toBe(0);
      expect(remaining.valueInMonetary).toBe(0);
    });

    it('should calculate usage percentage correctly', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Test Envelope',
        limitInCents: 100000, // R$ 1000.00
        currentBalanceInCents: 25000, // R$ 250.00 (25%)
        categoryId: 'category-test',
        budgetId: 'budget-test'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const percentage = envelope.getUsagePercentage();

      // Assert
      expect(percentage).toBe(25);
    });

    it('should return 0 usage percentage when limit is zero', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Zero Limit',
        limitInCents: 0,
        currentBalanceInCents: 50000,
        categoryId: 'category-zero',
        budgetId: 'budget-zero'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const percentage = envelope.getUsagePercentage();

      // Assert
      expect(percentage).toBe(0);
    });

    it('should cap usage percentage at 100', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Over Budget',
        limitInCents: 50000, // R$ 500.00
        currentBalanceInCents: 100000, // R$ 1000.00 (200%)
        categoryId: 'category-over',
        budgetId: 'budget-over'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const percentage = envelope.getUsagePercentage();

      // Assert
      expect(percentage).toBe(100);
    });

    it('should detect when over limit', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Over Limit Test',
        limitInCents: 75000, // R$ 750.00
        currentBalanceInCents: 80000, // R$ 800.00
        categoryId: 'category-over',
        budgetId: 'budget-over'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const isOverLimit = envelope.isOverLimit();

      // Assert
      expect(isOverLimit).toBe(true);
    });

    it('should return false for isOverLimit when within limit', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Within Limit Test',
        limitInCents: 100000, // R$ 1000.00
        currentBalanceInCents: 50000, // R$ 500.00
        categoryId: 'category-within',
        budgetId: 'budget-within'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const isOverLimit = envelope.isOverLimit();

      // Assert
      expect(isOverLimit).toBe(false);
    });

    it('should detect when near limit with default threshold', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Near Limit Test',
        limitInCents: 100000, // R$ 1000.00
        currentBalanceInCents: 95000, // R$ 950.00 (95%)
        categoryId: 'category-near',
        budgetId: 'budget-near'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const isNearLimit = envelope.isNearLimit();

      // Assert
      expect(isNearLimit).toBe(true);
    });

    it('should detect when near limit with custom threshold', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Custom Threshold Test',
        limitInCents: 100000, // R$ 1000.00
        currentBalanceInCents: 80000, // R$ 800.00 (80%)
        categoryId: 'category-custom',
        budgetId: 'budget-custom'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const isNearLimit = envelope.isNearLimit(0.75); // 75% threshold

      // Assert
      expect(isNearLimit).toBe(true);
    });

    it('should return false for isNearLimit when limit is zero', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Zero Limit Near Test',
        limitInCents: 0,
        currentBalanceInCents: 50000,
        categoryId: 'category-zero',
        budgetId: 'budget-zero'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const isNearLimit = envelope.isNearLimit();

      // Assert
      expect(isNearLimit).toBe(false);
    });

    it('should allow allocation when amount fits within limit', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Allocation Test',
        limitInCents: 100000, // R$ 1000.00
        currentBalanceInCents: 70000, // R$ 700.00
        categoryId: 'category-allocation',
        budgetId: 'budget-allocation'
      };
      const envelope = Envelope.create(props).data!;
      const allocationAmount = Money.fromMonetary(250.00).data!; // R$ 250.00

      // Act
      const canAllocate = envelope.canAllocate(allocationAmount);

      // Assert
      expect(canAllocate).toBe(true);
    });

    it('should allow allocation when amount exactly reaches limit', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Exact Allocation Test',
        limitInCents: 100000, // R$ 1000.00
        currentBalanceInCents: 70000, // R$ 700.00
        categoryId: 'category-exact',
        budgetId: 'budget-exact'
      };
      const envelope = Envelope.create(props).data!;
      const allocationAmount = Money.fromMonetary(300.00).data!; // R$ 300.00 (total = R$ 1000.00)

      // Act
      const canAllocate = envelope.canAllocate(allocationAmount);

      // Assert
      expect(canAllocate).toBe(true);
    });

    it('should not allow allocation when amount exceeds limit', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Exceed Allocation Test',
        limitInCents: 100000, // R$ 1000.00
        currentBalanceInCents: 70000, // R$ 700.00
        categoryId: 'category-exceed',
        budgetId: 'budget-exceed'
      };
      const envelope = Envelope.create(props).data!;
      const allocationAmount = Money.fromMonetary(350.00).data!; // R$ 350.00 (total = R$ 1050.00)

      // Act
      const canAllocate = envelope.canAllocate(allocationAmount);

      // Assert
      expect(canAllocate).toBe(false);
    });

    it('should format limit correctly in BRL', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Format Test',
        limitInCents: 123456, // R$ 1234.56
        currentBalanceInCents: 50000,
        categoryId: 'category-format',
        budgetId: 'budget-format'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const formatted = envelope.formatLimit();

      // Assert
      expect(formatted).toBe('R$\u00a01.234,56');
    });

    it('should format current balance correctly in BRL', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Format Test',
        limitInCents: 100000,
        currentBalanceInCents: 98765, // R$ 987.65
        categoryId: 'category-format',
        budgetId: 'budget-format'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const formatted = envelope.formatCurrentBalance();

      // Assert
      expect(formatted).toBe('R$\u00a0987,65');
    });

    it('should format remaining amount correctly in BRL', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Format Test',
        limitInCents: 100000, // R$ 1000.00
        currentBalanceInCents: 33333, // R$ 333.33
        categoryId: 'category-format',
        budgetId: 'budget-format'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const formatted = envelope.formatRemainingAmount();

      // Assert
      expect(formatted).toBe('R$\u00a0666,67');
    });

    it('should return correct status label for available envelope', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Available Envelope',
        limitInCents: 100000, // R$ 1000.00
        currentBalanceInCents: 30000, // R$ 300.00 (30%)
        categoryId: 'category-available',
        budgetId: 'budget-available'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const status = envelope.getStatusLabel();

      // Assert
      expect(status).toBe('Disponível');
    });

    it('should return correct status label for in-use envelope', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'In Use Envelope',
        limitInCents: 100000, // R$ 1000.00
        currentBalanceInCents: 60000, // R$ 600.00 (60%)
        categoryId: 'category-inuse',
        budgetId: 'budget-inuse'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const status = envelope.getStatusLabel();

      // Assert
      expect(status).toBe('Em Uso');
    });

    it('should return correct status label for near limit envelope', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Near Limit Envelope',
        limitInCents: 100000, // R$ 1000.00
        currentBalanceInCents: 92000, // R$ 920.00 (92%)
        categoryId: 'category-near',
        budgetId: 'budget-near'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const status = envelope.getStatusLabel();

      // Assert
      expect(status).toBe('Próximo do Limite');
    });

    it('should return correct status label for over limit envelope', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Over Limit Envelope',
        limitInCents: 100000, // R$ 1000.00
        currentBalanceInCents: 110000, // R$ 1100.00 (110%)
        categoryId: 'category-over',
        budgetId: 'budget-over'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const status = envelope.getStatusLabel();

      // Assert
      expect(status).toBe('Acima do Limite');
    });
  });

  describe('when serializing to JSON', () => {
    it('should convert envelope to JSON correctly', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'JSON Test Envelope',
        limitInCents: 250000, // R$ 2500.00
        currentBalanceInCents: 175000, // R$ 1750.00
        categoryId: 'category-json',
        budgetId: 'budget-json',
        description: 'Testing JSON serialization',
        isActive: false
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const json = envelope.toJSON();

      // Assert
      expect(json.id).toBe(envelope.id);
      expect(json.name).toBe('JSON Test Envelope');
      expect(json.limit.valueInCents).toBe(250000);
      expect(json.limit.valueInMonetary).toBe(2500.00);
      expect(json.limit.formatted).toBe('R$\u00a02.500,00');
      expect(json.currentBalance.valueInCents).toBe(175000);
      expect(json.currentBalance.valueInMonetary).toBe(1750.00);
      expect(json.currentBalance.formatted).toBe('R$\u00a01.750,00');
      expect(json.categoryId).toBe('category-json');
      expect(json.budgetId).toBe('budget-json');
      expect(json.description).toBe('Testing JSON serialization');
      expect(json.isActive).toBe(false);
      expect(json.createdAt).toBeDefined();
      expect(typeof json.createdAt).toBe('string');
    });

    it('should include all fields in JSON output', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Complete Envelope',
        limitInCents: 100000,
        currentBalanceInCents: 50000,
        categoryId: 'category-complete',
        budgetId: 'budget-complete'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const json = envelope.toJSON();

      // Assert
      const expectedKeys = ['id', 'name', 'limit', 'currentBalance', 'categoryId', 'budgetId', 'description', 'isActive', 'createdAt'];
      expectedKeys.forEach(key => {
        expect(json.hasOwnProperty(key)).toBe(true);
      });

      expect(Object.keys(json).length).toBe(expectedKeys.length);
    });

    it('should handle empty description in JSON', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'No Description Envelope',
        limitInCents: 75000,
        currentBalanceInCents: 30000,
        categoryId: 'category-nodesc',
        budgetId: 'budget-nodesc'
      };
      const envelope = Envelope.create(props).data!;

      // Act
      const json = envelope.toJSON();

      // Assert
      expect(json.description).toBe('');
    });
  });

  describe('when deserializing from JSON', () => {
    it('should create envelope from valid JSON', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Restored Envelope',
        limit: { valueInCents: 300000 },
        currentBalance: { valueInCents: 180000 },
        categoryId: 'category-restored',
        budgetId: 'budget-restored',
        description: 'Restored from JSON',
        isActive: true,
        createdAt: '2024-05-20T12:30:00.000Z'
      };

      // Act
      const result = Envelope.fromJSON(json);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);

      const envelope = result.data!;
      expect(envelope.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(envelope.name).toBe('Restored Envelope');
      expect(envelope.limit.valueInCents).toBe(300000);
      expect(envelope.limit.valueInMonetary).toBe(3000.00);
      expect(envelope.currentBalance.valueInCents).toBe(180000);
      expect(envelope.currentBalance.valueInMonetary).toBe(1800.00);
      expect(envelope.categoryId).toBe('category-restored');
      expect(envelope.budgetId).toBe('budget-restored');
      expect(envelope.description).toBe('Restored from JSON');
      expect(envelope.isActive).toBe(true);
      expect(envelope.createdAt).toEqual(new Date('2024-05-20T12:30:00.000Z'));
    });

    it('should return error when JSON has invalid id', () => {
      // Arrange
      const json = {
        id: 'invalid-uuid-format',
        name: 'Test Envelope',
        limit: { valueInCents: 100000 },
        currentBalance: { valueInCents: 50000 },
        categoryId: 'category-test',
        budgetId: 'budget-test',
        description: 'Test envelope',
        isActive: true,
        createdAt: '2024-05-20T12:30:00.000Z'
      };

      // Act
      const result = Envelope.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Invalid UUID format');
    });

    it('should return error when JSON has invalid name', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: '',
        limit: { valueInCents: 100000 },
        currentBalance: { valueInCents: 50000 },
        categoryId: 'category-test',
        budgetId: 'budget-test',
        description: 'Test envelope',
        isActive: true,
        createdAt: '2024-05-20T12:30:00.000Z'
      };

      // Act
      const result = Envelope.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should return error when JSON has invalid limit', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test Envelope',
        limit: { valueInCents: -100000 },
        currentBalance: { valueInCents: 50000 },
        categoryId: 'category-test',
        budgetId: 'budget-test',
        description: 'Test envelope',
        isActive: true,
        createdAt: '2024-05-20T12:30:00.000Z'
      };

      // Act
      const result = Envelope.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });

    it('should return error when JSON has invalid current balance', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test Envelope',
        limit: { valueInCents: 100000 },
        currentBalance: { valueInCents: -50000 },
        categoryId: 'category-test',
        budgetId: 'budget-test',
        description: 'Test envelope',
        isActive: true,
        createdAt: '2024-05-20T12:30:00.000Z'
      };

      // Act
      const result = Envelope.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });

    it('should return error when JSON has empty categoryId', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test Envelope',
        limit: { valueInCents: 100000 },
        currentBalance: { valueInCents: 50000 },
        categoryId: '',
        budgetId: 'budget-test',
        description: 'Test envelope',
        isActive: true,
        createdAt: '2024-05-20T12:30:00.000Z'
      };

      // Act
      const result = Envelope.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Category ID cannot be empty');
    });

    it('should return error when JSON has empty budgetId', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test Envelope',
        limit: { valueInCents: 100000 },
        currentBalance: { valueInCents: 50000 },
        categoryId: 'category-test',
        budgetId: '',
        description: 'Test envelope',
        isActive: true,
        createdAt: '2024-05-20T12:30:00.000Z'
      };

      // Act
      const result = Envelope.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Budget ID cannot be empty');
    });
  });

  describe('when using Envelope in real scenarios', () => {
    it('should work in collections and filtering by active status', () => {
      // Arrange
      const activeProps: EnvelopeProps = {
        name: 'Active Envelope',
        limitInCents: 100000,
        currentBalanceInCents: 50000,
        categoryId: 'category-active',
        budgetId: 'budget-active',
        isActive: true
      };

      const inactiveProps: EnvelopeProps = {
        name: 'Inactive Envelope',
        limitInCents: 75000,
        currentBalanceInCents: 30000,
        categoryId: 'category-inactive',
        budgetId: 'budget-inactive',
        isActive: false
      };

      const envelopes = [
        Envelope.create(activeProps).data!,
        Envelope.create(inactiveProps).data!
      ];

      // Act
      const activeEnvelopes = envelopes.filter(env => env.isActive);
      const inactiveEnvelopes = envelopes.filter(env => !env.isActive);

      // Assert
      expect(activeEnvelopes.length).toBe(1);
      expect(inactiveEnvelopes.length).toBe(1);
      expect(activeEnvelopes[0].name).toBe('Active Envelope');
      expect(inactiveEnvelopes[0].name).toBe('Inactive Envelope');
    });

    it('should calculate total limits and usage correctly', () => {
      // Arrange
      const envelopeProps = [
        { name: 'Food', limitInCents: 80000, currentBalanceInCents: 60000 },
        { name: 'Transport', limitInCents: 50000, currentBalanceInCents: 30000 },
        { name: 'Entertainment', limitInCents: 30000, currentBalanceInCents: 25000 }
      ].map(props => ({
        ...props,
        categoryId: 'category-total',
        budgetId: 'budget-total'
      }));

      const envelopes = envelopeProps.map(props => Envelope.create(props).data!);

      // Act
      const totalLimit = envelopes.reduce((sum, env) => sum + env.limit.valueInCents, 0);
      const totalUsed = envelopes.reduce((sum, env) => sum + env.currentBalance.valueInCents, 0);
      const overallUsage = (totalUsed / totalLimit) * 100;

      // Assert
      expect(totalLimit).toBe(160000); // R$ 1600.00
      expect(totalUsed).toBe(115000); // R$ 1150.00
      expect(Math.round(overallUsage)).toBe(72); // 71.875% rounded
    });

    it('should work with envelope allocation planning', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Monthly Savings',
        limitInCents: 200000, // R$ 2000.00
        currentBalanceInCents: 120000, // R$ 1200.00
        categoryId: 'category-savings',
        budgetId: 'budget-savings'
      };
      const envelope = Envelope.create(props).data!;

      const plannedAllocations = [
        Money.fromMonetary(300.00).data!, // R$ 300.00
        Money.fromMonetary(400.00).data!, // R$ 400.00
        Money.fromMonetary(200.00).data!  // R$ 200.00
      ];

      // Act
      const allocationResults = plannedAllocations.map(allocation => envelope.canAllocate(allocation));

      // Assert
      expect(allocationResults[0]).toBe(true); // R$ 1500.00 total (within limit)
      expect(allocationResults[1]).toBe(true); // R$ 1600.00 total (within limit)
      expect(allocationResults[2]).toBe(true); // R$ 1400.00 total (within limit)
    });

    it('should maintain immutability', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Immutable Envelope',
        limitInCents: 100000,
        currentBalanceInCents: 50000,
        categoryId: 'category-immutable',
        budgetId: 'budget-immutable'
      };
      const envelope = Envelope.create(props).data!;

      // Act & Assert
      const originalCreatedAt = envelope.createdAt;
      const newCreatedAt = envelope.createdAt;
      newCreatedAt.setFullYear(2000); // Try to modify returned date

      // The original envelope should not be affected
      expect(envelope.createdAt).not.toBe(newCreatedAt);
      expect(envelope.createdAt).toEqual(originalCreatedAt);
    });
  });

  describe('edge cases and boundary conditions', () => {
    it('should handle maximum name length', () => {
      // Arrange
      const maxName = 'A'.repeat(100);
      const props: EnvelopeProps = {
        name: maxName,
        limitInCents: 100000,
        currentBalanceInCents: 50000,
        categoryId: 'category-max-name',
        budgetId: 'budget-max-name'
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.name).toBe(maxName);
      expect(result.data!.name.length).toBe(100);
    });

    it('should handle very large amounts', () => {
      // Arrange
      const props: EnvelopeProps = {
        name: 'Large Amount Envelope',
        limitInCents: 999999999, // R$ 9,999,999.99
        currentBalanceInCents: 888888888, // R$ 8,888,888.88
        categoryId: 'category-large',
        budgetId: 'budget-large'
      };

      // Act
      const result = Envelope.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.limit.valueInCents).toBe(999999999);
      expect(result.data!.currentBalance.valueInCents).toBe(888888888);
    });

    it('should handle JSON serialization round-trip', () => {
      // Arrange
      const originalProps: EnvelopeProps = {
        name: 'Round-trip Envelope',
        limitInCents: 654321,
        currentBalanceInCents: 123456,
        categoryId: 'category-roundtrip',
        budgetId: 'budget-roundtrip',
        description: 'Testing round-trip',
        isActive: false
      };
      const originalEnvelope = Envelope.create(originalProps).data!;

      // Act
      const json = originalEnvelope.toJSON();
      const restoredResult = Envelope.fromJSON(json);

      // Assert
      expect(restoredResult.hasData).toBe(true);
      const restoredEnvelope = restoredResult.data!;

      expect(restoredEnvelope.id).toBe(originalEnvelope.id);
      expect(restoredEnvelope.name).toBe(originalEnvelope.name);
      expect(restoredEnvelope.limit.valueInCents).toBe(originalEnvelope.limit.valueInCents);
      expect(restoredEnvelope.currentBalance.valueInCents).toBe(originalEnvelope.currentBalance.valueInCents);
      expect(restoredEnvelope.categoryId).toBe(originalEnvelope.categoryId);
      expect(restoredEnvelope.budgetId).toBe(originalEnvelope.budgetId);
      expect(restoredEnvelope.description).toBe(originalEnvelope.description);
      expect(restoredEnvelope.isActive).toBe(originalEnvelope.isActive);
      expect(restoredEnvelope.createdAt).toEqual(originalEnvelope.createdAt);
    });
  });
});