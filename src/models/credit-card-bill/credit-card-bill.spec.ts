import { CreditCardBill, CreditCardBillProps, CreditCardBillStatus } from './credit-card-bill';

describe('CreditCardBill', () => {
  describe('when creating a new CreditCardBill with valid props', () => {
    it('should create credit card bill successfully with all required fields', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 250000, // R$ 2500.00
        creditCardId: 'card-123',
        closingDate: closingDate,
        dueDate: dueDate,
      };

      // Act
      const result = CreditCardBill.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);

      const bill = result.data!;
      expect(bill.totalAmount.valueInCents).toBe(250000);
      expect(bill.totalAmount.valueInMonetary).toBe(2500.0);
      expect(bill.paidAmount.valueInCents).toBe(0);
      expect(bill.paidAmount.valueInMonetary).toBe(0);
      expect(bill.creditCardId).toBe('card-123');
      expect(bill.closingDate).toEqual(closingDate);
      expect(bill.dueDate).toEqual(dueDate);
      expect(bill.status).toBe(CreditCardBillStatus.OPEN);
      expect(bill.paidAt).toBeNull();
      expect(bill.id).toBeDefined();
      expect(bill.createdAt).toBeInstanceOf(Date);
    });

    it('should create credit card bill successfully with all optional fields', () => {
      // Arrange
      const closingDate = new Date('2024-07-15T23:59:59Z');
      const dueDate = new Date('2024-08-05T23:59:59Z');
      const paidAt = new Date('2024-08-03T14:30:00Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 180000, // R$ 1800.00
        creditCardId: 'card-premium',
        closingDate: closingDate,
        dueDate: dueDate,
        status: CreditCardBillStatus.PAID,
        paidAmountInCents: 180000, // R$ 1800.00
        paidAt: paidAt,
      };

      // Act
      const result = CreditCardBill.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);

      const bill = result.data!;
      expect(bill.totalAmount.valueInCents).toBe(180000);
      expect(bill.paidAmount.valueInCents).toBe(180000);
      expect(bill.creditCardId).toBe('card-premium');
      expect(bill.closingDate).toEqual(closingDate);
      expect(bill.dueDate).toEqual(dueDate);
      expect(bill.status).toBe(CreditCardBillStatus.PAID);
      expect(bill.paidAt).toEqual(paidAt);
    });

    it('should create bill with zero total amount', () => {
      // Arrange
      const closingDate = new Date('2024-06-01T00:00:00Z');
      const dueDate = new Date('2024-06-20T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 0,
        creditCardId: 'card-zero',
        closingDate: closingDate,
        dueDate: dueDate,
      };

      // Act
      const result = CreditCardBill.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.totalAmount.valueInMonetary).toBe(0);
    });

    it('should create bill with partial payment', () => {
      // Arrange
      const closingDate = new Date('2024-05-10T23:59:59Z');
      const dueDate = new Date('2024-05-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 100000, // R$ 1000.00
        creditCardId: 'card-partial',
        closingDate: closingDate,
        dueDate: dueDate,
        paidAmountInCents: 60000, // R$ 600.00
      };

      // Act
      const result = CreditCardBill.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.totalAmount.valueInMonetary).toBe(1000.0);
      expect(result.data!.paidAmount.valueInMonetary).toBe(600.0);
    });

    it('should create bill with each valid status', () => {
      // Arrange & Act & Assert
      Object.values(CreditCardBillStatus).forEach((status) => {
        const closingDate = new Date('2024-06-10T23:59:59Z');
        const dueDate = new Date('2024-06-25T23:59:59Z');
        const props: CreditCardBillProps = {
          totalAmountInCents: 100000,
          creditCardId: 'card-status',
          closingDate: closingDate,
          dueDate: dueDate,
          status: status,
        };

        const result = CreditCardBill.create(props);

        expect(result.hasData).toBe(true);
        expect(result.data!.status).toBe(status);
      });
    });
  });

  describe('when creating CreditCardBill with invalid props', () => {
    it('should return error when totalAmountInCents is negative', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: -50000,
        creditCardId: 'card-123',
        closingDate: closingDate,
        dueDate: dueDate,
      };

      // Act
      const result = CreditCardBill.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });

    it('should return error when paidAmountInCents is negative', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 100000,
        creditCardId: 'card-123',
        closingDate: closingDate,
        dueDate: dueDate,
        paidAmountInCents: -25000,
      };

      // Act
      const result = CreditCardBill.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });

    it('should return error when creditCardId is empty string', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 100000,
        creditCardId: '',
        closingDate: closingDate,
        dueDate: dueDate,
      };

      // Act
      const result = CreditCardBill.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Credit card ID cannot be empty');
    });

    it('should return error when creditCardId is whitespace only', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 100000,
        creditCardId: '   ',
        closingDate: closingDate,
        dueDate: dueDate,
      };

      // Act
      const result = CreditCardBill.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Credit card ID cannot be empty');
    });

    it('should return error when creditCardId is not a string', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: any = {
        totalAmountInCents: 100000,
        creditCardId: 123,
        closingDate: closingDate,
        dueDate: dueDate,
      };

      // Act
      const result = CreditCardBill.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Credit card ID must be a string');
    });

    it('should return error when closingDate is invalid', () => {
      // Arrange
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: any = {
        totalAmountInCents: 100000,
        creditCardId: 'card-123',
        closingDate: 'invalid-date',
        dueDate: dueDate,
      };

      // Act
      const result = CreditCardBill.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Closing date must be a valid date');
    });

    it('should return error when dueDate is invalid', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const props: any = {
        totalAmountInCents: 100000,
        creditCardId: 'card-123',
        closingDate: closingDate,
        dueDate: 'invalid-date',
      };

      // Act
      const result = CreditCardBill.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Due date must be a valid date');
    });

    it('should return error when dueDate is before or equal to closingDate', () => {
      // Arrange
      const closingDate = new Date('2024-06-15T23:59:59Z');
      const sameDueDate = new Date('2024-06-15T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 100000,
        creditCardId: 'card-123',
        closingDate: closingDate,
        dueDate: sameDueDate,
      };

      // Act
      const result = CreditCardBill.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Due date must be after closing date');
    });

    it('should return error when dueDate is before closingDate', () => {
      // Arrange
      const closingDate = new Date('2024-06-15T23:59:59Z');
      const beforeDueDate = new Date('2024-06-10T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 100000,
        creditCardId: 'card-123',
        closingDate: closingDate,
        dueDate: beforeDueDate,
      };

      // Act
      const result = CreditCardBill.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Due date must be after closing date');
    });

    it('should return error when status is invalid', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: any = {
        totalAmountInCents: 100000,
        creditCardId: 'card-123',
        closingDate: closingDate,
        dueDate: dueDate,
        status: 'INVALID_STATUS',
      };

      // Act
      const result = CreditCardBill.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain(
        'Invalid status. Must be one of: OPEN, CLOSED, PAID, OVERDUE',
      );
    });
  });

  describe('when accessing CreditCardBill properties', () => {
    let bill: CreditCardBill;

    beforeEach(() => {
      // Arrange
      const closingDate = new Date('2024-08-10T23:59:59Z');
      const dueDate = new Date('2024-08-25T23:59:59Z');
      const paidAt = new Date('2024-08-20T16:30:00Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 350000, // R$ 3500.00
        creditCardId: 'card-premium',
        closingDate: closingDate,
        dueDate: dueDate,
        status: CreditCardBillStatus.PAID,
        paidAmountInCents: 350000, // R$ 3500.00
        paidAt: paidAt,
      };

      bill = CreditCardBill.create(props).data!;
    });

    it('should return correct id', () => {
      // Act
      const id = bill.id;

      // Assert
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should return correct totalAmount as Money object', () => {
      // Act
      const totalAmount = bill.totalAmount;

      // Assert
      expect(totalAmount.valueInCents).toBe(350000);
      expect(totalAmount.valueInMonetary).toBe(3500.0);
    });

    it('should return correct paidAmount as Money object', () => {
      // Act
      const paidAmount = bill.paidAmount;

      // Assert
      expect(paidAmount.valueInCents).toBe(350000);
      expect(paidAmount.valueInMonetary).toBe(3500.0);
    });

    it('should return correct creditCardId', () => {
      // Act
      const creditCardId = bill.creditCardId;

      // Assert
      expect(creditCardId).toBe('card-premium');
    });

    it('should return correct closingDate as new instance', () => {
      // Act
      const closingDate = bill.closingDate;

      // Assert
      expect(closingDate).toEqual(new Date('2024-08-10T23:59:59Z'));
      expect(closingDate).not.toBe(bill.closingDate); // Different instances
    });

    it('should return correct dueDate as new instance', () => {
      // Act
      const dueDate = bill.dueDate;

      // Assert
      expect(dueDate).toEqual(new Date('2024-08-25T23:59:59Z'));
      expect(dueDate).not.toBe(bill.dueDate); // Different instances
    });

    it('should return correct status', () => {
      // Act
      const status = bill.status;

      // Assert
      expect(status).toBe(CreditCardBillStatus.PAID);
    });

    it('should return correct paidAt as new instance', () => {
      // Act
      const paidAt = bill.paidAt;

      // Assert
      expect(paidAt).toEqual(new Date('2024-08-20T16:30:00Z'));
      expect(paidAt).not.toBe(bill.paidAt); // Different instances
    });

    it('should return null paidAt when not set', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 100000,
        creditCardId: 'card-unpaid',
        closingDate: closingDate,
        dueDate: dueDate,
      };
      const unpaidBill = CreditCardBill.create(props).data!;

      // Act
      const paidAt = unpaidBill.paidAt;

      // Assert
      expect(paidAt).toBeNull();
    });

    it('should return correct createdAt date as new instance', () => {
      // Act
      const createdAt = bill.createdAt;

      // Assert
      expect(createdAt).toBeInstanceOf(Date);
      expect(createdAt).not.toBe(bill.createdAt); // Different instances
    });
  });

  describe('when using business methods', () => {
    it('should calculate remaining amount correctly', () => {
      // Arrange
      const closingDate = new Date('2024-05-10T23:59:59Z');
      const dueDate = new Date('2024-05-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 200000, // R$ 2000.00
        creditCardId: 'card-partial',
        closingDate: closingDate,
        dueDate: dueDate,
        paidAmountInCents: 75000, // R$ 750.00
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const remaining = bill.getRemainingAmount();

      // Assert
      expect(remaining.valueInCents).toBe(125000); // R$ 1250.00
      expect(remaining.valueInMonetary).toBe(1250.0);
    });

    it('should return zero remaining amount when fully paid', () => {
      // Arrange
      const closingDate = new Date('2024-05-10T23:59:59Z');
      const dueDate = new Date('2024-05-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 150000, // R$ 1500.00
        creditCardId: 'card-paid',
        closingDate: closingDate,
        dueDate: dueDate,
        paidAmountInCents: 150000, // R$ 1500.00
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const remaining = bill.getRemainingAmount();

      // Assert
      expect(remaining.valueInCents).toBe(0);
      expect(remaining.valueInMonetary).toBe(0);
    });

    it('should return zero remaining amount when overpaid', () => {
      // Arrange
      const closingDate = new Date('2024-05-10T23:59:59Z');
      const dueDate = new Date('2024-05-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 100000, // R$ 1000.00
        creditCardId: 'card-overpaid',
        closingDate: closingDate,
        dueDate: dueDate,
        paidAmountInCents: 120000, // R$ 1200.00
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const remaining = bill.getRemainingAmount();

      // Assert
      expect(remaining.valueInCents).toBe(0);
      expect(remaining.valueInMonetary).toBe(0);
    });

    it('should detect paid status correctly', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 100000,
        creditCardId: 'card-paid',
        closingDate: closingDate,
        dueDate: dueDate,
        status: CreditCardBillStatus.PAID,
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const isPaid = bill.isPaid();

      // Assert
      expect(isPaid).toBe(true);
    });

    it('should return false for isPaid when not paid', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 100000,
        creditCardId: 'card-open',
        closingDate: closingDate,
        dueDate: dueDate,
        status: CreditCardBillStatus.OPEN,
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const isPaid = bill.isPaid();

      // Assert
      expect(isPaid).toBe(false);
    });

    it('should detect overdue status when marked as OVERDUE', () => {
      // Arrange
      const closingDate = new Date('2024-05-10T23:59:59Z');
      const dueDate = new Date('2024-05-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 100000,
        creditCardId: 'card-overdue',
        closingDate: closingDate,
        dueDate: dueDate,
        status: CreditCardBillStatus.OVERDUE,
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const isOverdue = bill.isOverdue();

      // Assert
      expect(isOverdue).toBe(true);
    });

    it('should detect overdue when closed and past due date', () => {
      // Arrange
      const pastDate = new Date('2023-12-25T23:59:59Z'); // Past due date
      const closingDate = new Date('2023-12-10T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 100000,
        creditCardId: 'card-past-due',
        closingDate: closingDate,
        dueDate: pastDate,
        status: CreditCardBillStatus.CLOSED,
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const isOverdue = bill.isOverdue();

      // Assert
      expect(isOverdue).toBe(true);
    });

    it('should not detect overdue when open and past due date', () => {
      // Arrange
      const pastDate = new Date('2023-12-25T23:59:59Z'); // Past due date
      const closingDate = new Date('2023-12-10T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 100000,
        creditCardId: 'card-open-past',
        closingDate: closingDate,
        dueDate: pastDate,
        status: CreditCardBillStatus.OPEN,
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const isOverdue = bill.isOverdue();

      // Assert
      expect(isOverdue).toBe(false);
    });

    it('should detect partial payment correctly', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 200000, // R$ 2000.00
        creditCardId: 'card-partial',
        closingDate: closingDate,
        dueDate: dueDate,
        paidAmountInCents: 100000, // R$ 1000.00
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const isPartiallyPaid = bill.isPartiallyPaid();

      // Assert
      expect(isPartiallyPaid).toBe(true);
    });

    it('should return false for partial payment when not paid', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 200000,
        creditCardId: 'card-unpaid',
        closingDate: closingDate,
        dueDate: dueDate,
        paidAmountInCents: 0,
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const isPartiallyPaid = bill.isPartiallyPaid();

      // Assert
      expect(isPartiallyPaid).toBe(false);
    });

    it('should return false for partial payment when fully paid', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 200000,
        creditCardId: 'card-full',
        closingDate: closingDate,
        dueDate: dueDate,
        paidAmountInCents: 200000,
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const isPartiallyPaid = bill.isPartiallyPaid();

      // Assert
      expect(isPartiallyPaid).toBe(false);
    });

    it('should format total amount correctly in BRL', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 156789, // R$ 1567.89
        creditCardId: 'card-format',
        closingDate: closingDate,
        dueDate: dueDate,
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const formatted = bill.formatTotalAmount();

      // Assert
      expect(formatted).toBe('R$\u00a01.567,89');
    });

    it('should format paid amount correctly in BRL', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 200000,
        creditCardId: 'card-format',
        closingDate: closingDate,
        dueDate: dueDate,
        paidAmountInCents: 87654, // R$ 876.54
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const formatted = bill.formatPaidAmount();

      // Assert
      expect(formatted).toBe('R$\u00a0876,54');
    });

    it('should format remaining amount correctly in BRL', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 300000, // R$ 3000.00
        creditCardId: 'card-format',
        closingDate: closingDate,
        dueDate: dueDate,
        paidAmountInCents: 125000, // R$ 1250.00
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const formatted = bill.formatRemainingAmount();

      // Assert
      expect(formatted).toBe('R$\u00a01.750,00'); // R$ 1750.00
    });

    it('should return correct status labels', () => {
      // Arrange & Act & Assert
      const statusLabels: Record<CreditCardBillStatus, string> = {
        [CreditCardBillStatus.OPEN]: 'Aberta',
        [CreditCardBillStatus.CLOSED]: 'Fechada',
        [CreditCardBillStatus.PAID]: 'Paga',
        [CreditCardBillStatus.OVERDUE]: 'Vencida',
      };

      Object.entries(statusLabels).forEach(([status, expectedLabel]) => {
        const closingDate = new Date('2024-06-10T23:59:59Z');
        const dueDate = new Date('2024-06-25T23:59:59Z');
        const props: CreditCardBillProps = {
          totalAmountInCents: 100000,
          creditCardId: 'card-status',
          closingDate: closingDate,
          dueDate: dueDate,
          status: status as CreditCardBillStatus,
        };
        const bill = CreditCardBill.create(props).data!;

        expect(bill.getStatusLabel()).toBe(expectedLabel);
      });
    });

    it('should calculate days until due correctly', () => {
      // Arrange
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + 15); // 15 days from now

      const closingDate = new Date();
      closingDate.setDate(today.getDate() - 5); // 5 days ago

      const props: CreditCardBillProps = {
        totalAmountInCents: 100000,
        creditCardId: 'card-future',
        closingDate: closingDate,
        dueDate: futureDate,
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const daysUntilDue = bill.getDaysUntilDue();

      // Assert
      expect(daysUntilDue).toBe(15);
    });

    it('should return negative days when past due', () => {
      // Arrange
      const today = new Date();
      const pastDate = new Date();
      pastDate.setDate(today.getDate() - 10); // 10 days ago

      const closingDate = new Date();
      closingDate.setDate(today.getDate() - 20); // 20 days ago

      const props: CreditCardBillProps = {
        totalAmountInCents: 100000,
        creditCardId: 'card-past',
        closingDate: closingDate,
        dueDate: pastDate,
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const daysUntilDue = bill.getDaysUntilDue();

      // Assert
      expect(daysUntilDue).toBe(-10);
    });
  });

  describe('when serializing to JSON', () => {
    it('should convert bill to JSON correctly', () => {
      // Arrange
      const closingDate = new Date('2024-09-15T23:59:59.000Z');
      const dueDate = new Date('2024-10-05T23:59:59.000Z');
      const paidAt = new Date('2024-10-01T10:30:00.000Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 425000, // R$ 4250.00
        creditCardId: 'card-json',
        closingDate: closingDate,
        dueDate: dueDate,
        status: CreditCardBillStatus.PAID,
        paidAmountInCents: 425000, // R$ 4250.00
        paidAt: paidAt,
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const json = bill.toJSON();

      // Assert
      expect(json.id).toBe(bill.id);
      expect(json.totalAmount.valueInCents).toBe(425000);
      expect(json.totalAmount.valueInMonetary).toBe(4250.0);
      expect(json.totalAmount.formatted).toBe('R$\u00a04.250,00');
      expect(json.paidAmount.valueInCents).toBe(425000);
      expect(json.paidAmount.valueInMonetary).toBe(4250.0);
      expect(json.paidAmount.formatted).toBe('R$\u00a04.250,00');
      expect(json.creditCardId).toBe('card-json');
      expect(json.closingDate).toBe('2024-09-15T23:59:59.000Z');
      expect(json.dueDate).toBe('2024-10-05T23:59:59.000Z');
      expect(json.status).toBe(CreditCardBillStatus.PAID);
      expect(json.paidAt).toBe('2024-10-01T10:30:00.000Z');
      expect(json.createdAt).toBeDefined();
      expect(typeof json.createdAt).toBe('string');
    });

    it('should handle null paidAt in JSON', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 150000,
        creditCardId: 'card-no-payment',
        closingDate: closingDate,
        dueDate: dueDate,
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const json = bill.toJSON();

      // Assert
      expect(json.paidAt).toBeNull();
    });

    it('should include all fields in JSON output', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 100000,
        creditCardId: 'card-complete',
        closingDate: closingDate,
        dueDate: dueDate,
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const json = bill.toJSON();

      // Assert
      const expectedKeys = [
        'id',
        'totalAmount',
        'paidAmount',
        'creditCardId',
        'closingDate',
        'dueDate',
        'status',
        'paidAt',
        'createdAt',
      ];
      expectedKeys.forEach((key) => {
        expect(json.hasOwnProperty(key)).toBe(true);
      });

      expect(Object.keys(json).length).toBe(expectedKeys.length);
    });
  });

  describe('when deserializing from JSON', () => {
    it('should create bill from valid JSON', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        totalAmount: { valueInCents: 275000 },
        paidAmount: { valueInCents: 137500 },
        creditCardId: 'card-restored',
        closingDate: '2024-11-10T23:59:59.000Z',
        dueDate: '2024-11-25T23:59:59.000Z',
        status: CreditCardBillStatus.CLOSED,
        paidAt: '2024-11-20T14:15:00.000Z',
        createdAt: '2024-11-05T09:00:00.000Z',
      };

      // Act
      const result = CreditCardBill.fromJSON(json);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);

      const bill = result.data!;
      expect(bill.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(bill.totalAmount.valueInCents).toBe(275000);
      expect(bill.totalAmount.valueInMonetary).toBe(2750.0);
      expect(bill.paidAmount.valueInCents).toBe(137500);
      expect(bill.paidAmount.valueInMonetary).toBe(1375.0);
      expect(bill.creditCardId).toBe('card-restored');
      expect(bill.closingDate).toEqual(new Date('2024-11-10T23:59:59.000Z'));
      expect(bill.dueDate).toEqual(new Date('2024-11-25T23:59:59.000Z'));
      expect(bill.status).toBe(CreditCardBillStatus.CLOSED);
      expect(bill.paidAt).toEqual(new Date('2024-11-20T14:15:00.000Z'));
      expect(bill.createdAt).toEqual(new Date('2024-11-05T09:00:00.000Z'));
    });

    it('should create bill from JSON with null paidAt', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        totalAmount: { valueInCents: 100000 },
        paidAmount: { valueInCents: 0 },
        creditCardId: 'card-no-payment',
        closingDate: '2024-11-10T23:59:59.000Z',
        dueDate: '2024-11-25T23:59:59.000Z',
        status: CreditCardBillStatus.OPEN,
        paidAt: null,
        createdAt: '2024-11-05T09:00:00.000Z',
      };

      // Act
      const result = CreditCardBill.fromJSON(json);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.paidAt).toBeNull();
    });

    it('should return error when JSON has invalid id', () => {
      // Arrange
      const json = {
        id: 'invalid-uuid-format',
        totalAmount: { valueInCents: 100000 },
        paidAmount: { valueInCents: 50000 },
        creditCardId: 'card-test',
        closingDate: '2024-11-10T23:59:59.000Z',
        dueDate: '2024-11-25T23:59:59.000Z',
        status: CreditCardBillStatus.OPEN,
        paidAt: null,
        createdAt: '2024-11-05T09:00:00.000Z',
      };

      // Act
      const result = CreditCardBill.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Invalid UUID format');
    });

    it('should return error when JSON has invalid total amount', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        totalAmount: { valueInCents: -100000 },
        paidAmount: { valueInCents: 50000 },
        creditCardId: 'card-test',
        closingDate: '2024-11-10T23:59:59.000Z',
        dueDate: '2024-11-25T23:59:59.000Z',
        status: CreditCardBillStatus.OPEN,
        paidAt: null,
        createdAt: '2024-11-05T09:00:00.000Z',
      };

      // Act
      const result = CreditCardBill.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });

    it('should return error when JSON has invalid paid amount', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        totalAmount: { valueInCents: 100000 },
        paidAmount: { valueInCents: -50000 },
        creditCardId: 'card-test',
        closingDate: '2024-11-10T23:59:59.000Z',
        dueDate: '2024-11-25T23:59:59.000Z',
        status: CreditCardBillStatus.OPEN,
        paidAt: null,
        createdAt: '2024-11-05T09:00:00.000Z',
      };

      // Act
      const result = CreditCardBill.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });

    it('should return error when JSON has empty creditCardId', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        totalAmount: { valueInCents: 100000 },
        paidAmount: { valueInCents: 50000 },
        creditCardId: '',
        closingDate: '2024-11-10T23:59:59.000Z',
        dueDate: '2024-11-25T23:59:59.000Z',
        status: CreditCardBillStatus.OPEN,
        paidAt: null,
        createdAt: '2024-11-05T09:00:00.000Z',
      };

      // Act
      const result = CreditCardBill.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Credit card ID cannot be empty');
    });

    it('should return error when JSON has invalid status', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        totalAmount: { valueInCents: 100000 },
        paidAmount: { valueInCents: 50000 },
        creditCardId: 'card-test',
        closingDate: '2024-11-10T23:59:59.000Z',
        dueDate: '2024-11-25T23:59:59.000Z',
        status: 'INVALID_STATUS' as CreditCardBillStatus,
        paidAt: null,
        createdAt: '2024-11-05T09:00:00.000Z',
      };

      // Act
      const result = CreditCardBill.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain(
        'Invalid status. Must be one of: OPEN, CLOSED, PAID, OVERDUE',
      );
    });

    it('should return error when JSON has invalid date sequence', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        totalAmount: { valueInCents: 100000 },
        paidAmount: { valueInCents: 50000 },
        creditCardId: 'card-test',
        closingDate: '2024-11-25T23:59:59.000Z',
        dueDate: '2024-11-10T23:59:59.000Z', // Before closing date
        status: CreditCardBillStatus.OPEN,
        paidAt: null,
        createdAt: '2024-11-05T09:00:00.000Z',
      };

      // Act
      const result = CreditCardBill.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Due date must be after closing date');
    });
  });

  describe('when using CreditCardBill in real scenarios', () => {
    it('should work in collections and filtering by status', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');

      const openProps: CreditCardBillProps = {
        totalAmountInCents: 100000,
        creditCardId: 'card-open',
        closingDate: closingDate,
        dueDate: dueDate,
        status: CreditCardBillStatus.OPEN,
      };

      const paidProps: CreditCardBillProps = {
        totalAmountInCents: 150000,
        creditCardId: 'card-paid',
        closingDate: closingDate,
        dueDate: dueDate,
        status: CreditCardBillStatus.PAID,
        paidAmountInCents: 150000,
      };

      const overdueProps: CreditCardBillProps = {
        totalAmountInCents: 200000,
        creditCardId: 'card-overdue',
        closingDate: closingDate,
        dueDate: dueDate,
        status: CreditCardBillStatus.OVERDUE,
      };

      const bills = [
        CreditCardBill.create(openProps).data!,
        CreditCardBill.create(paidProps).data!,
        CreditCardBill.create(overdueProps).data!,
      ];

      // Act
      const unpaidBills = bills.filter((bill) => !bill.isPaid());
      const overdueBills = bills.filter((bill) => bill.isOverdue());

      // Assert
      expect(unpaidBills.length).toBe(2);
      expect(overdueBills.length).toBe(1);
      expect(overdueBills[0].creditCardId).toBe('card-overdue');
    });

    it('should calculate total outstanding amounts correctly', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');

      const billProps = [
        { totalAmountInCents: 100000, paidAmountInCents: 60000 }, // R$ 400.00 remaining
        { totalAmountInCents: 200000, paidAmountInCents: 0 }, // R$ 2000.00 remaining
        { totalAmountInCents: 150000, paidAmountInCents: 150000 }, // R$ 0.00 remaining
      ].map((props) => ({
        ...props,
        creditCardId: 'card-total',
        closingDate: closingDate,
        dueDate: dueDate,
      }));

      const bills = billProps.map((props) => CreditCardBill.create(props).data!);

      // Act
      const totalOutstanding = bills.reduce(
        (sum, bill) => sum + bill.getRemainingAmount().valueInCents,
        0,
      );

      // Assert
      expect(totalOutstanding).toBe(240000); // R$ 2400.00
    });

    it('should work with payment tracking', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 300000, // R$ 3000.00
        creditCardId: 'card-payment-tracking',
        closingDate: closingDate,
        dueDate: dueDate,
        paidAmountInCents: 180000, // R$ 1800.00
      };
      const bill = CreditCardBill.create(props).data!;

      // Act
      const paymentProgress = (bill.paidAmount.valueInCents / bill.totalAmount.valueInCents) * 100;

      // Assert
      expect(bill.isPartiallyPaid()).toBe(true);
      expect(Math.round(paymentProgress)).toBe(60); // 60% paid
      expect(bill.getRemainingAmount().valueInMonetary).toBe(1200.0); // R$ 1200.00 remaining
    });

    it('should maintain immutability', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 100000,
        creditCardId: 'card-immutable',
        closingDate: closingDate,
        dueDate: dueDate,
      };
      const bill = CreditCardBill.create(props).data!;

      // Act & Assert
      const originalClosingDate = bill.closingDate;
      const newClosingDate = bill.closingDate;
      newClosingDate.setFullYear(2000); // Try to modify returned date

      // The original bill should not be affected
      expect(bill.closingDate).not.toBe(newClosingDate);
      expect(bill.closingDate).toEqual(originalClosingDate);
    });
  });

  describe('edge cases and boundary conditions', () => {
    it('should handle very large amounts', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:59Z');
      const dueDate = new Date('2024-06-25T23:59:59Z');
      const props: CreditCardBillProps = {
        totalAmountInCents: 999999999, // R$ 9,999,999.99
        creditCardId: 'card-large',
        closingDate: closingDate,
        dueDate: dueDate,
        paidAmountInCents: 500000000, // R$ 5,000,000.00
      };

      // Act
      const result = CreditCardBill.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.totalAmount.valueInCents).toBe(999999999);
      expect(result.data!.paidAmount.valueInCents).toBe(500000000);
    });

    it('should handle minimum time difference between dates', () => {
      // Arrange
      const closingDate = new Date('2024-06-10T23:59:58Z');
      const dueDate = new Date('2024-06-10T23:59:59Z'); // 1 second later
      const props: CreditCardBillProps = {
        totalAmountInCents: 100000,
        creditCardId: 'card-minimal-diff',
        closingDate: closingDate,
        dueDate: dueDate,
      };

      // Act
      const result = CreditCardBill.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.closingDate).toEqual(closingDate);
      expect(result.data!.dueDate).toEqual(dueDate);
    });

    it('should handle JSON serialization round-trip', () => {
      // Arrange
      const closingDate = new Date('2024-08-15T14:30:00.000Z');
      const dueDate = new Date('2024-09-01T23:59:59.000Z');
      const paidAt = new Date('2024-08-25T11:45:30.000Z');
      const originalProps: CreditCardBillProps = {
        totalAmountInCents: 777777,
        creditCardId: 'card-roundtrip',
        closingDate: closingDate,
        dueDate: dueDate,
        status: CreditCardBillStatus.PAID,
        paidAmountInCents: 777777,
        paidAt: paidAt,
      };
      const originalBill = CreditCardBill.create(originalProps).data!;

      // Act
      const json = originalBill.toJSON();
      const restoredResult = CreditCardBill.fromJSON(json);

      // Assert
      expect(restoredResult.hasData).toBe(true);
      const restoredBill = restoredResult.data!;

      expect(restoredBill.id).toBe(originalBill.id);
      expect(restoredBill.totalAmount.valueInCents).toBe(originalBill.totalAmount.valueInCents);
      expect(restoredBill.paidAmount.valueInCents).toBe(originalBill.paidAmount.valueInCents);
      expect(restoredBill.creditCardId).toBe(originalBill.creditCardId);
      expect(restoredBill.closingDate).toEqual(originalBill.closingDate);
      expect(restoredBill.dueDate).toEqual(originalBill.dueDate);
      expect(restoredBill.status).toBe(originalBill.status);
      expect(restoredBill.paidAt).toEqual(originalBill.paidAt);
      expect(restoredBill.createdAt).toEqual(originalBill.createdAt);
    });
  });
});
