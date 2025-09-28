import { Either } from '@either';
import { Money } from '../shared/value-objects/money';
import { Uuid } from '../shared/value-objects/uuid';

export enum CreditCardBillStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
}

export interface CreditCardBillProps {
  totalAmountInCents: number;
  creditCardId: string;
  closingDate: Date;
  dueDate: Date;
  status?: CreditCardBillStatus;
  paidAmountInCents?: number;
  paidAt?: Date;
}

export class CreditCardBill {
  private readonly _id: Uuid;
  private readonly _totalAmount: Money;
  private readonly _paidAmount: Money;
  private readonly _creditCardId: string;
  private readonly _closingDate: Date;
  private readonly _dueDate: Date;
  private readonly _status: CreditCardBillStatus;
  private readonly _paidAt: Date | null;
  private readonly _createdAt: Date;

  private constructor(
    id: Uuid,
    totalAmount: Money,
    paidAmount: Money,
    creditCardId: string,
    closingDate: Date,
    dueDate: Date,
    status: CreditCardBillStatus = CreditCardBillStatus.OPEN,
    paidAt: Date | null = null,
    createdAt: Date = new Date(),
  ) {
    this._id = id;
    this._totalAmount = totalAmount;
    this._paidAmount = paidAmount;
    this._creditCardId = creditCardId;
    this._closingDate = closingDate;
    this._dueDate = dueDate;
    this._status = status;
    this._paidAt = paidAt;
    this._createdAt = createdAt;
  }

  get id(): string {
    return this._id.value;
  }

  get totalAmount(): Money {
    return this._totalAmount;
  }

  get paidAmount(): Money {
    return this._paidAmount;
  }

  get creditCardId(): string {
    return this._creditCardId;
  }

  get closingDate(): Date {
    return new Date(this._closingDate);
  }

  get dueDate(): Date {
    return new Date(this._dueDate);
  }

  get status(): CreditCardBillStatus {
    return this._status;
  }

  get paidAt(): Date | null {
    return this._paidAt ? new Date(this._paidAt) : null;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  getRemainingAmount(): Money {
    const result = this._totalAmount.subtract(this._paidAmount);
    return result.hasError ? Money.zero() : result.data!;
  }

  isPaid(): boolean {
    return this._status === CreditCardBillStatus.PAID;
  }

  isOverdue(): boolean {
    return (
      this._status === CreditCardBillStatus.OVERDUE ||
      (this._status === CreditCardBillStatus.CLOSED && new Date() > this._dueDate)
    );
  }

  isPartiallyPaid(): boolean {
    return !this._paidAmount.isZero() && this._paidAmount.isLessThan(this._totalAmount);
  }

  formatTotalAmount(): string {
    return this._totalAmount.formatBRL();
  }

  formatPaidAmount(): string {
    return this._paidAmount.formatBRL();
  }

  formatRemainingAmount(): string {
    return this.getRemainingAmount().formatBRL();
  }

  getStatusLabel(): string {
    const labels: Record<CreditCardBillStatus, string> = {
      [CreditCardBillStatus.OPEN]: 'Aberta',
      [CreditCardBillStatus.CLOSED]: 'Fechada',
      [CreditCardBillStatus.PAID]: 'Paga',
      [CreditCardBillStatus.OVERDUE]: 'Vencida',
    };
    return labels[this._status];
  }

  getDaysUntilDue(): number {
    const today = new Date();
    const diffTime = this._dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  toJSON(): {
    id: string;
    totalAmount: { valueInCents: number; valueInMonetary: number; formatted: string };
    paidAmount: { valueInCents: number; valueInMonetary: number; formatted: string };
    creditCardId: string;
    closingDate: string;
    dueDate: string;
    status: CreditCardBillStatus;
    paidAt: string | null;
    createdAt: string;
  } {
    return {
      id: this._id.value,
      totalAmount: this._totalAmount.toJSON(),
      paidAmount: this._paidAmount.toJSON(),
      creditCardId: this._creditCardId,
      closingDate: this._closingDate.toISOString(),
      dueDate: this._dueDate.toISOString(),
      status: this._status,
      paidAt: this._paidAt ? this._paidAt.toISOString() : null,
      createdAt: this._createdAt.toISOString(),
    };
  }

  static create(props: CreditCardBillProps): Either<string, CreditCardBill> {
    const totalAmountResult = Money.fromCents(props.totalAmountInCents);
    if (totalAmountResult.hasError) {
      return Either.error(`Invalid total amount: ${totalAmountResult.errors.join(', ')}`);
    }

    const paidAmountInCents = props.paidAmountInCents || 0;
    const paidAmountResult = Money.fromCents(paidAmountInCents);
    if (paidAmountResult.hasError) {
      return Either.error(`Invalid paid amount: ${paidAmountResult.errors.join(', ')}`);
    }

    const creditCardIdValidation = CreditCardBill.validateCreditCardId(props.creditCardId);
    if (creditCardIdValidation.hasError) {
      return Either.errors(creditCardIdValidation.errors);
    }

    const dateValidation = CreditCardBill.validateDates(props.closingDate, props.dueDate);
    if (dateValidation.hasError) {
      return Either.errors(dateValidation.errors);
    }

    const status = props.status || CreditCardBillStatus.OPEN;
    const statusValidation = CreditCardBill.validateStatus(status);
    if (statusValidation.hasError) {
      return Either.errors(statusValidation.errors);
    }

    const id = Uuid.generate();
    const totalAmount = totalAmountResult.data!;
    const paidAmount = paidAmountResult.data!;
    const paidAt = props.paidAt || null;

    return Either.success(
      new CreditCardBill(
        id,
        totalAmount,
        paidAmount,
        props.creditCardId,
        props.closingDate,
        props.dueDate,
        status,
        paidAt,
      ),
    );
  }

  static fromJSON(json: {
    id: string;
    totalAmount: { valueInCents: number };
    paidAmount: { valueInCents: number };
    creditCardId: string;
    closingDate: string;
    dueDate: string;
    status: CreditCardBillStatus;
    paidAt: string | null;
    createdAt: string;
  }): Either<string, CreditCardBill> {
    const idResult = Uuid.create(json.id);
    if (idResult.hasError) {
      return Either.error(`Invalid id: ${idResult.errors.join(', ')}`);
    }

    const totalAmountResult = Money.fromJSON(json.totalAmount);
    if (totalAmountResult.hasError) {
      return Either.error(`Invalid total amount: ${totalAmountResult.errors.join(', ')}`);
    }

    const paidAmountResult = Money.fromJSON(json.paidAmount);
    if (paidAmountResult.hasError) {
      return Either.error(`Invalid paid amount: ${paidAmountResult.errors.join(', ')}`);
    }

    const creditCardIdValidation = CreditCardBill.validateCreditCardId(json.creditCardId);
    if (creditCardIdValidation.hasError) {
      return Either.errors(creditCardIdValidation.errors);
    }

    const closingDate = new Date(json.closingDate);
    const dueDate = new Date(json.dueDate);
    const dateValidation = CreditCardBill.validateDates(closingDate, dueDate);
    if (dateValidation.hasError) {
      return Either.errors(dateValidation.errors);
    }

    const statusValidation = CreditCardBill.validateStatus(json.status);
    if (statusValidation.hasError) {
      return Either.errors(statusValidation.errors);
    }

    const paidAt = json.paidAt ? new Date(json.paidAt) : null;
    const createdAt = new Date(json.createdAt);

    return Either.success(
      new CreditCardBill(
        idResult.data!,
        totalAmountResult.data!,
        paidAmountResult.data!,
        json.creditCardId,
        closingDate,
        dueDate,
        json.status,
        paidAt,
        createdAt,
      ),
    );
  }

  private static validateCreditCardId(creditCardId: string): Either<string, void> {
    if (typeof creditCardId !== 'string') {
      return Either.error('Credit card ID must be a string');
    }

    if (creditCardId.trim().length === 0) {
      return Either.error('Credit card ID cannot be empty');
    }

    return Either.success(undefined);
  }

  private static validateDates(closingDate: Date, dueDate: Date): Either<string, void> {
    if (!(closingDate instanceof Date) || isNaN(closingDate.getTime())) {
      return Either.error('Closing date must be a valid date');
    }

    if (!(dueDate instanceof Date) || isNaN(dueDate.getTime())) {
      return Either.error('Due date must be a valid date');
    }

    if (dueDate <= closingDate) {
      return Either.error('Due date must be after closing date');
    }

    return Either.success(undefined);
  }

  private static validateStatus(status: CreditCardBillStatus): Either<string, void> {
    const validStatuses = Object.values(CreditCardBillStatus);
    if (!validStatuses.includes(status)) {
      return Either.error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    return Either.success(undefined);
  }
}
