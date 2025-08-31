import { Money } from '../shared/value-objects/Money';
import { Uuid } from '../shared/value-objects/Uuid';

export interface EnvelopeProps {
  id: Uuid;
  budgetId: Uuid;
  categoryId: Uuid;
  name: string;
  monthlyLimit: Money;
  balance: Money;
}

export class EnvelopeModel {
  private constructor(private props: EnvelopeProps) {}

  static create(props: EnvelopeProps): EnvelopeModel {
    if (!props.name?.trim()) throw new Error('Envelope name is required');
    return new EnvelopeModel(props);
  }

  addAmount(amount: Money) {
    this.props.balance = this.props.balance.add(amount);
  }

  removeAmount(amount: Money) {
    this.props.balance = this.props.balance.subtract(amount);
  }
}
