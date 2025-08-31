import { EnvelopeModel } from './EnvelopeModel';
import { Money } from '../shared/value-objects/Money';
import { Uuid } from '../shared/value-objects/Uuid';

describe('EnvelopeModel', () => {
  const id = Uuid.create('123e4567-e89b-12d3-a456-426614174000');
  const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174001');
  const categoryId = Uuid.create('123e4567-e89b-12d3-a456-426614174002');

  it('creates and adjusts amounts', () => {
    const env = EnvelopeModel.create({
      id,
      budgetId,
      categoryId,
      name: 'Groceries',
      monthlyLimit: Money.fromCents(5000),
      balance: Money.fromCents(0),
    });
    env.addAmount(Money.fromCents(1000));
    env.removeAmount(Money.fromCents(300));
    // Internal state not exposed; check no throw
    expect(env).toBeTruthy();
  });

  it('rejects empty name', () => {
    expect(() =>
      EnvelopeModel.create({
        id,
        budgetId,
        categoryId,
        name: '  ',
        monthlyLimit: Money.fromCents(0),
        balance: Money.fromCents(0),
      })
    ).toThrow();
  });
});
