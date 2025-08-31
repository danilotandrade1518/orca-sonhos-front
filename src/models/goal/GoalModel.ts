import { Money } from '../shared/value-objects/Money';
import { Uuid } from '../shared/value-objects/Uuid';

export interface GoalProps {
  id: Uuid;
  budgetId: Uuid;
  name: string;
  totalAmount: Money;
  accumulatedAmount: Money;
  deadline?: Date;
}

export class GoalModel {
  private constructor(private props: GoalProps) {}

  static create(props: GoalProps): GoalModel {
    if (!props.name?.trim()) throw new Error('Goal name is required');
    return new GoalModel(props);
  }

  addAmount(amount: Money) {
    this.props.accumulatedAmount = this.props.accumulatedAmount.add(amount);
  }
}
