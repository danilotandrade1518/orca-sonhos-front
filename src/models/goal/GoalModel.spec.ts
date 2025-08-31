import { GoalModel } from './GoalModel';
import { Money } from '../shared/value-objects/Money';
import { Uuid } from '../shared/value-objects/Uuid';

describe('GoalModel', () => {
  const id = Uuid.create('123e4567-e89b-12d3-a456-426614174060');
  const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174061');

  it('creates and adds amount', () => {
    const g = GoalModel.create({
      id,
      budgetId,
      name: 'Emergency Fund',
      totalAmount: Money.fromCents(100000),
      accumulatedAmount: Money.fromCents(1000),
    });
    g.addAmount(Money.fromCents(500));
    expect(g).toBeTruthy();
  });

  it('rejects empty name', () => {
    expect(() =>
      GoalModel.create({
        id,
        budgetId,
        name: ' ',
        totalAmount: Money.fromCents(0),
        accumulatedAmount: Money.fromCents(0),
      })
    ).toThrow();
  });
});
