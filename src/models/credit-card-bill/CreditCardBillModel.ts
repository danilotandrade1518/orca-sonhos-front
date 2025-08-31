import { Money } from '../shared/value-objects/Money';
import { Uuid } from '../shared/value-objects/Uuid';

export interface CreditCardBillProps {
  id: Uuid;
  creditCardId: Uuid;
  closingDate: Date;
  dueDate: Date;
  amount: Money;
  paid?: boolean;
}

export class CreditCardBillModel {
  private constructor(private props: CreditCardBillProps) {}

  static create(props: CreditCardBillProps): CreditCardBillModel {
    if (props.dueDate < props.closingDate) throw new Error('Due date before closing date');
    return new CreditCardBillModel({ ...props, paid: !!props.paid });
  }

  markPaid() {
    this.props.paid = true;
  }

  reopen(justification: string) {
    if (!justification?.trim()) throw new Error('Justification required');
    this.props.paid = false;
  }
}
