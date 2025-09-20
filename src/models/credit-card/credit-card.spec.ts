import { CreditCard, CreditCardProps } from './credit-card';

describe('CreditCard', () => {
  describe('when creating a new CreditCard with valid props', () => {
    it('should create credit card successfully with all required fields', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Visa Gold',
        limitInCents: 500000, // R$ 5000.00
        budgetId: 'budget-123',
        closingDay: 10,
        dueDay: 15
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);

      const creditCard = result.data!;
      expect(creditCard.name).toBe('Visa Gold');
      expect(creditCard.limit.valueInCents).toBe(500000);
      expect(creditCard.limit.valueInMonetary).toBe(5000.00);
      expect(creditCard.budgetId).toBe('budget-123');
      expect(creditCard.closingDay).toBe(10);
      expect(creditCard.dueDay).toBe(15);
      expect(creditCard.brand).toBe('');
      expect(creditCard.lastFourDigits).toBe('');
      expect(creditCard.isActive).toBe(true);
      expect(creditCard.id).toBeDefined();
      expect(creditCard.createdAt).toBeInstanceOf(Date);
    });

    it('should create credit card successfully with all optional fields', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Mastercard Black',
        limitInCents: 1000000, // R$ 10000.00
        budgetId: 'budget-premium',
        closingDay: 5,
        dueDay: 20,
        brand: 'Mastercard',
        lastFourDigits: '1234',
        isActive: false
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);

      const creditCard = result.data!;
      expect(creditCard.name).toBe('Mastercard Black');
      expect(creditCard.limit.valueInCents).toBe(1000000);
      expect(creditCard.budgetId).toBe('budget-premium');
      expect(creditCard.closingDay).toBe(5);
      expect(creditCard.dueDay).toBe(20);
      expect(creditCard.brand).toBe('Mastercard');
      expect(creditCard.lastFourDigits).toBe('1234');
      expect(creditCard.isActive).toBe(false);
    });

    it('should create credit card with zero limit', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'No Limit Card',
        limitInCents: 0,
        budgetId: 'budget-zero',
        closingDay: 1,
        dueDay: 31
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.limit.valueInMonetary).toBe(0);
    });

    it('should create credit card with maximum day values', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Max Days Card',
        limitInCents: 100000,
        budgetId: 'budget-max',
        closingDay: 31,
        dueDay: 31
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.closingDay).toBe(31);
      expect(result.data!.dueDay).toBe(31);
    });
  });

  describe('when creating CreditCard with invalid props', () => {
    it('should return error when name is empty string', () => {
      // Arrange
      const props: CreditCardProps = {
        name: '',
        limitInCents: 500000,
        budgetId: 'budget-123',
        closingDay: 10,
        dueDay: 15
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should return error when name is whitespace only', () => {
      // Arrange
      const props: CreditCardProps = {
        name: '   ',
        limitInCents: 500000,
        budgetId: 'budget-123',
        closingDay: 10,
        dueDay: 15
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should return error when name is not a string', () => {
      // Arrange
      const props: any = {
        name: 123,
        limitInCents: 500000,
        budgetId: 'budget-123',
        closingDay: 10,
        dueDay: 15
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Name must be a string');
    });

    it('should return error when name exceeds 100 characters', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'A'.repeat(101),
        limitInCents: 500000,
        budgetId: 'budget-123',
        closingDay: 10,
        dueDay: 15
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Name cannot exceed 100 characters');
    });

    it('should return error when limitInCents is negative', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Valid Card',
        limitInCents: -100000,
        budgetId: 'budget-123',
        closingDay: 10,
        dueDay: 15
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });

    it('should return error when budgetId is empty string', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Valid Card',
        limitInCents: 500000,
        budgetId: '',
        closingDay: 10,
        dueDay: 15
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Budget ID cannot be empty');
    });

    it('should return error when budgetId is whitespace only', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Valid Card',
        limitInCents: 500000,
        budgetId: '   ',
        closingDay: 10,
        dueDay: 15
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Budget ID cannot be empty');
    });

    it('should return error when budgetId is not a string', () => {
      // Arrange
      const props: any = {
        name: 'Valid Card',
        limitInCents: 500000,
        budgetId: 123,
        closingDay: 10,
        dueDay: 15
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Budget ID must be a string');
    });

    it('should return error when closingDay is less than 1', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Valid Card',
        limitInCents: 500000,
        budgetId: 'budget-123',
        closingDay: 0,
        dueDay: 15
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Closing day must be between 1 and 31');
    });

    it('should return error when closingDay is greater than 31', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Valid Card',
        limitInCents: 500000,
        budgetId: 'budget-123',
        closingDay: 32,
        dueDay: 15
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Closing day must be between 1 and 31');
    });

    it('should return error when closingDay is not an integer', () => {
      // Arrange
      const props: any = {
        name: 'Valid Card',
        limitInCents: 500000,
        budgetId: 'budget-123',
        closingDay: 10.5,
        dueDay: 15
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Closing day must be an integer');
    });

    it('should return error when dueDay is less than 1', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Valid Card',
        limitInCents: 500000,
        budgetId: 'budget-123',
        closingDay: 10,
        dueDay: 0
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Due day must be between 1 and 31');
    });

    it('should return error when dueDay is greater than 31', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Valid Card',
        limitInCents: 500000,
        budgetId: 'budget-123',
        closingDay: 10,
        dueDay: 32
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Due day must be between 1 and 31');
    });

    it('should return error when dueDay is not an integer', () => {
      // Arrange
      const props: any = {
        name: 'Valid Card',
        limitInCents: 500000,
        budgetId: 'budget-123',
        closingDay: 10,
        dueDay: 15.7
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Due day must be an integer');
    });

    it('should return error when lastFourDigits is not exactly 4 digits', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Valid Card',
        limitInCents: 500000,
        budgetId: 'budget-123',
        closingDay: 10,
        dueDay: 15,
        lastFourDigits: '123'
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Last four digits must be exactly 4 numeric digits');
    });

    it('should return error when lastFourDigits contains non-numeric characters', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Valid Card',
        limitInCents: 500000,
        budgetId: 'budget-123',
        closingDay: 10,
        dueDay: 15,
        lastFourDigits: '12AB'
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Last four digits must be exactly 4 numeric digits');
    });

    it('should return error when lastFourDigits is not a string', () => {
      // Arrange
      const props: any = {
        name: 'Valid Card',
        limitInCents: 500000,
        budgetId: 'budget-123',
        closingDay: 10,
        dueDay: 15,
        lastFourDigits: 1234
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Last four digits must be a string');
    });
  });

  describe('when accessing CreditCard properties', () => {
    let creditCard: CreditCard;

    beforeEach(() => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Premium Visa',
        limitInCents: 750000, // R$ 7500.00
        budgetId: 'budget-premium',
        closingDay: 8,
        dueDay: 25,
        brand: 'Visa',
        lastFourDigits: '9876',
        isActive: true
      };

      creditCard = CreditCard.create(props).data!;
    });

    it('should return correct id', () => {
      // Act
      const id = creditCard.id;

      // Assert
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should return correct name', () => {
      // Act
      const name = creditCard.name;

      // Assert
      expect(name).toBe('Premium Visa');
    });

    it('should return correct limit as Money object', () => {
      // Act
      const limit = creditCard.limit;

      // Assert
      expect(limit.valueInCents).toBe(750000);
      expect(limit.valueInMonetary).toBe(7500.00);
    });

    it('should return correct budgetId', () => {
      // Act
      const budgetId = creditCard.budgetId;

      // Assert
      expect(budgetId).toBe('budget-premium');
    });

    it('should return correct closingDay', () => {
      // Act
      const closingDay = creditCard.closingDay;

      // Assert
      expect(closingDay).toBe(8);
    });

    it('should return correct dueDay', () => {
      // Act
      const dueDay = creditCard.dueDay;

      // Assert
      expect(dueDay).toBe(25);
    });

    it('should return correct brand', () => {
      // Act
      const brand = creditCard.brand;

      // Assert
      expect(brand).toBe('Visa');
    });

    it('should return correct lastFourDigits', () => {
      // Act
      const lastFourDigits = creditCard.lastFourDigits;

      // Assert
      expect(lastFourDigits).toBe('9876');
    });

    it('should return correct isActive flag', () => {
      // Act
      const isActive = creditCard.isActive;

      // Assert
      expect(isActive).toBe(true);
    });

    it('should return correct createdAt date as new instance', () => {
      // Act
      const createdAt = creditCard.createdAt;

      // Assert
      expect(createdAt).toBeInstanceOf(Date);
      expect(createdAt).not.toBe(creditCard.createdAt); // Different instances
    });
  });

  describe('when using business methods', () => {
    it('should format limit correctly in BRL', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Format Test Card',
        limitInCents: 234567, // R$ 2345.67
        budgetId: 'budget-format',
        closingDay: 15,
        dueDay: 20
      };
      const creditCard = CreditCard.create(props).data!;

      // Act
      const formatted = creditCard.formatLimit();

      // Assert
      expect(formatted).toBe('R$\u00a02.345,67');
    });

    it('should return display name with brand and last four digits', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'My Card',
        limitInCents: 500000,
        budgetId: 'budget-display',
        closingDay: 10,
        dueDay: 15,
        brand: 'Mastercard',
        lastFourDigits: '5432'
      };
      const creditCard = CreditCard.create(props).data!;

      // Act
      const displayName = creditCard.getDisplayName();

      // Assert
      expect(displayName).toBe('Mastercard ****5432');
    });

    it('should return display name as card name when brand is empty', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Personal Card',
        limitInCents: 500000,
        budgetId: 'budget-display',
        closingDay: 10,
        dueDay: 15,
        brand: '',
        lastFourDigits: '1111'
      };
      const creditCard = CreditCard.create(props).data!;

      // Act
      const displayName = creditCard.getDisplayName();

      // Assert
      expect(displayName).toBe('Personal Card');
    });

    it('should return display name as card name when lastFourDigits is empty', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Business Card',
        limitInCents: 500000,
        budgetId: 'budget-display',
        closingDay: 10,
        dueDay: 15,
        brand: 'Visa',
        lastFourDigits: ''
      };
      const creditCard = CreditCard.create(props).data!;

      // Act
      const displayName = creditCard.getDisplayName();

      // Assert
      expect(displayName).toBe('Business Card');
    });

    it('should return display name as card name when both brand and lastFourDigits are empty', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Simple Card',
        limitInCents: 500000,
        budgetId: 'budget-display',
        closingDay: 10,
        dueDay: 15
      };
      const creditCard = CreditCard.create(props).data!;

      // Act
      const displayName = creditCard.getDisplayName();

      // Assert
      expect(displayName).toBe('Simple Card');
    });

    it('should get next closing date in current month', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Date Test Card',
        limitInCents: 500000,
        budgetId: 'budget-date',
        closingDay: 20,
        dueDay: 25
      };
      const creditCard = CreditCard.create(props).data!;
      const referenceDate = new Date('2024-01-10T10:00:00Z'); // Before closing day

      // Act
      const nextClosing = creditCard.getNextClosingDate(referenceDate);

      // Assert
      expect(nextClosing.getDate()).toBe(20);
      expect(nextClosing.getMonth()).toBe(0); // January
      expect(nextClosing.getFullYear()).toBe(2024);
      expect(nextClosing.getHours()).toBe(23);
      expect(nextClosing.getMinutes()).toBe(59);
      expect(nextClosing.getSeconds()).toBe(59);
      expect(nextClosing.getMilliseconds()).toBe(999);
    });

    it('should get next closing date in next month when reference date is after closing day', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Date Test Card',
        limitInCents: 500000,
        budgetId: 'budget-date',
        closingDay: 15,
        dueDay: 20
      };
      const creditCard = CreditCard.create(props).data!;
      const referenceDate = new Date('2024-01-20T10:00:00Z'); // After closing day

      // Act
      const nextClosing = creditCard.getNextClosingDate(referenceDate);

      // Assert
      expect(nextClosing.getDate()).toBe(15);
      expect(nextClosing.getMonth()).toBe(1); // February
      expect(nextClosing.getFullYear()).toBe(2024);
    });

    it('should get next due date in current month', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Date Test Card',
        limitInCents: 500000,
        budgetId: 'budget-date',
        closingDay: 10,
        dueDay: 25
      };
      const creditCard = CreditCard.create(props).data!;
      const referenceDate = new Date('2024-01-15T10:00:00Z'); // Before due day

      // Act
      const nextDue = creditCard.getNextDueDate(referenceDate);

      // Assert
      expect(nextDue.getDate()).toBe(25);
      expect(nextDue.getMonth()).toBe(0); // January
      expect(nextDue.getFullYear()).toBe(2024);
      expect(nextDue.getHours()).toBe(23);
      expect(nextDue.getMinutes()).toBe(59);
      expect(nextDue.getSeconds()).toBe(59);
      expect(nextDue.getMilliseconds()).toBe(999);
    });

    it('should get next due date in next month when reference date is after due day', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Date Test Card',
        limitInCents: 500000,
        budgetId: 'budget-date',
        closingDay: 10,
        dueDay: 20
      };
      const creditCard = CreditCard.create(props).data!;
      const referenceDate = new Date('2024-01-25T10:00:00Z'); // After due day

      // Act
      const nextDue = creditCard.getNextDueDate(referenceDate);

      // Assert
      expect(nextDue.getDate()).toBe(20);
      expect(nextDue.getMonth()).toBe(1); // February
      expect(nextDue.getFullYear()).toBe(2024);
    });

    it('should use current date as default for getNextClosingDate', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Default Date Card',
        limitInCents: 500000,
        budgetId: 'budget-default',
        closingDay: 15,
        dueDay: 20
      };
      const creditCard = CreditCard.create(props).data!;

      // Act
      const nextClosing = creditCard.getNextClosingDate();

      // Assert
      expect(nextClosing).toBeInstanceOf(Date);
      expect(nextClosing.getDate()).toBe(15);
    });

    it('should use current date as default for getNextDueDate', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Default Date Card',
        limitInCents: 500000,
        budgetId: 'budget-default',
        closingDay: 5,
        dueDay: 25
      };
      const creditCard = CreditCard.create(props).data!;

      // Act
      const nextDue = creditCard.getNextDueDate();

      // Assert
      expect(nextDue).toBeInstanceOf(Date);
      expect(nextDue.getDate()).toBe(25);
    });
  });

  describe('when serializing to JSON', () => {
    it('should convert credit card to JSON correctly', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'JSON Test Card',
        limitInCents: 987654, // R$ 9876.54
        budgetId: 'budget-json',
        closingDay: 12,
        dueDay: 28,
        brand: 'American Express',
        lastFourDigits: '8888',
        isActive: false
      };
      const creditCard = CreditCard.create(props).data!;

      // Act
      const json = creditCard.toJSON();

      // Assert
      expect(json.id).toBe(creditCard.id);
      expect(json.name).toBe('JSON Test Card');
      expect(json.limit.valueInCents).toBe(987654);
      expect(json.limit.valueInMonetary).toBe(9876.54);
      expect(json.limit.formatted).toBe('R$\u00a09.876,54');
      expect(json.budgetId).toBe('budget-json');
      expect(json.closingDay).toBe(12);
      expect(json.dueDay).toBe(28);
      expect(json.brand).toBe('American Express');
      expect(json.lastFourDigits).toBe('8888');
      expect(json.isActive).toBe(false);
      expect(json.createdAt).toBeDefined();
      expect(typeof json.createdAt).toBe('string');
    });

    it('should include all fields in JSON output', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Complete Card',
        limitInCents: 100000,
        budgetId: 'budget-complete',
        closingDay: 1,
        dueDay: 31
      };
      const creditCard = CreditCard.create(props).data!;

      // Act
      const json = creditCard.toJSON();

      // Assert
      const expectedKeys = ['id', 'name', 'limit', 'budgetId', 'closingDay', 'dueDay', 'brand', 'lastFourDigits', 'isActive', 'createdAt'];
      expectedKeys.forEach(key => {
        expect(json.hasOwnProperty(key)).toBe(true);
      });

      expect(Object.keys(json).length).toBe(expectedKeys.length);
    });

    it('should handle empty brand and lastFourDigits in JSON', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Minimal Card',
        limitInCents: 250000,
        budgetId: 'budget-minimal',
        closingDay: 15,
        dueDay: 20
      };
      const creditCard = CreditCard.create(props).data!;

      // Act
      const json = creditCard.toJSON();

      // Assert
      expect(json.brand).toBe('');
      expect(json.lastFourDigits).toBe('');
    });
  });

  describe('when deserializing from JSON', () => {
    it('should create credit card from valid JSON', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Restored Card',
        limit: { valueInCents: 600000 },
        budgetId: 'budget-restored',
        closingDay: 7,
        dueDay: 22,
        brand: 'Visa',
        lastFourDigits: '4321',
        isActive: true,
        createdAt: '2024-03-15T14:30:00.000Z'
      };

      // Act
      const result = CreditCard.fromJSON(json);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);

      const creditCard = result.data!;
      expect(creditCard.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(creditCard.name).toBe('Restored Card');
      expect(creditCard.limit.valueInCents).toBe(600000);
      expect(creditCard.limit.valueInMonetary).toBe(6000.00);
      expect(creditCard.budgetId).toBe('budget-restored');
      expect(creditCard.closingDay).toBe(7);
      expect(creditCard.dueDay).toBe(22);
      expect(creditCard.brand).toBe('Visa');
      expect(creditCard.lastFourDigits).toBe('4321');
      expect(creditCard.isActive).toBe(true);
      expect(creditCard.createdAt).toEqual(new Date('2024-03-15T14:30:00.000Z'));
    });

    it('should return error when JSON has invalid id', () => {
      // Arrange
      const json = {
        id: 'invalid-uuid-format',
        name: 'Test Card',
        limit: { valueInCents: 500000 },
        budgetId: 'budget-test',
        closingDay: 10,
        dueDay: 15,
        brand: 'Visa',
        lastFourDigits: '1234',
        isActive: true,
        createdAt: '2024-03-15T14:30:00.000Z'
      };

      // Act
      const result = CreditCard.fromJSON(json);

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
        limit: { valueInCents: 500000 },
        budgetId: 'budget-test',
        closingDay: 10,
        dueDay: 15,
        brand: 'Visa',
        lastFourDigits: '1234',
        isActive: true,
        createdAt: '2024-03-15T14:30:00.000Z'
      };

      // Act
      const result = CreditCard.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should return error when JSON has invalid limit', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test Card',
        limit: { valueInCents: -500000 },
        budgetId: 'budget-test',
        closingDay: 10,
        dueDay: 15,
        brand: 'Visa',
        lastFourDigits: '1234',
        isActive: true,
        createdAt: '2024-03-15T14:30:00.000Z'
      };

      // Act
      const result = CreditCard.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });

    it('should return error when JSON has invalid closingDay', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test Card',
        limit: { valueInCents: 500000 },
        budgetId: 'budget-test',
        closingDay: 32,
        dueDay: 15,
        brand: 'Visa',
        lastFourDigits: '1234',
        isActive: true,
        createdAt: '2024-03-15T14:30:00.000Z'
      };

      // Act
      const result = CreditCard.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Closing day must be between 1 and 31');
    });

    it('should return error when JSON has invalid lastFourDigits', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test Card',
        limit: { valueInCents: 500000 },
        budgetId: 'budget-test',
        closingDay: 10,
        dueDay: 15,
        brand: 'Visa',
        lastFourDigits: '12AB',
        isActive: true,
        createdAt: '2024-03-15T14:30:00.000Z'
      };

      // Act
      const result = CreditCard.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Last four digits must be exactly 4 numeric digits');
    });
  });

  describe('when using CreditCard in real scenarios', () => {
    it('should work in collections and filtering by active status', () => {
      // Arrange
      const activeProps: CreditCardProps = {
        name: 'Active Card',
        limitInCents: 500000,
        budgetId: 'budget-active',
        closingDay: 10,
        dueDay: 15,
        isActive: true
      };

      const inactiveProps: CreditCardProps = {
        name: 'Inactive Card',
        limitInCents: 300000,
        budgetId: 'budget-inactive',
        closingDay: 5,
        dueDay: 20,
        isActive: false
      };

      const cards = [
        CreditCard.create(activeProps).data!,
        CreditCard.create(inactiveProps).data!
      ];

      // Act
      const activeCards = cards.filter(card => card.isActive);
      const inactiveCards = cards.filter(card => !card.isActive);

      // Assert
      expect(activeCards.length).toBe(1);
      expect(inactiveCards.length).toBe(1);
      expect(activeCards[0].name).toBe('Active Card');
      expect(inactiveCards[0].name).toBe('Inactive Card');
    });

    it('should calculate total limits correctly', () => {
      // Arrange
      const cardProps = [
        { name: 'Card 1', limitInCents: 100000 },
        { name: 'Card 2', limitInCents: 200000 },
        { name: 'Card 3', limitInCents: 150000 }
      ].map(props => ({
        ...props,
        budgetId: 'budget-total',
        closingDay: 10,
        dueDay: 15
      }));

      const cards = cardProps.map(props => CreditCard.create(props).data!);

      // Act
      const totalLimit = cards.reduce((sum, card) => sum + card.limit.valueInCents, 0);

      // Assert
      expect(totalLimit).toBe(450000); // R$ 4500.00
    });

    it('should work with upcoming closing dates', () => {
      // Arrange
      const referenceDate = new Date('2024-06-15T10:00:00Z');
      const cardProps = [
        { name: 'Card A', closingDay: 10 }, // Already passed this month
        { name: 'Card B', closingDay: 20 }, // Coming up this month
        { name: 'Card C', closingDay: 25 }  // Coming up this month
      ].map(props => ({
        ...props,
        limitInCents: 500000,
        budgetId: 'budget-closing',
        dueDay: 31
      }));

      const cards = cardProps.map(props => CreditCard.create(props).data!);

      // Act
      const nextClosingDates = cards.map(card => card.getNextClosingDate(referenceDate));

      // Assert
      expect(nextClosingDates[0].getMonth()).toBe(6); // July (next month)
      expect(nextClosingDates[1].getMonth()).toBe(5); // June (same month)
      expect(nextClosingDates[2].getMonth()).toBe(5); // June (same month)
    });

    it('should maintain immutability', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Immutable Card',
        limitInCents: 500000,
        budgetId: 'budget-immutable',
        closingDay: 10,
        dueDay: 15
      };
      const creditCard = CreditCard.create(props).data!;

      // Act & Assert
      const originalCreatedAt = creditCard.createdAt;
      const newCreatedAt = creditCard.createdAt;
      newCreatedAt.setFullYear(2000); // Try to modify returned date

      // The original credit card should not be affected
      expect(creditCard.createdAt).not.toBe(newCreatedAt);
      expect(creditCard.createdAt).toEqual(originalCreatedAt);
    });
  });

  describe('edge cases and boundary conditions', () => {
    it('should handle maximum name length', () => {
      // Arrange
      const maxName = 'A'.repeat(100);
      const props: CreditCardProps = {
        name: maxName,
        limitInCents: 500000,
        budgetId: 'budget-max-name',
        closingDay: 10,
        dueDay: 15
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.name).toBe(maxName);
      expect(result.data!.name.length).toBe(100);
    });

    it('should handle very large limit', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'High Limit Card',
        limitInCents: 999999999, // R$ 9,999,999.99
        budgetId: 'budget-high-limit',
        closingDay: 10,
        dueDay: 15
      };

      // Act
      const result = CreditCard.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.limit.valueInCents).toBe(999999999);
    });

    it('should handle closing and due date across year boundary', () => {
      // Arrange
      const props: CreditCardProps = {
        name: 'Year Boundary Card',
        limitInCents: 500000,
        budgetId: 'budget-year',
        closingDay: 15,
        dueDay: 20
      };
      const creditCard = CreditCard.create(props).data!;
      const referenceDate = new Date('2024-12-25T10:00:00Z'); // End of year after both dates

      // Act
      const nextClosing = creditCard.getNextClosingDate(referenceDate);
      const nextDue = creditCard.getNextDueDate(referenceDate);

      // Assert
      expect(nextClosing.getMonth()).toBe(0); // January (next year)
      expect(nextDue.getMonth()).toBe(0); // January (next year)
      expect(nextClosing.getDate()).toBe(15);
      expect(nextDue.getDate()).toBe(20);
    });

    it('should handle JSON serialization round-trip', () => {
      // Arrange
      const originalProps: CreditCardProps = {
        name: 'Round-trip Card',
        limitInCents: 777777,
        budgetId: 'budget-roundtrip',
        closingDay: 13,
        dueDay: 27,
        brand: 'Test Brand',
        lastFourDigits: '9999',
        isActive: false
      };
      const originalCard = CreditCard.create(originalProps).data!;

      // Act
      const json = originalCard.toJSON();
      const restoredResult = CreditCard.fromJSON(json);

      // Assert
      expect(restoredResult.hasData).toBe(true);
      const restoredCard = restoredResult.data!;

      expect(restoredCard.id).toBe(originalCard.id);
      expect(restoredCard.name).toBe(originalCard.name);
      expect(restoredCard.limit.valueInCents).toBe(originalCard.limit.valueInCents);
      expect(restoredCard.budgetId).toBe(originalCard.budgetId);
      expect(restoredCard.closingDay).toBe(originalCard.closingDay);
      expect(restoredCard.dueDay).toBe(originalCard.dueDay);
      expect(restoredCard.brand).toBe(originalCard.brand);
      expect(restoredCard.lastFourDigits).toBe(originalCard.lastFourDigits);
      expect(restoredCard.isActive).toBe(originalCard.isActive);
      expect(restoredCard.createdAt).toEqual(originalCard.createdAt);
    });
  });
});