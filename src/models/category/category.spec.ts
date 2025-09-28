import { Category, CategoryProps } from './category';
import { CategoryType } from '../shared/enums/category-type';
import { Uuid } from '../shared/value-objects/uuid';

describe('Category', () => {
  describe('when creating Category with valid props', () => {
    it('should create Category with all required properties', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Food & Dining',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);
      const category = result.data!;
      expect(category.name).toBe('Food & Dining');
      expect(category.type).toBe(CategoryType.EXPENSE);
      expect(category.budgetId).toBe('budget-123');
      expect(category.description).toBe('');
      expect(category.isActive).toBe(true);
      expect(category.color).toBe('#757575');
      expect(category.icon).toBe('category');
      expect(category.id).toBeDefined();
      expect(category.createdAt).toBeInstanceOf(Date);
    });

    it('should create Category with optional properties', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Salary Income',
        type: CategoryType.INCOME,
        budgetId: 'budget-456',
        description: 'Monthly salary and bonuses',
        isActive: false,
        color: '#4CAF50',
        icon: 'money',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const category = result.data!;
      expect(category.name).toBe('Salary Income');
      expect(category.type).toBe(CategoryType.INCOME);
      expect(category.budgetId).toBe('budget-456');
      expect(category.description).toBe('Monthly salary and bonuses');
      expect(category.isActive).toBe(false);
      expect(category.color).toBe('#4CAF50');
      expect(category.icon).toBe('money');
    });

    it('should create INCOME Category', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Freelance Work',
        type: CategoryType.INCOME,
        budgetId: 'budget-income',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const category = result.data!;
      expect(category.type).toBe(CategoryType.INCOME);
      expect(category.isIncome()).toBe(true);
      expect(category.isExpense()).toBe(false);
    });

    it('should create EXPENSE Category', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Transportation',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-expense',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const category = result.data!;
      expect(category.type).toBe(CategoryType.EXPENSE);
      expect(category.isIncome()).toBe(false);
      expect(category.isExpense()).toBe(true);
    });

    it('should create Category with short hex color', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Entertainment',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-ent',
        color: '#F44',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const category = result.data!;
      expect(category.color).toBe('#F44');
    });

    it('should create Category with long hex color', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Healthcare',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-health',
        color: '#FF5722',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const category = result.data!;
      expect(category.color).toBe('#FF5722');
    });

    it('should create Category with lowercase hex color', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Education',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-edu',
        color: '#2196f3',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const category = result.data!;
      expect(category.color).toBe('#2196f3');
    });
  });

  describe('when creating Category with invalid props', () => {
    it('should return error when name is empty string', () => {
      // Arrange
      const props: CategoryProps = {
        name: '',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.hasData).toBe(false);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should return error when name is only whitespace', () => {
      // Arrange
      const props: CategoryProps = {
        name: '   ',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should return error when name exceeds 100 characters', () => {
      // Arrange
      const longName = 'a'.repeat(101);
      const props: CategoryProps = {
        name: longName,
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Name cannot exceed 100 characters');
    });

    it('should return error when name is not a string', () => {
      // Arrange
      const props = {
        name: 123 as any,
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Name must be a string');
    });

    it('should return error when type is invalid', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Valid Category',
        type: 'INVALID_TYPE' as CategoryType,
        budgetId: 'budget-123',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.join(', ')).toContain('Invalid category type');
    });

    it('should return error when budgetId is empty string', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Valid Category',
        type: CategoryType.EXPENSE,
        budgetId: '',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Budget ID cannot be empty');
    });

    it('should return error when budgetId is only whitespace', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Valid Category',
        type: CategoryType.EXPENSE,
        budgetId: '   ',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Budget ID cannot be empty');
    });

    it('should return error when budgetId is not a string', () => {
      // Arrange
      const props = {
        name: 'Valid Category',
        type: CategoryType.EXPENSE,
        budgetId: 123 as any,
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Budget ID must be a string');
    });

    it('should return error when color is invalid hex format', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Valid Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
        color: 'invalid-color',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Color must be a valid hex color (e.g., #FF5722)');
    });

    it('should return error when color is missing hash symbol', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Valid Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
        color: 'FF5722',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Color must be a valid hex color (e.g., #FF5722)');
    });

    it('should return error when color has invalid characters', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Valid Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
        color: '#GG5722',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Color must be a valid hex color (e.g., #FF5722)');
    });

    it('should return error when color is not a string', () => {
      // Arrange
      const props = {
        name: 'Valid Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
        color: 123 as any,
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Color must be a string');
    });

    it('should return error when color has wrong length', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Valid Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
        color: '#FF572',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Color must be a valid hex color (e.g., #FF5722)');
    });
  });

  describe('when using Category getters', () => {
    it('should return correct id as string', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
      };
      const category = Category.create(props).data!;

      // Act
      const id = category.id;

      // Assert
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should return correct name', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Groceries & Food',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-456',
      };
      const category = Category.create(props).data!;

      // Act
      const name = category.name;

      // Assert
      expect(name).toBe('Groceries & Food');
    });

    it('should return correct type', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Investment Returns',
        type: CategoryType.INCOME,
        budgetId: 'budget-789',
      };
      const category = Category.create(props).data!;

      // Act
      const type = category.type;

      // Assert
      expect(type).toBe(CategoryType.INCOME);
    });

    it('should return correct budgetId', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: 'my-budget-uuid-123',
      };
      const category = Category.create(props).data!;

      // Act
      const budgetId = category.budgetId;

      // Assert
      expect(budgetId).toBe('my-budget-uuid-123');
    });

    it('should return correct description', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
        description: 'Category for miscellaneous expenses',
      };
      const category = Category.create(props).data!;

      // Act
      const description = category.description;

      // Assert
      expect(description).toBe('Category for miscellaneous expenses');
    });

    it('should return empty string when description is not provided', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
      };
      const category = Category.create(props).data!;

      // Act
      const description = category.description;

      // Assert
      expect(description).toBe('');
    });

    it('should return correct isActive status', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
        isActive: false,
      };
      const category = Category.create(props).data!;

      // Act
      const isActive = category.isActive;

      // Assert
      expect(isActive).toBe(false);
    });

    it('should return true for isActive when not specified', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
      };
      const category = Category.create(props).data!;

      // Act
      const isActive = category.isActive;

      // Assert
      expect(isActive).toBe(true);
    });

    it('should return correct color', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
        color: '#E91E63',
      };
      const category = Category.create(props).data!;

      // Act
      const color = category.color;

      // Assert
      expect(color).toBe('#E91E63');
    });

    it('should return default color when not specified', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
      };
      const category = Category.create(props).data!;

      // Act
      const color = category.color;

      // Assert
      expect(color).toBe('#757575');
    });

    it('should return correct icon', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
        icon: 'shopping_cart',
      };
      const category = Category.create(props).data!;

      // Act
      const icon = category.icon;

      // Assert
      expect(icon).toBe('shopping_cart');
    });

    it('should return default icon when not specified', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
      };
      const category = Category.create(props).data!;

      // Act
      const icon = category.icon;

      // Assert
      expect(icon).toBe('category');
    });

    it('should return correct createdAt as new Date instance', () => {
      // Arrange
      const beforeCreation = new Date();
      const props: CategoryProps = {
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
      };
      const category = Category.create(props).data!;
      const afterCreation = new Date();

      // Act
      const createdAt = category.createdAt;

      // Assert
      expect(createdAt).toBeInstanceOf(Date);
      expect(createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(createdAt.getTime()).toBeLessThanOrEqual(afterCreation.getTime());

      // Should return a new instance each time
      const createdAt2 = category.createdAt;
      expect(createdAt).not.toBe(createdAt2);
      expect(createdAt.getTime()).toBe(createdAt2.getTime());
    });
  });

  describe('when checking category type', () => {
    it('should return true for isIncome when type is INCOME', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Salary',
        type: CategoryType.INCOME,
        budgetId: 'budget-123',
      };
      const category = Category.create(props).data!;

      // Act
      const isIncome = category.isIncome();

      // Assert
      expect(isIncome).toBe(true);
    });

    it('should return false for isIncome when type is EXPENSE', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Rent',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
      };
      const category = Category.create(props).data!;

      // Act
      const isIncome = category.isIncome();

      // Assert
      expect(isIncome).toBe(false);
    });

    it('should return true for isExpense when type is EXPENSE', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Utilities',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
      };
      const category = Category.create(props).data!;

      // Act
      const isExpense = category.isExpense();

      // Assert
      expect(isExpense).toBe(true);
    });

    it('should return false for isExpense when type is INCOME', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Bonus',
        type: CategoryType.INCOME,
        budgetId: 'budget-123',
      };
      const category = Category.create(props).data!;

      // Act
      const isExpense = category.isExpense();

      // Assert
      expect(isExpense).toBe(false);
    });
  });

  describe('when getting type labels', () => {
    it('should return correct label for INCOME category', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Freelance',
        type: CategoryType.INCOME,
        budgetId: 'budget-123',
      };
      const category = Category.create(props).data!;

      // Act
      const label = category.getTypeLabel();

      // Assert
      expect(label).toBe('Receita');
    });

    it('should return correct label for EXPENSE category', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Food',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-456',
      };
      const category = Category.create(props).data!;

      // Act
      const label = category.getTypeLabel();

      // Assert
      expect(label).toBe('Despesa');
    });
  });

  describe('when getting status labels', () => {
    it('should return "Ativa" when category is active', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Active Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
        isActive: true,
      };
      const category = Category.create(props).data!;

      // Act
      const statusLabel = category.getStatusLabel();

      // Assert
      expect(statusLabel).toBe('Ativa');
    });

    it('should return "Inativa" when category is inactive', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Inactive Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
        isActive: false,
      };
      const category = Category.create(props).data!;

      // Act
      const statusLabel = category.getStatusLabel();

      // Assert
      expect(statusLabel).toBe('Inativa');
    });

    it('should return "Ativa" when isActive is not specified (default)', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Default Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
      };
      const category = Category.create(props).data!;

      // Act
      const statusLabel = category.getStatusLabel();

      // Assert
      expect(statusLabel).toBe('Ativa');
    });
  });

  describe('when serializing to JSON', () => {
    it('should serialize Category to correct JSON structure', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
        description: 'Test description',
        isActive: false,
        color: '#FF5722',
        icon: 'test_icon',
      };
      const category = Category.create(props).data!;

      // Act
      const json = category.toJSON();

      // Assert
      expect(json).toEqual({
        id: category.id,
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
        description: 'Test description',
        isActive: false,
        color: '#FF5722',
        icon: 'test_icon',
        createdAt: category.createdAt.toISOString(),
      });
    });

    it('should serialize Category with default values', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Simple Category',
        type: CategoryType.INCOME,
        budgetId: 'budget-simple',
      };
      const category = Category.create(props).data!;

      // Act
      const json = category.toJSON();

      // Assert
      expect(json.description).toBe('');
      expect(json.isActive).toBe(true);
      expect(json.color).toBe('#757575');
      expect(json.icon).toBe('category');
      expect(json.name).toBe('Simple Category');
      expect(json.type).toBe(CategoryType.INCOME);
      expect(json.budgetId).toBe('budget-simple');
      expect(typeof json.createdAt).toBe('string');
      expect(typeof json.id).toBe('string');
    });
  });

  describe('when creating Category from JSON', () => {
    it('should create Category from valid JSON', () => {
      // Arrange
      const uuid = Uuid.generate();
      const createdAt = new Date('2023-01-15T10:30:00.000Z');
      const json = {
        id: uuid.value,
        name: 'JSON Category',
        type: CategoryType.INCOME,
        budgetId: 'budget-json',
        description: 'Created from JSON',
        isActive: true,
        color: '#4CAF50',
        icon: 'money',
        createdAt: createdAt.toISOString(),
      };

      // Act
      const result = Category.fromJSON(json);

      // Assert
      expect(result.hasData).toBe(true);
      expect(result.hasError).toBe(false);
      const category = result.data!;
      expect(category.id).toBe(uuid.value);
      expect(category.name).toBe('JSON Category');
      expect(category.type).toBe(CategoryType.INCOME);
      expect(category.budgetId).toBe('budget-json');
      expect(category.description).toBe('Created from JSON');
      expect(category.isActive).toBe(true);
      expect(category.color).toBe('#4CAF50');
      expect(category.icon).toBe('money');
      expect(category.createdAt.getTime()).toBe(createdAt.getTime());
    });

    it('should handle round-trip JSON serialization', () => {
      // Arrange
      const originalProps: CategoryProps = {
        name: 'Round Trip Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-roundtrip',
        description: 'Round trip test',
        isActive: false,
        color: '#9C27B0',
        icon: 'test',
      };
      const originalCategory = Category.create(originalProps).data!;
      const json = originalCategory.toJSON();

      // Act
      const result = Category.fromJSON(json);

      // Assert
      expect(result.hasData).toBe(true);
      const reconstructedCategory = result.data!;
      expect(reconstructedCategory.id).toBe(originalCategory.id);
      expect(reconstructedCategory.name).toBe(originalCategory.name);
      expect(reconstructedCategory.type).toBe(originalCategory.type);
      expect(reconstructedCategory.budgetId).toBe(originalCategory.budgetId);
      expect(reconstructedCategory.description).toBe(originalCategory.description);
      expect(reconstructedCategory.isActive).toBe(originalCategory.isActive);
      expect(reconstructedCategory.color).toBe(originalCategory.color);
      expect(reconstructedCategory.icon).toBe(originalCategory.icon);
      expect(reconstructedCategory.createdAt.getTime()).toBe(originalCategory.createdAt.getTime());
    });

    it('should return error when JSON has invalid id', () => {
      // Arrange
      const json = {
        id: 'invalid-uuid',
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
        description: '',
        isActive: true,
        color: '#757575',
        icon: 'category',
        createdAt: new Date().toISOString(),
      };

      // Act
      const result = Category.fromJSON(json);

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
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
        description: '',
        isActive: true,
        color: '#757575',
        icon: 'category',
        createdAt: new Date().toISOString(),
      };

      // Act
      const result = Category.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Name cannot be empty');
    });

    it('should return error when JSON has invalid type', () => {
      // Arrange
      const uuid = Uuid.generate();
      const json = {
        id: uuid.value,
        name: 'Test Category',
        type: 'INVALID_TYPE' as CategoryType,
        budgetId: 'budget-123',
        description: '',
        isActive: true,
        color: '#757575',
        icon: 'category',
        createdAt: new Date().toISOString(),
      };

      // Act
      const result = Category.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors.join(', ')).toContain('Invalid category type');
    });

    it('should return error when JSON has invalid budgetId', () => {
      // Arrange
      const uuid = Uuid.generate();
      const json = {
        id: uuid.value,
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: '',
        description: '',
        isActive: true,
        color: '#757575',
        icon: 'category',
        createdAt: new Date().toISOString(),
      };

      // Act
      const result = Category.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Budget ID cannot be empty');
    });

    it('should return error when JSON has invalid color', () => {
      // Arrange
      const uuid = Uuid.generate();
      const json = {
        id: uuid.value,
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-123',
        description: '',
        isActive: true,
        color: 'invalid-color',
        icon: 'category',
        createdAt: new Date().toISOString(),
      };

      // Act
      const result = Category.fromJSON(json);

      // Assert
      expect(result.hasError).toBe(true);
      expect(result.errors).toContain('Color must be a valid hex color (e.g., #FF5722)');
    });
  });

  describe('edge cases and boundary conditions', () => {
    it('should handle name with exactly 100 characters', () => {
      // Arrange
      const name100chars = 'a'.repeat(100);
      const props: CategoryProps = {
        name: name100chars,
        type: CategoryType.EXPENSE,
        budgetId: 'budget-boundary',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const category = result.data!;
      expect(category.name).toBe(name100chars);
      expect(category.name.length).toBe(100);
    });

    it('should handle special characters in name', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Category with special chars: àáâãäç éêë íîï óôõö úûü ñ',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-special',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const category = result.data!;
      expect(category.name).toBe('Category with special chars: àáâãäç éêë íîï óôõö úûü ñ');
    });

    it('should handle special characters in description', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-desc',
        description: 'Description with emojis 💰💸 and symbols @#$%^&*()',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const category = result.data!;
      expect(category.description).toBe('Description with emojis 💰💸 and symbols @#$%^&*()');
    });

    it('should handle empty description', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-empty',
        description: '',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const category = result.data!;
      expect(category.description).toBe('');
    });

    it('should handle special characters in icon name', () => {
      // Arrange
      const props: CategoryProps = {
        name: 'Test Category',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-icon',
        icon: 'icon_with_underscores_123',
      };

      // Act
      const result = Category.create(props);

      // Assert
      expect(result.hasData).toBe(true);
      const category = result.data!;
      expect(category.icon).toBe('icon_with_underscores_123');
    });

    it('should generate unique IDs for different categories', () => {
      // Arrange
      const props1: CategoryProps = {
        name: 'Category 1',
        type: CategoryType.EXPENSE,
        budgetId: 'budget-1',
      };
      const props2: CategoryProps = {
        name: 'Category 2',
        type: CategoryType.INCOME,
        budgetId: 'budget-2',
      };

      // Act
      const category1 = Category.create(props1).data!;
      const category2 = Category.create(props2).data!;

      // Assert
      expect(category1.id).not.toBe(category2.id);
      expect(category1.id.length).toBeGreaterThan(0);
      expect(category2.id.length).toBeGreaterThan(0);
    });

    it('should handle various valid hex color formats', () => {
      // Arrange
      const validColors = ['#F00', '#ff0000', '#FF0000', '#aB3', '#AbCdEf'];

      // Act & Assert
      validColors.forEach((color) => {
        const props: CategoryProps = {
          name: `Category ${color}`,
          type: CategoryType.EXPENSE,
          budgetId: 'budget-color',
          color: color,
        };

        const result = Category.create(props);
        expect(result.hasData).toBe(true);
        expect(result.data!.color).toBe(color);
      });
    });

    it('should reject various invalid hex color formats', () => {
      // Arrange
      const invalidColors = ['#GG0', '#12345', '#1234567', 'FF0000', '#', '#XYZ', '#12'];

      // Act & Assert
      invalidColors.forEach((color) => {
        const props: CategoryProps = {
          name: `Category ${color}`,
          type: CategoryType.EXPENSE,
          budgetId: 'budget-color',
          color: color,
        };

        const result = Category.create(props);
        expect(result.hasError).toBe(true);
        expect(result.errors).toContain('Color must be a valid hex color (e.g., #FF5722)');
      });
    });
  });
});
