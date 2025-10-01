import { CategoryType, CategoryTypeHelper } from './CategoryType';

describe('CategoryType', () => {
  it('should work with CategoryType', () => {
    const type: CategoryType = 'INCOME';
    expect(type).toBe('INCOME');
  });

  it('should validate CategoryType', () => {
    expect(CategoryTypeHelper.isValid('INCOME')).toBe(true);
    expect(CategoryTypeHelper.isValid('INVALID')).toBe(false);
  });

  it('should check if type is income', () => {
    expect(CategoryTypeHelper.isIncome('INCOME')).toBe(true);
    expect(CategoryTypeHelper.isIncome('EXPENSE')).toBe(false);
  });
});
