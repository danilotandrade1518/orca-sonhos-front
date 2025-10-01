import { TransactionType, TransactionTypeHelper } from './TransactionType';

describe('TransactionType', () => {
  it('should work with TransactionType', () => {
    const type: TransactionType = 'INCOME';
    expect(type).toBe('INCOME');
  });

  it('should validate TransactionType', () => {
    expect(TransactionTypeHelper.isValid('INCOME')).toBe(true);
    expect(TransactionTypeHelper.isValid('INVALID')).toBe(false);
  });

  it('should get correct labels', () => {
    expect(TransactionTypeHelper.getLabel('INCOME')).toBe('Receita');
    expect(TransactionTypeHelper.getLabel('EXPENSE')).toBe('Despesa');
    expect(TransactionTypeHelper.getLabel('TRANSFER')).toBe('Transferência');
  });

  it('should check if type is incoming', () => {
    expect(TransactionTypeHelper.isIncoming('INCOME')).toBe(true);
    expect(TransactionTypeHelper.isIncoming('EXPENSE')).toBe(false);
  });
});
