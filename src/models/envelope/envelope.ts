import { Either } from '@either';
import { Money } from '../shared/value-objects/money';
import { Uuid } from '../shared/value-objects/uuid';

export interface EnvelopeProps {
  name: string;
  limitInCents: number;
  currentBalanceInCents: number;
  categoryId: string;
  budgetId: string;
  description?: string;
  isActive?: boolean;
}

export class Envelope {
  private readonly _id: Uuid;
  private readonly _name: string;
  private readonly _limit: Money;
  private readonly _currentBalance: Money;
  private readonly _categoryId: string;
  private readonly _budgetId: string;
  private readonly _description: string;
  private readonly _isActive: boolean;
  private readonly _createdAt: Date;

  private constructor(
    id: Uuid,
    name: string,
    limit: Money,
    currentBalance: Money,
    categoryId: string,
    budgetId: string,
    description: string = '',
    isActive: boolean = true,
    createdAt: Date = new Date(),
  ) {
    this._id = id;
    this._name = name;
    this._limit = limit;
    this._currentBalance = currentBalance;
    this._categoryId = categoryId;
    this._budgetId = budgetId;
    this._description = description;
    this._isActive = isActive;
    this._createdAt = createdAt;
  }

  get id(): string {
    return this._id.value;
  }

  get name(): string {
    return this._name;
  }

  get limit(): Money {
    return this._limit;
  }

  get currentBalance(): Money {
    return this._currentBalance;
  }

  get categoryId(): string {
    return this._categoryId;
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

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  getRemainingAmount(): Money {
    const result = this._limit.subtract(this._currentBalance);
    return result.hasError ? Money.zero() : result.data!;
  }

  getUsagePercentage(): number {
    if (this._limit.isZero()) {
      return 0;
    }

    const percentage = (this._currentBalance.valueInCents / this._limit.valueInCents) * 100;
    return Math.min(100, Math.max(0, percentage));
  }

  isOverLimit(): boolean {
    return this._currentBalance.isGreaterThan(this._limit);
  }

  isNearLimit(threshold: number = 0.9): boolean {
    if (this._limit.isZero()) {
      return false;
    }

    const usageRatio = this._currentBalance.valueInCents / this._limit.valueInCents;
    return usageRatio >= threshold;
  }

  canAllocate(amount: Money): boolean {
    const newBalance = this._currentBalance.add(amount);
    return newBalance.isLessThan(this._limit) || newBalance.isEqualTo(this._limit);
  }

  formatLimit(): string {
    return this._limit.formatBRL();
  }

  formatCurrentBalance(): string {
    return this._currentBalance.formatBRL();
  }

  formatRemainingAmount(): string {
    return this.getRemainingAmount().formatBRL();
  }

  getStatusLabel(): string {
    if (this.isOverLimit()) {
      return 'Acima do Limite';
    }

    if (this.isNearLimit(0.9)) {
      return 'Próximo do Limite';
    }

    if (this.getUsagePercentage() > 50) {
      return 'Em Uso';
    }

    return 'Disponível';
  }

  toJSON(): {
    id: string;
    name: string;
    limit: { valueInCents: number; valueInMonetary: number; formatted: string };
    currentBalance: { valueInCents: number; valueInMonetary: number; formatted: string };
    categoryId: string;
    budgetId: string;
    description: string;
    isActive: boolean;
    createdAt: string;
  } {
    return {
      id: this._id.value,
      name: this._name,
      limit: this._limit.toJSON(),
      currentBalance: this._currentBalance.toJSON(),
      categoryId: this._categoryId,
      budgetId: this._budgetId,
      description: this._description,
      isActive: this._isActive,
      createdAt: this._createdAt.toISOString(),
    };
  }

  static create(props: EnvelopeProps): Either<string, Envelope> {
    const nameValidation = Envelope.validateName(props.name);
    if (nameValidation.hasError) {
      return Either.errors(nameValidation.errors);
    }

    const limitResult = Money.fromCents(props.limitInCents);
    if (limitResult.hasError) {
      return Either.error(`Invalid limit: ${limitResult.errors.join(', ')}`);
    }

    const currentBalanceResult = Money.fromCents(props.currentBalanceInCents);
    if (currentBalanceResult.hasError) {
      return Either.error(`Invalid current balance: ${currentBalanceResult.errors.join(', ')}`);
    }

    const categoryIdValidation = Envelope.validateCategoryId(props.categoryId);
    if (categoryIdValidation.hasError) {
      return Either.errors(categoryIdValidation.errors);
    }

    const budgetIdValidation = Envelope.validateBudgetId(props.budgetId);
    if (budgetIdValidation.hasError) {
      return Either.errors(budgetIdValidation.errors);
    }

    const id = Uuid.generate();
    const limit = limitResult.data!;
    const currentBalance = currentBalanceResult.data!;
    const description = props.description || '';
    const isActive = props.isActive !== undefined ? props.isActive : true;

    return Either.success(
      new Envelope(
        id,
        props.name,
        limit,
        currentBalance,
        props.categoryId,
        props.budgetId,
        description,
        isActive,
      ),
    );
  }

  static fromJSON(json: {
    id: string;
    name: string;
    limit: { valueInCents: number };
    currentBalance: { valueInCents: number };
    categoryId: string;
    budgetId: string;
    description: string;
    isActive: boolean;
    createdAt: string;
  }): Either<string, Envelope> {
    const idResult = Uuid.create(json.id);
    if (idResult.hasError) {
      return Either.error(`Invalid id: ${idResult.errors.join(', ')}`);
    }

    const nameValidation = Envelope.validateName(json.name);
    if (nameValidation.hasError) {
      return Either.errors(nameValidation.errors);
    }

    const limitResult = Money.fromJSON(json.limit);
    if (limitResult.hasError) {
      return Either.error(`Invalid limit: ${limitResult.errors.join(', ')}`);
    }

    const currentBalanceResult = Money.fromJSON(json.currentBalance);
    if (currentBalanceResult.hasError) {
      return Either.error(`Invalid current balance: ${currentBalanceResult.errors.join(', ')}`);
    }

    const categoryIdValidation = Envelope.validateCategoryId(json.categoryId);
    if (categoryIdValidation.hasError) {
      return Either.errors(categoryIdValidation.errors);
    }

    const budgetIdValidation = Envelope.validateBudgetId(json.budgetId);
    if (budgetIdValidation.hasError) {
      return Either.errors(budgetIdValidation.errors);
    }

    const createdAt = new Date(json.createdAt);

    return Either.success(
      new Envelope(
        idResult.data!,
        json.name,
        limitResult.data!,
        currentBalanceResult.data!,
        json.categoryId,
        json.budgetId,
        json.description,
        json.isActive,
        createdAt,
      ),
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

  private static validateCategoryId(categoryId: string): Either<string, void> {
    if (typeof categoryId !== 'string') {
      return Either.error('Category ID must be a string');
    }

    if (categoryId.trim().length === 0) {
      return Either.error('Category ID cannot be empty');
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
}
