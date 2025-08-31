import { Money } from '../shared/value-objects/Money';
import { Uuid } from '../shared/value-objects/Uuid';

export type TransactionType = 'debit' | 'credit' | 'transfer';

export interface TransactionProps {
  id: Uuid;
  budgetId: Uuid;
  accountId: Uuid;
  categoryId: Uuid;
  description: string;
  amount: Money;
  type: TransactionType;
  transactionDate: Date;
  isLate?: boolean;
}

export class Transaction {
  private constructor(private props: TransactionProps) {}

  static create(props: TransactionProps): Transaction {
    if (!props.description?.trim()) throw new Error('Description is required');
    return new Transaction({ ...props, isLate: !!props.isLate });
  }

  markLate(lateDate: Date) {
    // business rule can be extended to compare dates
    this.props.isLate = true;
    this.props.transactionDate = lateDate ?? this.props.transactionDate;
  }
}
