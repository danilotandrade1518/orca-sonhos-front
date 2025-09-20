import { Either } from '@either';
import { Money } from '../shared/value-objects/money';
import { Uuid } from '../shared/value-objects/uuid';
import { AccountType } from '../shared/enums/account-type';

export interface AccountProps {
  name: string;
  type: AccountType;
  balanceInCents: number;
  budgetId: string;
  description?: string;
  isActive?: boolean;
}

export class Account {
  private readonly _id: Uuid;
  private readonly _name: string;
  private readonly _type: AccountType;
  private readonly _balance: Money;
  private readonly _budgetId: string;
  private readonly _description: string;
  private readonly _isActive: boolean;
  private readonly _createdAt: Date;

  private constructor(
    id: Uuid,
    name: string,
    type: AccountType,
    balance: Money,
    budgetId: string,
    description: string = '',
    isActive: boolean = true,
    createdAt: Date = new Date()
  ) {
    this._id = id;
    this._name = name;
    this._type = type;
    this._balance = balance;
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

  get type(): AccountType {
    return this._type;
  }

  get balance(): Money {
    return this._balance;
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

  hasPositiveBalance(): boolean {
    return !this._balance.isZero() && this._balance.valueInCents > 0;
  }

  hasNegativeBalance(): boolean {
    return this._balance.valueInCents < 0;
  }

  formatBalance(): string {
    return this._balance.formatBRL();
  }

  getTypeLabel(): string {
    const labels: Record<AccountType, string> = {
      [AccountType.CHECKING]: 'Conta Corrente',
      [AccountType.SAVINGS]: 'Poupança',
      [AccountType.INVESTMENT]: 'Investimento',
      [AccountType.CASH]: 'Dinheiro',
    };
    return labels[this._type];
  }

  toJSON(): {
    id: string;
    name: string;
    type: AccountType;
    balance: { valueInCents: number; valueInMonetary: number; formatted: string };
    budgetId: string;
    description: string;
    isActive: boolean;
    createdAt: string;
  } {
    return {
      id: this._id.value,
      name: this._name,
      type: this._type,
      balance: this._balance.toJSON(),
      budgetId: this._budgetId,
      description: this._description,
      isActive: this._isActive,
      createdAt: this._createdAt.toISOString(),
    };
  }

  static create(props: AccountProps): Either<string, Account> {
    const nameValidation = Account.validateName(props.name);
    if (nameValidation.hasError) {
      return Either.errors(nameValidation.errors);
    }

    const typeValidation = Account.validateType(props.type);
    if (typeValidation.hasError) {
      return Either.errors(typeValidation.errors);
    }

    const balanceResult = Money.fromCents(props.balanceInCents);
    if (balanceResult.hasError) {
      return Either.error(`Invalid balance: ${balanceResult.errors.join(', ')}`);
    }

    const budgetIdValidation = Account.validateBudgetId(props.budgetId);
    if (budgetIdValidation.hasError) {
      return Either.errors(budgetIdValidation.errors);
    }

    const id = Uuid.generate();
    const balance = balanceResult.data!;
    const description = props.description || '';
    const isActive = props.isActive !== undefined ? props.isActive : true;

    return Either.success(
      new Account(id, props.name, props.type, balance, props.budgetId, description, isActive)
    );
  }

  static fromJSON(json: {
    id: string;
    name: string;
    type: AccountType;
    balance: { valueInCents: number };
    budgetId: string;
    description: string;
    isActive: boolean;
    createdAt: string;
  }): Either<string, Account> {
    const idResult = Uuid.create(json.id);
    if (idResult.hasError) {
      return Either.error(`Invalid id: ${idResult.errors.join(', ')}`);
    }

    const nameValidation = Account.validateName(json.name);
    if (nameValidation.hasError) {
      return Either.errors(nameValidation.errors);
    }

    const typeValidation = Account.validateType(json.type);
    if (typeValidation.hasError) {
      return Either.errors(typeValidation.errors);
    }

    const balanceResult = Money.fromJSON(json.balance);
    if (balanceResult.hasError) {
      return Either.error(`Invalid balance: ${balanceResult.errors.join(', ')}`);
    }

    const budgetIdValidation = Account.validateBudgetId(json.budgetId);
    if (budgetIdValidation.hasError) {
      return Either.errors(budgetIdValidation.errors);
    }

    const createdAt = new Date(json.createdAt);

    return Either.success(
      new Account(
        idResult.data!,
        json.name,
        json.type,
        balanceResult.data!,
        json.budgetId,
        json.description,
        json.isActive,
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

  private static validateType(type: AccountType): Either<string, void> {
    const validTypes = Object.values(AccountType);
    if (!validTypes.includes(type)) {
      return Either.error(`Invalid account type. Must be one of: ${validTypes.join(', ')}`);
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