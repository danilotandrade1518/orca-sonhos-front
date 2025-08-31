import { CreditCardModel } from './CreditCardModel';
import { Money } from '../shared/value-objects/Money';
import { Uuid } from '../shared/value-objects/Uuid';

describe('CreditCardModel', () => {
  const id = Uuid.create('123e4567-e89b-12d3-a456-426614174040');
  const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174041');

  it('creates with valid days', () => {
    const c = CreditCardModel.create({
      id,
      budgetId,
      name: 'Visa',
      limit: Money.fromCents(100_00),
      closingDay: 10,
      dueDay: 20,
    });
    expect(c).toBeTruthy();
  });

  it('rejects invalid days', () => {
    expect(() =>
      CreditCardModel.create({
        id,
        budgetId,
        name: 'Visa',
        limit: Money.fromCents(0),
        closingDay: 0,
        dueDay: 32,
      })
    ).toThrow();
  });
});
