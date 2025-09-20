import { Either } from '@either';
import { Money } from '../shared/value-objects/money';
import { Uuid } from '../shared/value-objects/uuid';
import { TransactionType } from '../shared/enums/transaction-type';

export interface TransactionProps {
  amount: number;
  type: TransactionType;
  accountId: string;
  categoryId: string;
  description?: string;
  executedAt?: Date;
  isRecurring?: boolean;
}

export class Transaction {
  private readonly _id: Uuid;
  private readonly _amount: Money;
  private readonly _type: TransactionType;
  private readonly _accountId: string;
  private readonly _categoryId: string;
  private readonly _description: string;
  private readonly _executedAt: Date;
  private readonly _isRecurring: boolean;
  private readonly _createdAt: Date;

  private constructor(
    id: Uuid,
    amount: Money,
    type: TransactionType,
    accountId: string,
    categoryId: string,
    description: string = '',
    executedAt: Date = new Date(),
    isRecurring: boolean = false,
    createdAt: Date = new Date()
  ) {
    this._id = id;
    this._amount = amount;
    this._type = type;
    this._accountId = accountId;
    this._categoryId = categoryId;
    this._description = description;
    this._executedAt = executedAt;
    this._isRecurring = isRecurring;
    this._createdAt = createdAt;
  }

  get id(): string {
    return this._id.value;
  }

  get amount(): Money {
    return this._amount;
  }

  get type(): TransactionType {
    return this._type;
  }

  get accountId(): string {
    return this._accountId;
  }

  get categoryId(): string {
    return this._categoryId;
  }

  get description(): string {
    return this._description;
  }

  get executedAt(): Date {
    return new Date(this._executedAt);
  }

  get isRecurring(): boolean {
    return this._isRecurring;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  isIncome(): boolean {
    return this._type === TransactionType.INCOME;
  }

  isExpense(): boolean {
    return this._type === TransactionType.EXPENSE;
  }

  formatAmount(): string {
    return this._amount.formatBRL();
  }

  getTypeLabel(): string {
    const labels: Record<TransactionType, string> = {
      [TransactionType.INCOME]: 'Receita',
      [TransactionType.EXPENSE]: 'Despesa',
    };
    return labels[this._type];
  }

  toJSON(): {
    id: string;
    amount: { valueInCents: number; valueInMonetary: number; formatted: string };
    type: TransactionType;
    accountId: string;
    categoryId: string;
    description: string;
    executedAt: string;
    isRecurring: boolean;
    createdAt: string;
  } {
    return {
      id: this._id.value,
      amount: this._amount.toJSON(),
      type: this._type,
      accountId: this._accountId,
      categoryId: this._categoryId,
      description: this._description,
      executedAt: this._executedAt.toISOString(),
      isRecurring: this._isRecurring,
      createdAt: this._createdAt.toISOString(),
    };
  }

  static create(props: TransactionProps): Either<string, Transaction> {
    const amountResult = Money.fromMonetary(props.amount);
    if (amountResult.hasError) {
      return Either.error(`Invalid amount: ${amountResult.errors.join(', ')}`);
    }

    const typeValidation = Transaction.validateType(props.type);
    if (typeValidation.hasError) {
      return Either.errors(typeValidation.errors);
    }

    const accountIdValidation = Transaction.validateAccountId(props.accountId);
    if (accountIdValidation.hasError) {
      return Either.errors(accountIdValidation.errors);
    }

    const categoryIdValidation = Transaction.validateCategoryId(props.categoryId);
    if (categoryIdValidation.hasError) {
      return Either.errors(categoryIdValidation.errors);
    }

    const id = Uuid.generate();
    const amount = amountResult.data!;
    const description = props.description || '';
    const executedAt = props.executedAt || new Date();
    const isRecurring = props.isRecurring !== undefined ? props.isRecurring : false;

    return Either.success(
      new Transaction(id, amount, props.type, props.accountId, props.categoryId, description, executedAt, isRecurring)
    );
  }

  static fromJSON(json: {
    id: string;
    amount: { valueInCents: number };
    type: TransactionType;
    accountId: string;
    categoryId: string;
    description: string;
    executedAt: string;
    isRecurring: boolean;
    createdAt: string;
  }): Either<string, Transaction> {
    const idResult = Uuid.create(json.id);
    if (idResult.hasError) {
      return Either.error(`Invalid id: ${idResult.errors.join(', ')}`);
    }

    const amountResult = Money.fromJSON(json.amount);
    if (amountResult.hasError) {
      return Either.error(`Invalid amount: ${amountResult.errors.join(', ')}`);
    }

    const typeValidation = Transaction.validateType(json.type);
    if (typeValidation.hasError) {
      return Either.errors(typeValidation.errors);
    }

    const accountIdValidation = Transaction.validateAccountId(json.accountId);
    if (accountIdValidation.hasError) {
      return Either.errors(accountIdValidation.errors);
    }

    const categoryIdValidation = Transaction.validateCategoryId(json.categoryId);
    if (categoryIdValidation.hasError) {
      return Either.errors(categoryIdValidation.errors);
    }

    const executedAt = new Date(json.executedAt);
    const createdAt = new Date(json.createdAt);

    return Either.success(
      new Transaction(
        idResult.data!,
        amountResult.data!,
        json.type,
        json.accountId,
        json.categoryId,
        json.description,
        executedAt,
        json.isRecurring,
        createdAt
      )
    );
  }

  private static validateType(type: TransactionType): Either<string, void> {
    const validTypes = Object.values(TransactionType);
    if (!validTypes.includes(type)) {
      return Either.error(`Invalid transaction type. Must be one of: ${validTypes.join(', ')}`);
    }

    return Either.success(undefined);
  }

  private static validateAccountId(accountId: string): Either<string, void> {
    if (typeof accountId !== 'string') {
      return Either.error('Account ID must be a string');
    }

    if (accountId.trim().length === 0) {
      return Either.error('Account ID cannot be empty');
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
}