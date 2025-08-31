import { Transaction } from './Transaction';
import { Money } from '../shared/value-objects/Money';
import { Uuid } from '../shared/value-objects/Uuid';

describe('Transaction', () => {
  const id = Uuid.create('123e4567-e89b-12d3-a456-426614174070');
  const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174071');
  const accountId = Uuid.create('123e4567-e89b-12d3-a456-426614174072');
  const categoryId = Uuid.create('123e4567-e89b-12d3-a456-426614174073');

  it('creates and marks late', () => {
    const t = Transaction.create({
      id,
      budgetId,
      accountId,
      categoryId,
      description: 'Groceries',
      amount: Money.fromCents(1234),
      type: 'debit',
      transactionDate: new Date('2025-01-01'),
    });
    t.markLate(new Date('2025-02-01'));
    expect(t).toBeTruthy();
  });

  it('rejects empty description', () => {
    expect(() =>
      Transaction.create({
        id,
        budgetId,
        accountId,
        categoryId,
        description: ' ',
        amount: Money.fromCents(0),
        type: 'credit',
        transactionDate: new Date('2025-01-01'),
      })
    ).toThrow();
  });
});
