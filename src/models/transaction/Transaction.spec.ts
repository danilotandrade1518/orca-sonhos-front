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

  it('markLate without date keeps previous date but sets isLate', () => {
    const t = Transaction.create({
      id,
      budgetId,
      accountId,
      categoryId,
      description: 'Rent',
      amount: Money.fromCents(9999),
      type: 'debit',
      transactionDate: new Date('2025-03-01'),
    });
    const prev = (t as any).props.transactionDate;
    t.markLate(undefined as unknown as Date);
    expect((t as any).props.isLate).toBeTrue();
    expect((t as any).props.transactionDate).toEqual(prev);
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
