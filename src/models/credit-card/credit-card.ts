import { Either } from '@either';
import { Money } from '../shared/value-objects/money';
import { Uuid } from '../shared/value-objects/uuid';

export interface CreditCardProps {
  name: string;
  limitInCents: number;
  budgetId: string;
  closingDay: number;
  dueDay: number;
  brand?: string;
  lastFourDigits?: string;
  isActive?: boolean;
}

export class CreditCard {
  private readonly _id: Uuid;
  private readonly _name: string;
  private readonly _limit: Money;
  private readonly _budgetId: string;
  private readonly _closingDay: number;
  private readonly _dueDay: number;
  private readonly _brand: string;
  private readonly _lastFourDigits: string;
  private readonly _isActive: boolean;
  private readonly _createdAt: Date;

  private constructor(
    id: Uuid,
    name: string,
    limit: Money,
    budgetId: string,
    closingDay: number,
    dueDay: number,
    brand: string = '',
    lastFourDigits: string = '',
    isActive: boolean = true,
    createdAt: Date = new Date(),
  ) {
    this._id = id;
    this._name = name;
    this._limit = limit;
    this._budgetId = budgetId;
    this._closingDay = closingDay;
    this._dueDay = dueDay;
    this._brand = brand;
    this._lastFourDigits = lastFourDigits;
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

  get budgetId(): string {
    return this._budgetId;
  }

  get closingDay(): number {
    return this._closingDay;
  }

  get dueDay(): number {
    return this._dueDay;
  }

  get brand(): string {
    return this._brand;
  }

  get lastFourDigits(): string {
    return this._lastFourDigits;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  formatLimit(): string {
    return this._limit.formatBRL();
  }

  getDisplayName(): string {
    if (this._brand && this._lastFourDigits) {
      return `${this._brand} ****${this._lastFourDigits}`;
    }
    return this._name;
  }

  getNextClosingDate(referenceDate: Date = new Date()): Date {
    const nextClosing = new Date(referenceDate);
    nextClosing.setDate(this._closingDay);
    nextClosing.setHours(23, 59, 59, 999);

    if (nextClosing <= referenceDate) {
      nextClosing.setMonth(nextClosing.getMonth() + 1);
    }

    return nextClosing;
  }

  getNextDueDate(referenceDate: Date = new Date()): Date {
    const nextDue = new Date(referenceDate);
    nextDue.setDate(this._dueDay);
    nextDue.setHours(23, 59, 59, 999);

    if (nextDue <= referenceDate) {
      nextDue.setMonth(nextDue.getMonth() + 1);
    }

    return nextDue;
  }

  toJSON(): {
    id: string;
    name: string;
    limit: { valueInCents: number; valueInMonetary: number; formatted: string };
    budgetId: string;
    closingDay: number;
    dueDay: number;
    brand: string;
    lastFourDigits: string;
    isActive: boolean;
    createdAt: string;
  } {
    return {
      id: this._id.value,
      name: this._name,
      limit: this._limit.toJSON(),
      budgetId: this._budgetId,
      closingDay: this._closingDay,
      dueDay: this._dueDay,
      brand: this._brand,
      lastFourDigits: this._lastFourDigits,
      isActive: this._isActive,
      createdAt: this._createdAt.toISOString(),
    };
  }

  static create(props: CreditCardProps): Either<string, CreditCard> {
    const nameValidation = CreditCard.validateName(props.name);
    if (nameValidation.hasError) {
      return Either.errors(nameValidation.errors);
    }

    const limitResult = Money.fromCents(props.limitInCents);
    if (limitResult.hasError) {
      return Either.error(`Invalid limit: ${limitResult.errors.join(', ')}`);
    }

    const budgetIdValidation = CreditCard.validateBudgetId(props.budgetId);
    if (budgetIdValidation.hasError) {
      return Either.errors(budgetIdValidation.errors);
    }

    const closingDayValidation = CreditCard.validateDay(props.closingDay, 'Closing day');
    if (closingDayValidation.hasError) {
      return Either.errors(closingDayValidation.errors);
    }

    const dueDayValidation = CreditCard.validateDay(props.dueDay, 'Due day');
    if (dueDayValidation.hasError) {
      return Either.errors(dueDayValidation.errors);
    }

    if (props.lastFourDigits) {
      const lastFourDigitsValidation = CreditCard.validateLastFourDigits(props.lastFourDigits);
      if (lastFourDigitsValidation.hasError) {
        return Either.errors(lastFourDigitsValidation.errors);
      }
    }

    const id = Uuid.generate();
    const limit = limitResult.data!;
    const brand = props.brand || '';
    const lastFourDigits = props.lastFourDigits || '';
    const isActive = props.isActive !== undefined ? props.isActive : true;

    return Either.success(
      new CreditCard(
        id,
        props.name,
        limit,
        props.budgetId,
        props.closingDay,
        props.dueDay,
        brand,
        lastFourDigits,
        isActive,
      ),
    );
  }

  static fromJSON(json: {
    id: string;
    name: string;
    limit: { valueInCents: number };
    budgetId: string;
    closingDay: number;
    dueDay: number;
    brand: string;
    lastFourDigits: string;
    isActive: boolean;
    createdAt: string;
  }): Either<string, CreditCard> {
    const idResult = Uuid.create(json.id);
    if (idResult.hasError) {
      return Either.error(`Invalid id: ${idResult.errors.join(', ')}`);
    }

    const nameValidation = CreditCard.validateName(json.name);
    if (nameValidation.hasError) {
      return Either.errors(nameValidation.errors);
    }

    const limitResult = Money.fromJSON(json.limit);
    if (limitResult.hasError) {
      return Either.error(`Invalid limit: ${limitResult.errors.join(', ')}`);
    }

    const budgetIdValidation = CreditCard.validateBudgetId(json.budgetId);
    if (budgetIdValidation.hasError) {
      return Either.errors(budgetIdValidation.errors);
    }

    const closingDayValidation = CreditCard.validateDay(json.closingDay, 'Closing day');
    if (closingDayValidation.hasError) {
      return Either.errors(closingDayValidation.errors);
    }

    const dueDayValidation = CreditCard.validateDay(json.dueDay, 'Due day');
    if (dueDayValidation.hasError) {
      return Either.errors(dueDayValidation.errors);
    }

    if (json.lastFourDigits) {
      const lastFourDigitsValidation = CreditCard.validateLastFourDigits(json.lastFourDigits);
      if (lastFourDigitsValidation.hasError) {
        return Either.errors(lastFourDigitsValidation.errors);
      }
    }

    const createdAt = new Date(json.createdAt);

    return Either.success(
      new CreditCard(
        idResult.data!,
        json.name,
        limitResult.data!,
        json.budgetId,
        json.closingDay,
        json.dueDay,
        json.brand,
        json.lastFourDigits,
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

  private static validateBudgetId(budgetId: string): Either<string, void> {
    if (typeof budgetId !== 'string') {
      return Either.error('Budget ID must be a string');
    }

    if (budgetId.trim().length === 0) {
      return Either.error('Budget ID cannot be empty');
    }

    return Either.success(undefined);
  }

  private static validateDay(day: number, fieldName: string): Either<string, void> {
    if (typeof day !== 'number' || !Number.isInteger(day)) {
      return Either.error(`${fieldName} must be an integer`);
    }

    if (day < 1 || day > 31) {
      return Either.error(`${fieldName} must be between 1 and 31`);
    }

    return Either.success(undefined);
  }

  private static validateLastFourDigits(lastFourDigits: string): Either<string, void> {
    if (typeof lastFourDigits !== 'string') {
      return Either.error('Last four digits must be a string');
    }

    const digitsRegex = /^\d{4}$/;
    if (!digitsRegex.test(lastFourDigits)) {
      return Either.error('Last four digits must be exactly 4 numeric digits');
    }

    return Either.success(undefined);
  }
}
