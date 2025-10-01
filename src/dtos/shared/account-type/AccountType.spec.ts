import { AccountType, AccountTypeHelper } from './AccountType';

describe('AccountType', () => {
  it('should work with AccountType', () => {
    const type: AccountType = 'checking';
    expect(type).toBe('checking');
  });

  it('should validate AccountType', () => {
    expect(AccountTypeHelper.isValid('checking')).toBe(true);
    expect(AccountTypeHelper.isValid('INVALID')).toBe(false);
  });

  it('should check if type is bank account', () => {
    expect(AccountTypeHelper.isBankAccount('checking')).toBe(true);
    expect(AccountTypeHelper.isBankAccount('cash')).toBe(false);
  });
});
