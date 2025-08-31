import { CreditCardBillModel } from './CreditCardBillModel';
import { Money } from '../shared/value-objects/Money';
import { Uuid } from '../shared/value-objects/Uuid';

describe('CreditCardBillModel', () => {
  const id = Uuid.create('123e4567-e89b-12d3-a456-426614174050');
  const ccId = Uuid.create('123e4567-e89b-12d3-a456-426614174051');

  it('creates and toggles paid status', () => {
    const closingDate = new Date('2025-01-10');
    const dueDate = new Date('2025-01-20');
    const bill = CreditCardBillModel.create({
      id,
      creditCardId: ccId,
      closingDate,
      dueDate,
      amount: Money.fromCents(1000),
    });
    bill.markPaid();
    bill.reopen('Need to revert');
    expect(bill).toBeTruthy();
  });

  it('rejects due before closing', () => {
    expect(() =>
      CreditCardBillModel.create({
        id,
        creditCardId: ccId,
        closingDate: new Date('2025-01-20'),
        dueDate: new Date('2025-01-10'),
        amount: Money.fromCents(0),
      })
    ).toThrow();
  });

  it('rejects reopen without justification', () => {
    const closingDate = new Date('2025-01-10');
    const dueDate = new Date('2025-01-20');
    const bill = CreditCardBillModel.create({
      id,
      creditCardId: ccId,
      closingDate,
      dueDate,
      amount: Money.fromCents(1000),
    });
    bill.markPaid();
    expect(() => bill.reopen('  ')).toThrow();
  });
});
