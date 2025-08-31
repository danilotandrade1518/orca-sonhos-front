import { Money } from '../shared/value-objects/Money';
import { Uuid } from '../shared/value-objects/Uuid';

export type AccountType = 'cash' | 'checking' | 'savings' | 'wallet' | 'other';

export interface AccountProps {
  id: Uuid;
  budgetId: Uuid;
  name: string;
  type: AccountType;
  description?: string;
  balance: Money;
}

export class AccountModel {
  private constructor(private props: AccountProps) {}

  static create(props: AccountProps): AccountModel {
    if (!props.name?.trim()) throw new Error('Account name is required');
    return new AccountModel(props);
  }

  get id(): Uuid {
    return this.props.id;
  }

  get balance(): Money {
    return this.props.balance;
  }

  reconcile(realBalance: Money) {
    this.props.balance = realBalance;
  }
}
