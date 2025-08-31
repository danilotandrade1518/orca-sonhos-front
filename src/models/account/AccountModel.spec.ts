import { AccountModel, AccountType } from './AccountModel';
import { Money } from '../shared/value-objects/Money';
import { Uuid } from '../shared/value-objects/Uuid';

describe('AccountModel', () => {
  const id = Uuid.create('123e4567-e89b-12d3-a456-426614174010');
  const budgetId = Uuid.create('123e4567-e89b-12d3-a456-426614174011');

  it('creates and reconciles', () => {
    const acc = AccountModel.create({
      id,
      budgetId,
      name: 'Checking',
      type: 'checking' as AccountType,
      balance: Money.fromCents(1000),
    });
    acc.reconcile(Money.fromCents(1500));
    expect(acc).toBeTruthy();
  });

  it('rejects empty name', () => {
    expect(() =>
      AccountModel.create({
        id,
        budgetId,
        name: ' ',
        type: 'wallet' as AccountType,
        balance: Money.fromCents(0),
      })
    ).toThrow();
  });
});
