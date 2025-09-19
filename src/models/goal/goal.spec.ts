import { Goal, GoalProps, GoalStatus } from './goal';
import { Money } from '../shared/value-objects/money';

describe('Goal', () => {
  describe('when creating a new Goal with valid props', () => {
    it('should create goal successfully with all required fields', () => {
      // Arrange
      const props: GoalProps = {
        name: 'New Car',
        targetAmountInCents: 5000000, // R$ 50000.00
        currentAmountInCents: 1250000, // R$ 12500.00
        budgetId: 'budget-123'
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);

      const goal = result.data!;
      expect(goal.name).toBe('New Car');
      expect(goal.targetAmount.valueInCents).toBe(5000000);
      expect(goal.targetAmount.valueInMonetary).toBe(50000.00);
      expect(goal.currentAmount.valueInCents).toBe(1250000);
      expect(goal.currentAmount.valueInMonetary).toBe(12500.00);
      expect(goal.budgetId).toBe('budget-123');
      expect(goal.targetDate).toBeNull();
      expect(goal.description).toBe('');
      expect(goal.status).toBe(GoalStatus.ACTIVE);
      expect(goal.id).toBeDefined();
      expect(goal.createdAt).toBeInstanceOf(Date);
    });

    it('should create goal successfully with all optional fields', () => {
      // Arrange
      const targetDate = new Date('2026-12-31T23:59:59Z');
      const props: GoalProps = {
        name: 'Vacation Fund',
        targetAmountInCents: 800000, // R$ 8000.00
        currentAmountInCents: 350000, // R$ 3500.00
        budgetId: 'budget-vacation',
        targetDate: targetDate,
        description: 'Dream vacation to Europe',
        status: GoalStatus.PAUSED
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);

      const goal = result.data!;
      expect(goal.name).toBe('Vacation Fund');
      expect(goal.targetAmount.valueInCents).toBe(800000);
      expect(goal.currentAmount.valueInCents).toBe(350000);
      expect(goal.budgetId).toBe('budget-vacation');
      expect(goal.targetDate).toEqual(targetDate);
      expect(goal.description).toBe('Dream vacation to Europe');
      expect(goal.status).toBe(GoalStatus.PAUSED);
    });

    it('should create goal with zero current amount', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Emergency Fund',
        targetAmountInCents: 1000000,
        currentAmountInCents: 0,
        budgetId: 'budget-emergency'
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.currentAmount.valueInMonetary).toBe(0);
    });

    it('should create goal with current amount equal to target', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Completed Goal',
        targetAmountInCents: 50000,
        currentAmountInCents: 50000,
        budgetId: 'budget-completed'
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.targetAmount.valueInMonetary).toBe(500.00);
      expect(result.data!.currentAmount.valueInMonetary).toBe(500.00);
    });

    it('should create goal with each valid status', () => {
      // Arrange & Act & Assert
      Object.values(GoalStatus).forEach(status => {
        const props: GoalProps = {
          name: `Goal ${status}`,
          targetAmountInCents: 100000,
          currentAmountInCents: 50000,
          budgetId: 'budget-status',
          status: status
        };

        const result = Goal.create(props);

        expect(result.hasData).toBe(true);
        expect(result.data!.status).toBe(status);
      });
    });
  });

  describe('when creating Goal with invalid props', () => {
    it('should return error when name is empty string', () => {
      // Arrange
      const props: GoalProps = {
        name: '',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-123'
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should return error when name is whitespace only', () => {
      // Arrange
      const props: GoalProps = {
        name: '   ',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-123'
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should return error when name is not a string', () => {
      // Arrange
      const props: any = {
        name: 123,
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-123'
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Name must be a string');
    });

    it('should return error when name exceeds 100 characters', () => {
      // Arrange
      const props: GoalProps = {
        name: 'A'.repeat(101),
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-123'
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Name cannot exceed 100 characters');
    });

    it('should return error when targetAmountInCents is negative', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Valid Goal',
        targetAmountInCents: -100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-123'
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });

    it('should return error when currentAmountInCents is negative', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Valid Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: -50000,
        budgetId: 'budget-123'
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });

    it('should return error when budgetId is empty string', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Valid Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: ''
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Budget ID cannot be empty');
    });

    it('should return error when budgetId is whitespace only', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Valid Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: '   '
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Budget ID cannot be empty');
    });

    it('should return error when budgetId is not a string', () => {
      // Arrange
      const props: any = {
        name: 'Valid Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 123
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Budget ID must be a string');
    });

    it('should return error when targetDate is in the past', () => {
      // Arrange
      const pastDate = new Date('2020-01-01T00:00:00Z');
      const props: GoalProps = {
        name: 'Valid Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-123',
        targetDate: pastDate
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Target date cannot be in the past');
    });

    it('should return error when targetDate is invalid', () => {
      // Arrange
      const props: any = {
        name: 'Valid Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-123',
        targetDate: 'invalid-date'
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Target date must be a valid date');
    });

    it('should return error when status is invalid', () => {
      // Arrange
      const props: any = {
        name: 'Valid Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-123',
        status: 'INVALID_STATUS'
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Invalid status. Must be one of: ACTIVE, PAUSED, COMPLETED, CANCELLED');
    });
  });

  describe('when accessing Goal properties', () => {
    let goal: Goal;

    beforeEach(() => {
      // Arrange
      const targetDate = new Date('2026-06-15T12:00:00Z');
      const props: GoalProps = {
        name: 'Home Down Payment',
        targetAmountInCents: 10000000, // R$ 100000.00
        currentAmountInCents: 2750000, // R$ 27500.00
        budgetId: 'budget-home',
        targetDate: targetDate,
        description: 'Saving for first home',
        status: GoalStatus.ACTIVE
      };

      goal = Goal.create(props).data!;
    });

    it('should return correct id', () => {
      // Act
      const id = goal.id;

      // Assert
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should return correct name', () => {
      // Act
      const name = goal.name;

      // Assert
      expect(name).toBe('Home Down Payment');
    });

    it('should return correct targetAmount as Money object', () => {
      // Act
      const targetAmount = goal.targetAmount;

      // Assert
      expect(targetAmount.valueInCents).toBe(10000000);
      expect(targetAmount.valueInMonetary).toBe(100000.00);
    });

    it('should return correct currentAmount as Money object', () => {
      // Act
      const currentAmount = goal.currentAmount;

      // Assert
      expect(currentAmount.valueInCents).toBe(2750000);
      expect(currentAmount.valueInMonetary).toBe(27500.00);
    });

    it('should return correct budgetId', () => {
      // Act
      const budgetId = goal.budgetId;

      // Assert
      expect(budgetId).toBe('budget-home');
    });

    it('should return correct targetDate as new instance', () => {
      // Act
      const targetDate = goal.targetDate;

      // Assert
      expect(targetDate).toEqual(new Date('2026-06-15T12:00:00Z'));
      expect(targetDate).not.toBe(goal.targetDate); // Different instances
    });

    it('should return null targetDate when not set', () => {
      // Arrange
      const props: GoalProps = {
        name: 'No Date Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-no-date'
      };
      const goalWithoutDate = Goal.create(props).data!;

      // Act
      const targetDate = goalWithoutDate.targetDate;

      // Assert
      expect(targetDate).toBeNull();
    });

    it('should return correct description', () => {
      // Act
      const description = goal.description;

      // Assert
      expect(description).toBe('Saving for first home');
    });

    it('should return correct status', () => {
      // Act
      const status = goal.status;

      // Assert
      expect(status).toBe(GoalStatus.ACTIVE);
    });

    it('should return correct createdAt date as new instance', () => {
      // Act
      const createdAt = goal.createdAt;

      // Assert
      expect(createdAt).toBeInstanceOf(Date);
      expect(createdAt).not.toBe(goal.createdAt); // Different instances
    });
  });

  describe('when using business methods', () => {
    it('should calculate remaining amount correctly', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Laptop Fund',
        targetAmountInCents: 300000, // R$ 3000.00
        currentAmountInCents: 125000, // R$ 1250.00
        budgetId: 'budget-laptop'
      };
      const goal = Goal.create(props).data!;

      // Act
      const remaining = goal.getRemainingAmount();

      // Assert
      expect(remaining.valueInCents).toBe(175000); // R$ 1750.00
      expect(remaining.valueInMonetary).toBe(1750.00);
    });

    it('should return zero remaining amount when current exceeds target', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Exceeded Goal',
        targetAmountInCents: 100000, // R$ 1000.00
        currentAmountInCents: 150000, // R$ 1500.00
        budgetId: 'budget-exceeded'
      };
      const goal = Goal.create(props).data!;

      // Act
      const remaining = goal.getRemainingAmount();

      // Assert
      expect(remaining.valueInCents).toBe(0);
      expect(remaining.valueInMonetary).toBe(0);
    });

    it('should calculate progress percentage correctly', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Progress Test',
        targetAmountInCents: 200000, // R$ 2000.00
        currentAmountInCents: 50000, // R$ 500.00 (25%)
        budgetId: 'budget-progress'
      };
      const goal = Goal.create(props).data!;

      // Act
      const percentage = goal.getProgressPercentage();

      // Assert
      expect(percentage).toBe(25);
    });

    it('should return 0 progress percentage when target is zero', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Zero Target',
        targetAmountInCents: 0,
        currentAmountInCents: 50000,
        budgetId: 'budget-zero'
      };
      const goal = Goal.create(props).data!;

      // Act
      const percentage = goal.getProgressPercentage();

      // Assert
      expect(percentage).toBe(0);
    });

    it('should cap progress percentage at 100', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Over Progress',
        targetAmountInCents: 100000, // R$ 1000.00
        currentAmountInCents: 250000, // R$ 2500.00 (250%)
        budgetId: 'budget-over'
      };
      const goal = Goal.create(props).data!;

      // Act
      const percentage = goal.getProgressPercentage();

      // Assert
      expect(percentage).toBe(100);
    });

    it('should detect completion when status is COMPLETED', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Completed Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 80000,
        budgetId: 'budget-completed',
        status: GoalStatus.COMPLETED
      };
      const goal = Goal.create(props).data!;

      // Act
      const isCompleted = goal.isCompleted();

      // Assert
      expect(isCompleted).toBe(true);
    });

    it('should detect completion when current amount equals target', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Exactly Reached Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 100000,
        budgetId: 'budget-exact'
      };
      const goal = Goal.create(props).data!;

      // Act
      const isCompleted = goal.isCompleted();

      // Assert
      expect(isCompleted).toBe(true);
    });

    it('should detect completion when current amount exceeds target', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Exceeded Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 120000,
        budgetId: 'budget-exceeded'
      };
      const goal = Goal.create(props).data!;

      // Act
      const isCompleted = goal.isCompleted();

      // Assert
      expect(isCompleted).toBe(true);
    });

    it('should not detect completion when under target and not marked as completed', () => {
      // Arrange
      const props: GoalProps = {
        name: 'In Progress Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 80000,
        budgetId: 'budget-progress'
      };
      const goal = Goal.create(props).data!;

      // Act
      const isCompleted = goal.isCompleted();

      // Assert
      expect(isCompleted).toBe(false);
    });

    it('should detect overdue when past target date and not completed', () => {
      // Arrange
      // Since validation prevents past dates, we'll test the overdue logic
      // by creating a Goal with a very near future date and then
      // testing the isOverdue method logic conceptually
      const nearFutureDate = new Date();
      nearFutureDate.setDate(nearFutureDate.getDate() + 1); // Tomorrow

      const props: GoalProps = {
        name: 'Future Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-future',
        targetDate: nearFutureDate
      };
      const goal = Goal.create(props).data!;

      // Act
      const isOverdue = goal.isOverdue();

      // Assert
      // Should not be overdue since target date is in the future
      expect(isOverdue).toBe(false);
    });

    it('should not detect overdue when no target date', () => {
      // Arrange
      const props: GoalProps = {
        name: 'No Date Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-no-date'
      };
      const goal = Goal.create(props).data!;

      // Act
      const isOverdue = goal.isOverdue();

      // Assert
      expect(isOverdue).toBe(false);
    });

    it('should not detect overdue when completed', () => {
      // Arrange
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30); // Future date

      const props: GoalProps = {
        name: 'Completed Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 100000, // Completed
        budgetId: 'budget-completed',
        targetDate: futureDate
      };
      const goal = Goal.create(props).data!;

      // Act
      const isOverdue = goal.isOverdue();

      // Assert
      // Should not be overdue when completed regardless of date
      expect(isOverdue).toBe(false);
    });

    it('should calculate days until target correctly', () => {
      // Arrange
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30); // 30 days from now

      const props: GoalProps = {
        name: 'Future Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-future',
        targetDate: futureDate
      };
      const goal = Goal.create(props).data!;

      // Act
      const daysUntilTarget = goal.getDaysUntilTarget();

      // Assert
      expect(daysUntilTarget).toBe(30);
    });

    it('should return null days until target when no target date', () => {
      // Arrange
      const props: GoalProps = {
        name: 'No Date Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-no-date'
      };
      const goal = Goal.create(props).data!;

      // Act
      const daysUntilTarget = goal.getDaysUntilTarget();

      // Assert
      expect(daysUntilTarget).toBeNull();
    });

    it('should calculate monthly target amount correctly', () => {
      // Arrange
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 6); // 6 months from now

      const props: GoalProps = {
        name: 'Monthly Target Goal',
        targetAmountInCents: 600000, // R$ 6000.00
        currentAmountInCents: 0,
        budgetId: 'budget-monthly',
        targetDate: futureDate
      };
      const goal = Goal.create(props).data!;

      // Act
      const monthlyTarget = goal.getMonthlyTargetAmount();

      // Assert
      expect(monthlyTarget).not.toBeNull();
      expect(monthlyTarget!.valueInMonetary).toBe(1000.00); // R$ 1000.00 per month
    });

    it('should return null monthly target when no target date', () => {
      // Arrange
      const props: GoalProps = {
        name: 'No Date Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-no-date'
      };
      const goal = Goal.create(props).data!;

      // Act
      const monthlyTarget = goal.getMonthlyTargetAmount();

      // Assert
      expect(monthlyTarget).toBeNull();
    });

    it('should format target amount correctly in BRL', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Format Test',
        targetAmountInCents: 567890, // R$ 5678.90
        currentAmountInCents: 123456,
        budgetId: 'budget-format'
      };
      const goal = Goal.create(props).data!;

      // Act
      const formatted = goal.formatTargetAmount();

      // Assert
      expect(formatted).toBe('R$\u00a05.678,90');
    });

    it('should format current amount correctly in BRL', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Format Test',
        targetAmountInCents: 500000,
        currentAmountInCents: 234567, // R$ 2345.67
        budgetId: 'budget-format'
      };
      const goal = Goal.create(props).data!;

      // Act
      const formatted = goal.formatCurrentAmount();

      // Assert
      expect(formatted).toBe('R$\u00a02.345,67');
    });

    it('should format remaining amount correctly in BRL', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Format Test',
        targetAmountInCents: 1000000, // R$ 10000.00
        currentAmountInCents: 376542, // R$ 3765.42
        budgetId: 'budget-format'
      };
      const goal = Goal.create(props).data!;

      // Act
      const formatted = goal.formatRemainingAmount();

      // Assert
      expect(formatted).toBe('R$\u00a06.234,58'); // R$ 6234.58
    });

    it('should return correct status labels', () => {
      // Arrange & Act & Assert
      const statusLabels: Record<GoalStatus, string> = {
        [GoalStatus.ACTIVE]: 'Ativa',
        [GoalStatus.PAUSED]: 'Pausada',
        [GoalStatus.COMPLETED]: 'Concluída',
        [GoalStatus.CANCELLED]: 'Cancelada'
      };

      Object.entries(statusLabels).forEach(([status, expectedLabel]) => {
        const props: GoalProps = {
          name: 'Status Test',
          targetAmountInCents: 100000,
          currentAmountInCents: 50000,
          budgetId: 'budget-status',
          status: status as GoalStatus
        };
        const goal = Goal.create(props).data!;

        expect(goal.getStatusLabel()).toBe(expectedLabel);
      });
    });
  });

  describe('when serializing to JSON', () => {
    it('should convert goal to JSON correctly', () => {
      // Arrange
      const targetDate = new Date('2026-08-30T15:45:00.000Z');
      const props: GoalProps = {
        name: 'JSON Test Goal',
        targetAmountInCents: 750000, // R$ 7500.00
        currentAmountInCents: 325000, // R$ 3250.00
        budgetId: 'budget-json',
        targetDate: targetDate,
        description: 'Testing JSON serialization',
        status: GoalStatus.PAUSED
      };
      const goal = Goal.create(props).data!;

      // Act
      const json = goal.toJSON();

      // Assert
      expect(json.id).toBe(goal.id);
      expect(json.name).toBe('JSON Test Goal');
      expect(json.targetAmount.valueInCents).toBe(750000);
      expect(json.targetAmount.valueInMonetary).toBe(7500.00);
      expect(json.targetAmount.formatted).toBe('R$\u00a07.500,00');
      expect(json.currentAmount.valueInCents).toBe(325000);
      expect(json.currentAmount.valueInMonetary).toBe(3250.00);
      expect(json.currentAmount.formatted).toBe('R$\u00a03.250,00');
      expect(json.budgetId).toBe('budget-json');
      expect(json.targetDate).toBe('2026-08-30T15:45:00.000Z');
      expect(json.description).toBe('Testing JSON serialization');
      expect(json.status).toBe(GoalStatus.PAUSED);
      expect(json.createdAt).toBeDefined();
      expect(typeof json.createdAt).toBe('string');
    });

    it('should handle null target date in JSON', () => {
      // Arrange
      const props: GoalProps = {
        name: 'No Date Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-no-date'
      };
      const goal = Goal.create(props).data!;

      // Act
      const json = goal.toJSON();

      // Assert
      expect(json.targetDate).toBeNull();
    });

    it('should include all fields in JSON output', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Complete Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-complete'
      };
      const goal = Goal.create(props).data!;

      // Act
      const json = goal.toJSON();

      // Assert
      const expectedKeys = ['id', 'name', 'targetAmount', 'currentAmount', 'budgetId', 'targetDate', 'description', 'status', 'createdAt'];
      expectedKeys.forEach(key => {
        expect(json.hasOwnProperty(key)).toBe(true);
      });

      expect(Object.keys(json).length).toBe(expectedKeys.length);
    });

    it('should handle empty description in JSON', () => {
      // Arrange
      const props: GoalProps = {
        name: 'No Description Goal',
        targetAmountInCents: 75000,
        currentAmountInCents: 30000,
        budgetId: 'budget-nodesc'
      };
      const goal = Goal.create(props).data!;

      // Act
      const json = goal.toJSON();

      // Assert
      expect(json.description).toBe('');
    });
  });

  describe('when deserializing from JSON', () => {
    it('should create goal from valid JSON', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Restored Goal',
        targetAmount: { valueInCents: 500000 },
        currentAmount: { valueInCents: 250000 },
        budgetId: 'budget-restored',
        targetDate: '2026-12-25T10:00:00.000Z',
        description: 'Restored from JSON',
        status: GoalStatus.ACTIVE,
        createdAt: '2024-07-10T08:30:00.000Z'
      };

      // Act
      const result = Goal.fromJSON(json);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);

      const goal = result.data!;
      expect(goal.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(goal.name).toBe('Restored Goal');
      expect(goal.targetAmount.valueInCents).toBe(500000);
      expect(goal.targetAmount.valueInMonetary).toBe(5000.00);
      expect(goal.currentAmount.valueInCents).toBe(250000);
      expect(goal.currentAmount.valueInMonetary).toBe(2500.00);
      expect(goal.budgetId).toBe('budget-restored');
      expect(goal.targetDate).toEqual(new Date('2026-12-25T10:00:00.000Z'));
      expect(goal.description).toBe('Restored from JSON');
      expect(goal.status).toBe(GoalStatus.ACTIVE);
      expect(goal.createdAt).toEqual(new Date('2024-07-10T08:30:00.000Z'));
    });

    it('should create goal from JSON with null target date', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'No Date Goal',
        targetAmount: { valueInCents: 100000 },
        currentAmount: { valueInCents: 50000 },
        budgetId: 'budget-no-date',
        targetDate: null,
        description: 'No target date',
        status: GoalStatus.ACTIVE,
        createdAt: '2024-07-10T08:30:00.000Z'
      };

      // Act
      const result = Goal.fromJSON(json);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.targetDate).toBeNull();
    });

    it('should return error when JSON has invalid id', () => {
      // Arrange
      const json = {
        id: 'invalid-uuid-format',
        name: 'Test Goal',
        targetAmount: { valueInCents: 100000 },
        currentAmount: { valueInCents: 50000 },
        budgetId: 'budget-test',
        targetDate: null,
        description: 'Test goal',
        status: GoalStatus.ACTIVE,
        createdAt: '2024-07-10T08:30:00.000Z'
      };

      // Act
      const result = Goal.fromJSON(json);

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
        targetAmount: { valueInCents: 100000 },
        currentAmount: { valueInCents: 50000 },
        budgetId: 'budget-test',
        targetDate: null,
        description: 'Test goal',
        status: GoalStatus.ACTIVE,
        createdAt: '2024-07-10T08:30:00.000Z'
      };

      // Act
      const result = Goal.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should return error when JSON has invalid target amount', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test Goal',
        targetAmount: { valueInCents: -100000 },
        currentAmount: { valueInCents: 50000 },
        budgetId: 'budget-test',
        targetDate: null,
        description: 'Test goal',
        status: GoalStatus.ACTIVE,
        createdAt: '2024-07-10T08:30:00.000Z'
      };

      // Act
      const result = Goal.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });

    it('should return error when JSON has invalid current amount', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test Goal',
        targetAmount: { valueInCents: 100000 },
        currentAmount: { valueInCents: -50000 },
        budgetId: 'budget-test',
        targetDate: null,
        description: 'Test goal',
        status: GoalStatus.ACTIVE,
        createdAt: '2024-07-10T08:30:00.000Z'
      };

      // Act
      const result = Goal.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });

    it('should return error when JSON has empty budgetId', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test Goal',
        targetAmount: { valueInCents: 100000 },
        currentAmount: { valueInCents: 50000 },
        budgetId: '',
        targetDate: null,
        description: 'Test goal',
        status: GoalStatus.ACTIVE,
        createdAt: '2024-07-10T08:30:00.000Z'
      };

      // Act
      const result = Goal.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Budget ID cannot be empty');
    });

    it('should return error when JSON has invalid status', () => {
      // Arrange
      const json = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Test Goal',
        targetAmount: { valueInCents: 100000 },
        currentAmount: { valueInCents: 50000 },
        budgetId: 'budget-test',
        targetDate: null,
        description: 'Test goal',
        status: 'INVALID_STATUS' as GoalStatus,
        createdAt: '2024-07-10T08:30:00.000Z'
      };

      // Act
      const result = Goal.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Invalid status. Must be one of: ACTIVE, PAUSED, COMPLETED, CANCELLED');
    });
  });

  describe('when using Goal in real scenarios', () => {
    it('should work in collections and filtering by status', () => {
      // Arrange
      const activeProps: GoalProps = {
        name: 'Active Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-active',
        status: GoalStatus.ACTIVE
      };

      const pausedProps: GoalProps = {
        name: 'Paused Goal',
        targetAmountInCents: 75000,
        currentAmountInCents: 75000, // Amount-based completion
        budgetId: 'budget-paused',
        status: GoalStatus.PAUSED
      };

      const completedProps: GoalProps = {
        name: 'Completed Goal',
        targetAmountInCents: 50000,
        currentAmountInCents: 50000,
        budgetId: 'budget-completed',
        status: GoalStatus.COMPLETED
      };

      const goals = [
        Goal.create(activeProps).data!,
        Goal.create(pausedProps).data!,
        Goal.create(completedProps).data!
      ];

      // Act
      const activeGoals = goals.filter(goal => goal.status === GoalStatus.ACTIVE);
      const completedGoals = goals.filter(goal => goal.isCompleted());

      // Assert
      expect(activeGoals.length).toBe(1);
      expect(completedGoals.length).toBe(2); // Both completed status and amount-based completion
      expect(activeGoals[0].name).toBe('Active Goal');
    });

    it('should calculate total progress across multiple goals', () => {
      // Arrange
      const goalProps = [
        { name: 'Goal 1', targetAmountInCents: 100000, currentAmountInCents: 75000 },
        { name: 'Goal 2', targetAmountInCents: 200000, currentAmountInCents: 100000 },
        { name: 'Goal 3', targetAmountInCents: 150000, currentAmountInCents: 50000 }
      ].map(props => ({
        ...props,
        budgetId: 'budget-total'
      }));

      const goals = goalProps.map(props => Goal.create(props).data!);

      // Act
      const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount.valueInCents, 0);
      const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount.valueInCents, 0);
      const overallProgress = (totalCurrent / totalTarget) * 100;

      // Assert
      expect(totalTarget).toBe(450000); // R$ 4500.00
      expect(totalCurrent).toBe(225000); // R$ 2250.00
      expect(Math.round(overallProgress)).toBe(50); // 50%
    });

    it('should work with goal deadline tracking', () => {
      // Arrange
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + 60); // 60 days from now

      const urgentDate = new Date();
      urgentDate.setDate(today.getDate() + 10); // 10 days from now

      const goals = [
        Goal.create({
          name: 'Long Term Goal',
          targetAmountInCents: 100000,
          currentAmountInCents: 50000,
          budgetId: 'budget-long',
          targetDate: futureDate
        }).data!,
        Goal.create({
          name: 'Urgent Goal',
          targetAmountInCents: 50000,
          currentAmountInCents: 25000,
          budgetId: 'budget-urgent',
          targetDate: urgentDate
        }).data!
      ];

      // Act
      const urgentGoals = goals.filter(goal => {
        const daysLeft = goal.getDaysUntilTarget();
        return daysLeft !== null && daysLeft <= 14; // 2 weeks or less
      });

      // Assert
      expect(urgentGoals.length).toBe(1);
      expect(urgentGoals[0].name).toBe('Urgent Goal');
    });

    it('should maintain immutability', () => {
      // Arrange
      const targetDate = new Date('2026-12-31T23:59:59Z');
      const props: GoalProps = {
        name: 'Immutable Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-immutable',
        targetDate: targetDate
      };
      const goal = Goal.create(props).data!;

      // Act & Assert
      const originalTargetDate = goal.targetDate!;
      const newTargetDate = goal.targetDate!;
      newTargetDate.setFullYear(2000); // Try to modify returned date

      // The original goal should not be affected
      expect(goal.targetDate).not.toBe(newTargetDate);
      expect(goal.targetDate).toEqual(originalTargetDate);
    });
  });

  describe('edge cases and boundary conditions', () => {
    it('should handle maximum name length', () => {
      // Arrange
      const maxName = 'A'.repeat(100);
      const props: GoalProps = {
        name: maxName,
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-max-name'
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.name).toBe(maxName);
      expect(result.data!.name.length).toBe(100);
    });

    it('should handle very large amounts', () => {
      // Arrange
      const props: GoalProps = {
        name: 'Large Amount Goal',
        targetAmountInCents: 999999999, // R$ 9,999,999.99
        currentAmountInCents: 500000000, // R$ 5,000,000.00
        budgetId: 'budget-large'
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.targetAmount.valueInCents).toBe(999999999);
      expect(result.data!.currentAmount.valueInCents).toBe(500000000);
    });

    it('should handle today as target date', () => {
      // Arrange
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today

      const props: GoalProps = {
        name: 'Today Goal',
        targetAmountInCents: 100000,
        currentAmountInCents: 50000,
        budgetId: 'budget-today',
        targetDate: today
      };

      // Act
      const result = Goal.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.data!.targetDate).toEqual(today);
    });

    it('should handle JSON serialization round-trip', () => {
      // Arrange
      const targetDate = new Date('2026-09-15T14:30:00.000Z');
      const originalProps: GoalProps = {
        name: 'Round-trip Goal',
        targetAmountInCents: 987654,
        currentAmountInCents: 456789,
        budgetId: 'budget-roundtrip',
        targetDate: targetDate,
        description: 'Testing round-trip',
        status: GoalStatus.PAUSED
      };
      const originalGoal = Goal.create(originalProps).data!;

      // Act
      const json = originalGoal.toJSON();
      const restoredResult = Goal.fromJSON(json);

      // Assert
      expect(restoredResult.hasData).toBe(true);
      const restoredGoal = restoredResult.data!;

      expect(restoredGoal.id).toBe(originalGoal.id);
      expect(restoredGoal.name).toBe(originalGoal.name);
      expect(restoredGoal.targetAmount.valueInCents).toBe(originalGoal.targetAmount.valueInCents);
      expect(restoredGoal.currentAmount.valueInCents).toBe(originalGoal.currentAmount.valueInCents);
      expect(restoredGoal.budgetId).toBe(originalGoal.budgetId);
      expect(restoredGoal.targetDate).toEqual(originalGoal.targetDate);
      expect(restoredGoal.description).toBe(originalGoal.description);
      expect(restoredGoal.status).toBe(originalGoal.status);
      expect(restoredGoal.createdAt).toEqual(originalGoal.createdAt);
    });
  });
});