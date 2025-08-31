import { Money } from '../shared/value-objects/Money';
import { Uuid } from '../shared/value-objects/Uuid';

export interface CreditCardProps {
  id: Uuid;
  budgetId: Uuid;
  name: string;
  limit: Money;
  closingDay: number; // 1-31
  dueDay: number; // 1-31
}

export class CreditCardModel {
  private constructor(private props: CreditCardProps) {}

  static create(props: CreditCardProps): CreditCardModel {
    if (!props.name?.trim()) throw new Error('Credit card name is required');
    if (props.closingDay < 1 || props.closingDay > 31) throw new Error('Invalid closing day');
    if (props.dueDay < 1 || props.dueDay > 31) throw new Error('Invalid due day');
    return new CreditCardModel(props);
  }
}
