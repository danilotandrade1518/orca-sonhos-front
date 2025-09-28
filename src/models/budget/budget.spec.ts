import { Budget, BudgetProps } from './budget';
import { Money } from '../shared/value-objects/money';
import { Uuid } from '../shared/value-objects/uuid';

describe('Budget', () => {
  describe('when creating Budget with valid props', () => {
    it('should create Budget with all required properties', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Family Budget 2024',
        limitInCents: 500000, // R$ 5,000.00
        ownerId: 'owner-123',
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);
      const budget = result.data!;
      expect(budget.name).toBe('Family Budget 2024');
      expect(budget.limit.valueInCents).toBe(500000);
      expect(budget.ownerId).toBe('owner-123');
      expect(budget.participantIds).toEqual([]);
      expect(budget.description).toBe('');
      expect(budget.isActive).toBe(true);
      expect(budget.id).toBeDefined();
      expect(budget.createdAt).toBeInstanceOf(Date);
    });

    it('should create Budget with optional properties', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Business Budget',
        limitInCents: 1000000, // R$ 10,000.00
        ownerId: 'owner-456',
        participantIds: ['user-1', 'user-2', 'user-3'],
        description: 'Monthly business expenses budget',
        isActive: false,
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const budget = result.data!;
      expect(budget.name).toBe('Business Budget');
      expect(budget.limit.valueInCents).toBe(1000000);
      expect(budget.ownerId).toBe('owner-456');
      expect(budget.participantIds).toEqual(['user-1', 'user-2', 'user-3']);
      expect(budget.description).toBe('Monthly business expenses budget');
      expect(budget.isActive).toBe(false);
    });

    it('should create Budget with empty participant list', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Personal Budget',
        limitInCents: 300000, // R$ 3,000.00
        ownerId: 'owner-personal',
        participantIds: [],
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const budget = result.data!;
      expect(budget.participantIds).toEqual([]);
      expect(budget.getParticipantCount()).toBe(1); // Only owner
    });

    it('should create Budget with single participant', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Couple Budget',
        limitInCents: 800000, // R$ 8,000.00
        ownerId: 'owner-couple',
        participantIds: ['spouse-123'],
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const budget = result.data!;
      expect(budget.participantIds).toEqual(['spouse-123']);
      expect(budget.getParticipantCount()).toBe(2); // Owner + 1 participant
    });

    it('should create Budget with zero limit', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Zero Budget',
        limitInCents: 0,
        ownerId: 'owner-zero',
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const budget = result.data!;
      expect(budget.limit.valueInCents).toBe(0);
      expect(budget.limit.isZero()).toBe(true);
    });

    it('should create Budget with large limit', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Enterprise Budget',
        limitInCents: 10000000, // R$ 100,000.00
        ownerId: 'owner-enterprise',
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const budget = result.data!;
      expect(budget.limit.valueInCents).toBe(10000000);
    });
  });

  describe('when creating Budget with invalid props', () => {
    it('should return error when name is empty string', () => {
      // Arrange
      const props: BudgetProps = {
        name: '',
        limitInCents: 500000,
        ownerId: 'owner-123',
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should return error when name is only whitespace', () => {
      // Arrange
      const props: BudgetProps = {
        name: '   ',
        limitInCents: 500000,
        ownerId: 'owner-123',
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should return error when name exceeds 100 characters', () => {
      // Arrange
      const longName = 'a'.repeat(101);
      const props: BudgetProps = {
        name: longName,
        limitInCents: 500000,
        ownerId: 'owner-123',
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Name cannot exceed 100 characters');
    });

    it('should return error when name is not a string', () => {
      // Arrange
      const props = {
        name: 123 as any,
        limitInCents: 500000,
        ownerId: 'owner-123',
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Name must be a string');
    });

    it('should return error when ownerId is empty string', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Valid Budget',
        limitInCents: 500000,
        ownerId: '',
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Owner ID cannot be empty');
    });

    it('should return error when ownerId is only whitespace', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Valid Budget',
        limitInCents: 500000,
        ownerId: '   ',
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Owner ID cannot be empty');
    });

    it('should return error when ownerId is not a string', () => {
      // Arrange
      const props = {
        name: 'Valid Budget',
        limitInCents: 500000,
        ownerId: 123 as any,
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Owner ID must be a string');
    });

    it('should return error when limit is invalid', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Valid Budget',
        limitInCents: NaN,
        ownerId: 'owner-123',
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.join(', ')).toContain('Invalid limit');
    });

    it('should return error when trying to create Budget with negative limit', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Invalid Budget',
        limitInCents: -100000,
        ownerId: 'owner-123',
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.join(', ')).toContain('Value cannot be negative');
    });

    it('should return error when participantIds is not an array', () => {
      // Arrange
      const props = {
        name: 'Valid Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
        participantIds: 'not-an-array' as any,
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Participant IDs must be an array');
    });

    it('should return error when participantIds contains empty string', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Valid Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
        participantIds: ['user-1', '', 'user-3'],
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('All participant IDs must be non-empty strings');
    });

    it('should return error when participantIds contains non-string value', () => {
      // Arrange
      const props = {
        name: 'Valid Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
        participantIds: ['user-1', 123, 'user-3'] as any,
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('All participant IDs must be non-empty strings');
    });

    it('should return error when participantIds contains whitespace-only string', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Valid Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
        participantIds: ['user-1', '   ', 'user-3'],
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('All participant IDs must be non-empty strings');
    });
  });

  describe('when using Budget getters', () => {
    it('should return correct id as string', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
      };
      const budget = Budget.create(props).data!;

      // Act
      const id = budget.id;

      // Assert
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should return correct name', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Monthly Household Budget',
        limitInCents: 750000,
        ownerId: 'owner-456',
      };
      const budget = Budget.create(props).data!;

      // Act
      const name = budget.name;

      // Assert
      expect(name).toBe('Monthly Household Budget');
    });

    it('should return correct limit as Money object', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 123456,
        ownerId: 'owner-123',
      };
      const budget = Budget.create(props).data!;

      // Act
      const limit = budget.limit;

      // Assert
      expect(limit).toBeInstanceOf(Money);
      expect(limit.valueInCents).toBe(123456);
    });

    it('should return correct ownerId', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 500000,
        ownerId: 'my-owner-uuid-123',
      };
      const budget = Budget.create(props).data!;

      // Act
      const ownerId = budget.ownerId;

      // Assert
      expect(ownerId).toBe('my-owner-uuid-123');
    });

    it('should return correct participantIds as array copy', () => {
      // Arrange
      const originalParticipants = ['user-1', 'user-2', 'user-3'];
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
        participantIds: originalParticipants,
      };
      const budget = Budget.create(props).data!;

      // Act
      const participantIds = budget.participantIds;

      // Assert
      expect(participantIds).toEqual(originalParticipants);
      expect(participantIds).not.toBe(originalParticipants); // Should be a copy

      // Modifying returned array should not affect internal state
      participantIds.push('hacker-user');
      expect(budget.participantIds).toEqual(originalParticipants);
    });

    it('should return empty array when no participants provided', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
      };
      const budget = Budget.create(props).data!;

      // Act
      const participantIds = budget.participantIds;

      // Assert
      expect(participantIds).toEqual([]);
      expect(Array.isArray(participantIds)).toBe(true);
    });

    it('should return correct description', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
        description: 'A comprehensive family budget for 2024',
      };
      const budget = Budget.create(props).data!;

      // Act
      const description = budget.description;

      // Assert
      expect(description).toBe('A comprehensive family budget for 2024');
    });

    it('should return empty string when description is not provided', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
      };
      const budget = Budget.create(props).data!;

      // Act
      const description = budget.description;

      // Assert
      expect(description).toBe('');
    });

    it('should return correct isActive status', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
        isActive: false,
      };
      const budget = Budget.create(props).data!;

      // Act
      const isActive = budget.isActive;

      // Assert
      expect(isActive).toBe(false);
    });

    it('should return true for isActive when not specified', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
      };
      const budget = Budget.create(props).data!;

      // Act
      const isActive = budget.isActive;

      // Assert
      expect(isActive).toBe(true);
    });

    it('should return correct createdAt as new Date instance', () => {
      // Arrange
      const beforeCreation = new Date();
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
      };
      const budget = Budget.create(props).data!;
      const afterCreation = new Date();

      // Act
      const createdAt = budget.createdAt;

      // Assert
      expect(createdAt).toBeInstanceOf(Date);
      expect(createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());

      // Should return a new instance each time
      const createdAt2 = budget.createdAt;
      expect(createdAt).not.toBe(createdAt2);
      expect(createdAt.getTime()).toBe(createdAt2.getTime());
    });
  });

  describe('when checking participant relationships', () => {
    it('should return true for hasParticipant when user is owner', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
        participantIds: ['user-1', 'user-2'],
      };
      const budget = Budget.create(props).data!;

      // Act
      const hasParticipant = budget.hasParticipant('owner-123');

      // Assert
      expect(hasParticipant).toBe(true);
    });

    it('should return true for hasParticipant when user is in participant list', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
        participantIds: ['user-1', 'user-2', 'user-3'],
      };
      const budget = Budget.create(props).data!;

      // Act
      const hasParticipant = budget.hasParticipant('user-2');

      // Assert
      expect(hasParticipant).toBe(true);
    });

    it('should return false for hasParticipant when user is not involved', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
        participantIds: ['user-1', 'user-2'],
      };
      const budget = Budget.create(props).data!;

      // Act
      const hasParticipant = budget.hasParticipant('outsider-user');

      // Assert
      expect(hasParticipant).toBe(false);
    });

    it('should return true for isOwner when user is the owner', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
        participantIds: ['user-1', 'user-2'],
      };
      const budget = Budget.create(props).data!;

      // Act
      const isOwner = budget.isOwner('owner-123');

      // Assert
      expect(isOwner).toBe(true);
    });

    it('should return false for isOwner when user is not the owner', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
        participantIds: ['user-1', 'user-2'],
      };
      const budget = Budget.create(props).data!;

      // Act
      const isOwner = budget.isOwner('user-1');

      // Assert
      expect(isOwner).toBe(false);
    });

    it('should return false for isOwner when user is not involved', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
        participantIds: ['user-1', 'user-2'],
      };
      const budget = Budget.create(props).data!;

      // Act
      const isOwner = budget.isOwner('outsider-user');

      // Assert
      expect(isOwner).toBe(false);
    });
  });

  describe('when getting participant count', () => {
    it('should return 1 when only owner (no participants)', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Solo Budget',
        limitInCents: 500000,
        ownerId: 'owner-only',
      };
      const budget = Budget.create(props).data!;

      // Act
      const count = budget.getParticipantCount();

      // Assert
      expect(count).toBe(1);
    });

    it('should return 2 when owner plus 1 participant', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Couple Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
        participantIds: ['spouse-456'],
      };
      const budget = Budget.create(props).data!;

      // Act
      const count = budget.getParticipantCount();

      // Assert
      expect(count).toBe(2);
    });

    it('should return 5 when owner plus 4 participants', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Family Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
        participantIds: ['child-1', 'child-2', 'child-3', 'grandparent-1'],
      };
      const budget = Budget.create(props).data!;

      // Act
      const count = budget.getParticipantCount();

      // Assert
      expect(count).toBe(5);
    });

    it('should return 1 when empty participant array provided', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Single Budget',
        limitInCents: 500000,
        ownerId: 'owner-123',
        participantIds: [],
      };
      const budget = Budget.create(props).data!;

      // Act
      const count = budget.getParticipantCount();

      // Assert
      expect(count).toBe(1);
    });
  });

  describe('when formatting limit', () => {
    it('should format limit correctly', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 123456, // R$ 1,234.56
        ownerId: 'owner-123',
      };
      const budget = Budget.create(props).data!;

      // Act
      const formatted = budget.formatLimit();

      // Assert
      expect(formatted).toBe('R$\u00a01.234,56');
    });

    it('should format zero limit correctly', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Zero Budget',
        limitInCents: 0,
        ownerId: 'owner-123',
      };
      const budget = Budget.create(props).data!;

      // Act
      const formatted = budget.formatLimit();

      // Assert
      expect(formatted).toBe('R$\u00a00,00');
    });

    it('should format large limit correctly', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Large Budget',
        limitInCents: 999999999, // R$ 9,999,999.99
        ownerId: 'owner-123',
      };
      const budget = Budget.create(props).data!;

      // Act
      const formatted = budget.formatLimit();

      // Assert
      expect(formatted).toBe('R$\u00a09.999.999,99');
    });
  });

  describe('when serializing to JSON', () => {
    it('should serialize Budget to correct JSON structure', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 123456,
        ownerId: 'owner-123',
        participantIds: ['user-1', 'user-2'],
        description: 'Test description',
        isActive: false,
      };
      const budget = Budget.create(props).data!;

      // Act
      const json = budget.toJSON();

      // Assert
      expect(json).toEqual({
        id: budget.id,
        name: 'Test Budget',
        limit: {
          valueInCents: 123456,
          valueInMonetary: 1234.56,
          formatted: 'R$\u00a01.234,56',
        },
        ownerId: 'owner-123',
        participantIds: ['user-1', 'user-2'],
        description: 'Test description',
        isActive: false,
        createdAt: budget.createdAt.toISOString(),
      });
    });

    it('should serialize Budget with default values', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Simple Budget',
        limitInCents: 50000,
        ownerId: 'owner-simple',
      };
      const budget = Budget.create(props).data!;

      // Act
      const json = budget.toJSON();

      // Assert
      expect(json.description).toBe('');
      expect(json.isActive).toBe(true);
      expect(json.participantIds).toEqual([]);
      expect(json.name).toBe('Simple Budget');
      expect(json.limit.valueInCents).toBe(50000);
      expect(json.ownerId).toBe('owner-simple');
      expect(typeof json.createdAt).toBe('string');
      expect(typeof json.id).toBe('string');
    });

    it('should not allow modification of participantIds in JSON', () => {
      // Arrange
      const originalParticipants = ['user-1', 'user-2'];
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 50000,
        ownerId: 'owner-test',
        participantIds: originalParticipants,
      };
      const budget = Budget.create(props).data!;

      // Act
      const json = budget.toJSON();
      json.participantIds.push('hacker-user');

      // Assert
      expect(budget.participantIds).toEqual(originalParticipants);
      expect(budget.toJSON().participantIds).toEqual(originalParticipants);
    });
  });

  describe('when creating Budget from JSON', () => {
    it('should create Budget from valid JSON', () => {
      // Arrange
      const uuid = Uuid.generate();
      const createdAt = new Date('2023-01-15T10:30:00.000Z');
      const json = {
        id: uuid.value,
        name: 'JSON Budget',
        limit: { valueInCents: 987654 },
        ownerId: 'owner-json',
        participantIds: ['user-a', 'user-b'],
        description: 'Created from JSON',
        isActive: true,
        createdAt: createdAt.toISOString(),
      };

      // Act
      const result = Budget.fromJSON(json);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);
      const budget = result.data!;
      expect(budget.id).toBe(uuid.value);
      expect(budget.name).toBe('JSON Budget');
      expect(budget.limit.valueInCents).toBe(987654);
      expect(budget.ownerId).toBe('owner-json');
      expect(budget.participantIds).toEqual(['user-a', 'user-b']);
      expect(budget.description).toBe('Created from JSON');
      expect(budget.isActive).toBe(true);
      expect(budget.createdAt.getTime()).toBe(createdAt.getTime());
    });

    it('should handle round-trip JSON serialization', () => {
      // Arrange
      const originalProps: BudgetProps = {
        name: 'Round Trip Budget',
        limitInCents: 555555,
        ownerId: 'owner-roundtrip',
        participantIds: ['user-x', 'user-y', 'user-z'],
        description: 'Round trip test',
        isActive: false,
      };
      const originalBudget = Budget.create(originalProps).data!;
      const json = originalBudget.toJSON();

      // Act
      const result = Budget.fromJSON(json);

      // Assert
      expect(result.hasData).toBe(true);
      const reconstructedBudget = result.data!;
      expect(reconstructedBudget.id).toBe(originalBudget.id);
      expect(reconstructedBudget.name).toBe(originalBudget.name);
      expect(reconstructedBudget.limit.valueInCents).toBe(originalBudget.limit.valueInCents);
      expect(reconstructedBudget.ownerId).toBe(originalBudget.ownerId);
      expect(reconstructedBudget.participantIds).toEqual(originalBudget.participantIds);
      expect(reconstructedBudget.description).toBe(originalBudget.description);
      expect(reconstructedBudget.isActive).toBe(originalBudget.isActive);
      expect(reconstructedBudget.createdAt.getTime()).toBe(originalBudget.createdAt.getTime());
    });

    it('should return error when JSON has invalid id', () => {
      // Arrange
      const json = {
        id: 'invalid-uuid',
        name: 'Test Budget',
        limit: { valueInCents: 100000 },
        ownerId: 'owner-123',
        participantIds: [],
        description: '',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      // Act
      const result = Budget.fromJSON(json);

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
        limit: { valueInCents: 100000 },
        ownerId: 'owner-123',
        participantIds: [],
        description: '',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      // Act
      const result = Budget.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should return error when JSON has invalid limit', () => {
      // Arrange
      const uuid = Uuid.generate();
      const json = {
        id: uuid.value,
        name: 'Test Budget',
        limit: { valueInCents: NaN },
        ownerId: 'owner-123',
        participantIds: [],
        description: '',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      // Act
      const result = Budget.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.join(', ')).toContain('Invalid limit');
    });

    it('should return error when JSON has invalid ownerId', () => {
      // Arrange
      const uuid = Uuid.generate();
      const json = {
        id: uuid.value,
        name: 'Test Budget',
        limit: { valueInCents: 100000 },
        ownerId: '',
        participantIds: [],
        description: '',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      // Act
      const result = Budget.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Owner ID cannot be empty');
    });

    it('should return error when JSON has invalid participantIds', () => {
      // Arrange
      const uuid = Uuid.generate();
      const json = {
        id: uuid.value,
        name: 'Test Budget',
        limit: { valueInCents: 100000 },
        ownerId: 'owner-123',
        participantIds: ['user-1', '', 'user-3'],
        description: '',
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      // Act
      const result = Budget.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('All participant IDs must be non-empty strings');
    });
  });

  describe('edge cases and boundary conditions', () => {
    it('should handle name with exactly 100 characters', () => {
      // Arrange
      const name100chars = 'a'.repeat(100);
      const props: BudgetProps = {
        name: name100chars,
        limitInCents: 100000,
        ownerId: 'owner-boundary',
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const budget = result.data!;
      expect(budget.name).toBe(name100chars);
      expect(budget.name.length).toBe(100);
    });

    it('should handle very large limit', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Large Limit Budget',
        limitInCents: Number.MAX_SAFE_INTEGER,
        ownerId: 'owner-large',
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const budget = result.data!;
      expect(budget.limit.valueInCents).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should handle special characters in name', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Budget with special chars: àáâãäç éêë íîï óôõö úûü ñ',
        limitInCents: 100000,
        ownerId: 'owner-special',
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const budget = result.data!;
      expect(budget.name).toBe('Budget with special chars: àáâãäç éêë íîï óôõö úûü ñ');
    });

    it('should handle special characters in description', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 50000,
        ownerId: 'owner-desc',
        description: 'Description with emojis 💰💸 and symbols @#$%^&*()',
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const budget = result.data!;
      expect(budget.description).toBe('Description with emojis 💰💸 and symbols @#$%^&*()');
    });

    it('should handle large number of participants', () => {
      // Arrange
      const largeParticipantList = Array.from({ length: 100 }, (_, i) => `user-${i + 1}`);
      const props: BudgetProps = {
        name: 'Large Group Budget',
        limitInCents: 1000000,
        ownerId: 'owner-large-group',
        participantIds: largeParticipantList,
      };

      // Act
      const result = Budget.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const budget = result.data!;
      expect(budget.participantIds).toEqual(largeParticipantList);
      expect(budget.getParticipantCount()).toBe(101); // 100 participants + 1 owner
    });

    it('should generate unique IDs for different budgets', () => {
      // Arrange
      const props1: BudgetProps = {
        name: 'Budget 1',
        limitInCents: 100000,
        ownerId: 'owner-1',
      };
      const props2: BudgetProps = {
        name: 'Budget 2',
        limitInCents: 200000,
        ownerId: 'owner-2',
      };

      // Act
      const budget1 = Budget.create(props1).data!;
      const budget2 = Budget.create(props2).data!;

      // Assert
      expect(budget1.id).not.toBe(budget2.id);
      expect(budget1.id.length).toBeGreaterThan(0);
      expect(budget2.id.length).toBeGreaterThan(0);
    });

    it('should handle participant checking with exact string matching', () => {
      // Arrange
      const props: BudgetProps = {
        name: 'Test Budget',
        limitInCents: 100000,
        ownerId: 'owner-123',
        participantIds: ['user-123', 'user-456'],
      };
      const budget = Budget.create(props).data!;

      // Act & Assert
      expect(budget.hasParticipant('user-123')).toBe(true);
      expect(budget.hasParticipant('user-456')).toBe(true);
      expect(budget.hasParticipant('USER-123')).toBe(false); // Case sensitive
      expect(budget.hasParticipant('user-12')).toBe(false); // Partial match
      expect(budget.hasParticipant('user-123 ')).toBe(false); // With space
    });
  });
});
