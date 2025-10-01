import { BudgetStatus, BudgetStatusHelper } from './BudgetStatus';

describe('BudgetStatus', () => {
  it('should work with BudgetStatus', () => {
    const status: BudgetStatus = 'ACTIVE';
    expect(status).toBe('ACTIVE');
  });

  it('should validate BudgetStatus', () => {
    expect(BudgetStatusHelper.isValid('ACTIVE')).toBe(true);
    expect(BudgetStatusHelper.isValid('INVALID')).toBe(false);
  });

  it('should check if status allows modifications', () => {
    expect(BudgetStatusHelper.canModify('ACTIVE')).toBe(true);
    expect(BudgetStatusHelper.canModify('ARCHIVED')).toBe(false);
  });
});
