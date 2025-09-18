import { Either } from '@either';
import { Uuid } from '../shared/value-objects/uuid';
import { CategoryType } from '../shared/enums/category-type';

export interface CategoryProps {
  name: string;
  type: CategoryType;
  budgetId: string;
  description?: string;
  isActive?: boolean;
  color?: string;
  icon?: string;
}

export class Category {
  private readonly _id: Uuid;
  private readonly _name: string;
  private readonly _type: CategoryType;
  private readonly _budgetId: string;
  private readonly _description: string;
  private readonly _isActive: boolean;
  private readonly _color: string;
  private readonly _icon: string;
  private readonly _createdAt: Date;

  private constructor(
    id: Uuid,
    name: string,
    type: CategoryType,
    budgetId: string,
    description: string = '',
    isActive: boolean = true,
    color: string = '#757575',
    icon: string = 'category',
    createdAt: Date = new Date()
  ) {
    this._id = id;
    this._name = name;
    this._type = type;
    this._budgetId = budgetId;
    this._description = description;
    this._isActive = isActive;
    this._color = color;
    this._icon = icon;
    this._createdAt = createdAt;
  }

  get id(): string {
    return this._id.value;
  }

  get name(): string {
    return this._name;
  }

  get type(): CategoryType {
    return this._type;
  }

  get budgetId(): string {
    return this._budgetId;
  }

  get description(): string {
    return this._description;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get color(): string {
    return this._color;
  }

  get icon(): string {
    return this._icon;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  isIncome(): boolean {
    return this._type === CategoryType.INCOME;
  }

  isExpense(): boolean {
    return this._type === CategoryType.EXPENSE;
  }

  getTypeLabel(): string {
    const labels: Record<CategoryType, string> = {
      [CategoryType.INCOME]: 'Receita',
      [CategoryType.EXPENSE]: 'Despesa',
    };
    return labels[this._type];
  }

  getStatusLabel(): string {
    return this._isActive ? 'Ativa' : 'Inativa';
  }

  toJSON(): {
    id: string;
    name: string;
    type: CategoryType;
    budgetId: string;
    description: string;
    isActive: boolean;
    color: string;
    icon: string;
    createdAt: string;
  } {
    return {
      id: this._id.value,
      name: this._name,
      type: this._type,
      budgetId: this._budgetId,
      description: this._description,
      isActive: this._isActive,
      color: this._color,
      icon: this._icon,
      createdAt: this._createdAt.toISOString(),
    };
  }

  static create(props: CategoryProps): Either<string, Category> {
    const nameValidation = Category.validateName(props.name);
    if (nameValidation.hasError) {
      return Either.errors(nameValidation.errors);
    }

    const typeValidation = Category.validateType(props.type);
    if (typeValidation.hasError) {
      return Either.errors(typeValidation.errors);
    }

    const budgetIdValidation = Category.validateBudgetId(props.budgetId);
    if (budgetIdValidation.hasError) {
      return Either.errors(budgetIdValidation.errors);
    }

    if (props.color) {
      const colorValidation = Category.validateColor(props.color);
      if (colorValidation.hasError) {
        return Either.errors(colorValidation.errors);
      }
    }

    const id = Uuid.generate();
    const description = props.description || '';
    const isActive = props.isActive !== undefined ? props.isActive : true;
    const color = props.color || '#757575';
    const icon = props.icon || 'category';

    return Either.success(
      new Category(id, props.name, props.type, props.budgetId, description, isActive, color, icon)
    );
  }

  static fromJSON(json: {
    id: string;
    name: string;
    type: CategoryType;
    budgetId: string;
    description: string;
    isActive: boolean;
    color: string;
    icon: string;
    createdAt: string;
  }): Either<string, Category> {
    const idResult = Uuid.create(json.id);
    if (idResult.hasError) {
      return Either.error(`Invalid id: ${idResult.errors.join(', ')}`);
    }

    const nameValidation = Category.validateName(json.name);
    if (nameValidation.hasError) {
      return Either.errors(nameValidation.errors);
    }

    const typeValidation = Category.validateType(json.type);
    if (typeValidation.hasError) {
      return Either.errors(typeValidation.errors);
    }

    const budgetIdValidation = Category.validateBudgetId(json.budgetId);
    if (budgetIdValidation.hasError) {
      return Either.errors(budgetIdValidation.errors);
    }

    const colorValidation = Category.validateColor(json.color);
    if (colorValidation.hasError) {
      return Either.errors(colorValidation.errors);
    }

    const createdAt = new Date(json.createdAt);

    return Either.success(
      new Category(
        idResult.data!,
        json.name,
        json.type,
        json.budgetId,
        json.description,
        json.isActive,
        json.color,
        json.icon,
        createdAt
      )
    );
  }

  private static validateName(name: string): Either<string, void> {
    if (typeof name !== 'string') {
      return Either.error('Name must be a string');
    }

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      return Either.error('Name cannot be empty');
    }

    if (trimmedName.length > 100) {
      return Either.error('Name cannot exceed 100 characters');
    }

    return Either.success(undefined);
  }

  private static validateType(type: CategoryType): Either<string, void> {
    const validTypes = Object.values(CategoryType);
    if (!validTypes.includes(type)) {
      return Either.error(`Invalid category type. Must be one of: ${validTypes.join(', ')}`);
    }

    return Either.success(undefined);
  }

  private static validateBudgetId(budgetId: string): Either<string, void> {
    if (typeof budgetId !== 'string') {
      return Either.error('Budget ID must be a string');
    }

    if (budgetId.trim().length === 0) {
      return Either.error('Budget ID cannot be empty');
    }

    return Either.success(undefined);
  }

  private static validateColor(color: string): Either<string, void> {
    if (typeof color !== 'string') {
      return Either.error('Color must be a string');
    }

    const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;
    if (!hexColorRegex.test(color)) {
      return Either.error('Color must be a valid hex color (e.g., #FF5722)');
    }

    return Either.success(undefined);
  }
}