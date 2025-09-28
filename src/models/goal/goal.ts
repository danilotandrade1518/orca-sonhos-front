import { Either } from '@either';
import { Money } from '../shared/value-objects/money';
import { Uuid } from '../shared/value-objects/uuid';

export enum GoalStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface GoalProps {
  name: string;
  targetAmountInCents: number;
  currentAmountInCents: number;
  budgetId: string;
  targetDate?: Date;
  description?: string;
  status?: GoalStatus;
}

export class Goal {
  private readonly _id: Uuid;
  private readonly _name: string;
  private readonly _targetAmount: Money;
  private readonly _currentAmount: Money;
  private readonly _budgetId: string;
  private readonly _targetDate: Date | null;
  private readonly _description: string;
  private readonly _status: GoalStatus;
  private readonly _createdAt: Date;

  private constructor(
    id: Uuid,
    name: string,
    targetAmount: Money,
    currentAmount: Money,
    budgetId: string,
    targetDate: Date | null = null,
    description: string = '',
    status: GoalStatus = GoalStatus.ACTIVE,
    createdAt: Date = new Date(),
  ) {
    this._id = id;
    this._name = name;
    this._targetAmount = targetAmount;
    this._currentAmount = currentAmount;
    this._budgetId = budgetId;
    this._targetDate = targetDate;
    this._description = description;
    this._status = status;
    this._createdAt = createdAt;
  }

  get id(): string {
    return this._id.value;
  }

  get name(): string {
    return this._name;
  }

  get targetAmount(): Money {
    return this._targetAmount;
  }

  get currentAmount(): Money {
    return this._currentAmount;
  }

  get budgetId(): string {
    return this._budgetId;
  }

  get targetDate(): Date | null {
    return this._targetDate ? new Date(this._targetDate) : null;
  }

  get description(): string {
    return this._description;
  }

  get status(): GoalStatus {
    return this._status;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  getRemainingAmount(): Money {
    const result = this._targetAmount.subtract(this._currentAmount);
    return result.hasError ? Money.zero() : result.data!;
  }

  getProgressPercentage(): number {
    if (this._targetAmount.isZero()) {
      return 0;
    }

    const percentage = (this._currentAmount.valueInCents / this._targetAmount.valueInCents) * 100;
    return Math.min(100, Math.max(0, percentage));
  }

  isCompleted(): boolean {
    return (
      this._status === GoalStatus.COMPLETED ||
      this._currentAmount.isGreaterThan(this._targetAmount) ||
      this._currentAmount.isEqualTo(this._targetAmount)
    );
  }

  isOverdue(): boolean {
    if (!this._targetDate) {
      return false;
    }

    return new Date() > this._targetDate && !this.isCompleted();
  }

  getDaysUntilTarget(): number | null {
    if (!this._targetDate) {
      return null;
    }

    const today = new Date();
    const diffTime = this._targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getMonthlyTargetAmount(): Money | null {
    if (!this._targetDate) {
      return null;
    }

    const monthsRemaining = this.getMonthsUntilTarget();

    if (monthsRemaining <= 0) {
      return this.getRemainingAmount();
    }

    const remainingAmount = this.getRemainingAmount();
    const monthlyAmount = remainingAmount.valueInCents / monthsRemaining;

    const result = Money.fromCents(Math.ceil(monthlyAmount));
    return result.hasError ? Money.zero() : result.data!;
  }

  formatTargetAmount(): string {
    return this._targetAmount.formatBRL();
  }

  formatCurrentAmount(): string {
    return this._currentAmount.formatBRL();
  }

  formatRemainingAmount(): string {
    return this.getRemainingAmount().formatBRL();
  }

  getStatusLabel(): string {
    const labels: Record<GoalStatus, string> = {
      [GoalStatus.ACTIVE]: 'Ativa',
      [GoalStatus.PAUSED]: 'Pausada',
      [GoalStatus.COMPLETED]: 'Concluída',
      [GoalStatus.CANCELLED]: 'Cancelada',
    };
    return labels[this._status];
  }

  toJSON(): {
    id: string;
    name: string;
    targetAmount: { valueInCents: number; valueInMonetary: number; formatted: string };
    currentAmount: { valueInCents: number; valueInMonetary: number; formatted: string };
    budgetId: string;
    targetDate: string | null;
    description: string;
    status: GoalStatus;
    createdAt: string;
  } {
    return {
      id: this._id.value,
      name: this._name,
      targetAmount: this._targetAmount.toJSON(),
      currentAmount: this._currentAmount.toJSON(),
      budgetId: this._budgetId,
      targetDate: this._targetDate ? this._targetDate.toISOString() : null,
      description: this._description,
      status: this._status,
      createdAt: this._createdAt.toISOString(),
    };
  }

  static create(props: GoalProps): Either<string, Goal> {
    const nameValidation = Goal.validateName(props.name);
    if (nameValidation.hasError) {
      return Either.errors(nameValidation.errors);
    }

    const targetAmountResult = Money.fromCents(props.targetAmountInCents);
    if (targetAmountResult.hasError) {
      return Either.error(`Invalid target amount: ${targetAmountResult.errors.join(', ')}`);
    }

    const currentAmountResult = Money.fromCents(props.currentAmountInCents);
    if (currentAmountResult.hasError) {
      return Either.error(`Invalid current amount: ${currentAmountResult.errors.join(', ')}`);
    }

    const budgetIdValidation = Goal.validateBudgetId(props.budgetId);
    if (budgetIdValidation.hasError) {
      return Either.errors(budgetIdValidation.errors);
    }

    if (props.targetDate) {
      const targetDateValidation = Goal.validateTargetDate(props.targetDate);
      if (targetDateValidation.hasError) {
        return Either.errors(targetDateValidation.errors);
      }
    }

    const status = props.status || GoalStatus.ACTIVE;
    const statusValidation = Goal.validateStatus(status);
    if (statusValidation.hasError) {
      return Either.errors(statusValidation.errors);
    }

    const id = Uuid.generate();
    const targetAmount = targetAmountResult.data!;
    const currentAmount = currentAmountResult.data!;
    const targetDate = props.targetDate || null;
    const description = props.description || '';

    return Either.success(
      new Goal(
        id,
        props.name,
        targetAmount,
        currentAmount,
        props.budgetId,
        targetDate,
        description,
        status,
      ),
    );
  }

  static fromJSON(json: {
    id: string;
    name: string;
    targetAmount: { valueInCents: number };
    currentAmount: { valueInCents: number };
    budgetId: string;
    targetDate: string | null;
    description: string;
    status: GoalStatus;
    createdAt: string;
  }): Either<string, Goal> {
    const idResult = Uuid.create(json.id);
    if (idResult.hasError) {
      return Either.error(`Invalid id: ${idResult.errors.join(', ')}`);
    }

    const nameValidation = Goal.validateName(json.name);
    if (nameValidation.hasError) {
      return Either.errors(nameValidation.errors);
    }

    const targetAmountResult = Money.fromJSON(json.targetAmount);
    if (targetAmountResult.hasError) {
      return Either.error(`Invalid target amount: ${targetAmountResult.errors.join(', ')}`);
    }

    const currentAmountResult = Money.fromJSON(json.currentAmount);
    if (currentAmountResult.hasError) {
      return Either.error(`Invalid current amount: ${currentAmountResult.errors.join(', ')}`);
    }

    const budgetIdValidation = Goal.validateBudgetId(json.budgetId);
    if (budgetIdValidation.hasError) {
      return Either.errors(budgetIdValidation.errors);
    }

    const statusValidation = Goal.validateStatus(json.status);
    if (statusValidation.hasError) {
      return Either.errors(statusValidation.errors);
    }

    const targetDate = json.targetDate ? new Date(json.targetDate) : null;
    if (targetDate) {
      const targetDateValidation = Goal.validateTargetDate(targetDate);
      if (targetDateValidation.hasError) {
        return Either.errors(targetDateValidation.errors);
      }
    }

    const createdAt = new Date(json.createdAt);

    return Either.success(
      new Goal(
        idResult.data!,
        json.name,
        targetAmountResult.data!,
        currentAmountResult.data!,
        json.budgetId,
        targetDate,
        json.description,
        json.status,
        createdAt,
      ),
    );
  }

  private getMonthsUntilTarget(): number {
    if (!this._targetDate) {
      return 0;
    }

    const today = new Date();
    const diffMonths =
      (this._targetDate.getFullYear() - today.getFullYear()) * 12 +
      (this._targetDate.getMonth() - today.getMonth());

    return Math.max(1, diffMonths);
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

  private static validateTargetDate(targetDate: Date): Either<string, void> {
    if (!(targetDate instanceof Date) || isNaN(targetDate.getTime())) {
      return Either.error('Target date must be a valid date');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (targetDate < today) {
      return Either.error('Target date cannot be in the past');
    }

    return Either.success(undefined);
  }

  private static validateStatus(status: GoalStatus): Either<string, void> {
    const validStatuses = Object.values(GoalStatus);
    if (!validStatuses.includes(status)) {
      return Either.error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    return Either.success(undefined);
  }
}
