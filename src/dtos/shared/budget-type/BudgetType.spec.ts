import { BudgetType, BudgetTypeHelper } from './BudgetType';

describe('BudgetType', () => {
  describe('BudgetTypeHelper.isValid', () => {
    it('should return true for valid budget types', () => {
      expect(BudgetTypeHelper.isValid('PERSONAL')).toBe(true);
      expect(BudgetTypeHelper.isValid('SHARED')).toBe(true);
    });

    it('should return false for invalid budget types', () => {
      expect(BudgetTypeHelper.isValid('INVALID')).toBe(false);
      expect(BudgetTypeHelper.isValid('')).toBe(false);
      expect(BudgetTypeHelper.isValid(null)).toBe(false);
      expect(BudgetTypeHelper.isValid(undefined)).toBe(false);
      expect(BudgetTypeHelper.isValid(123)).toBe(false);
    });
  });

  describe('BudgetTypeHelper.getValues', () => {
    it('should return all budget type values', () => {
      const values = BudgetTypeHelper.getValues();
      expect(values).toEqual(['PERSONAL', 'SHARED']);
    });
  });

  describe('BudgetTypeHelper.isPersonal', () => {
    it('should return true for PERSONAL type', () => {
      expect(BudgetTypeHelper.isPersonal('PERSONAL')).toBe(true);
    });

    it('should return false for SHARED type', () => {
      expect(BudgetTypeHelper.isPersonal('SHARED')).toBe(false);
    });
  });

  describe('BudgetTypeHelper.isShared', () => {
    it('should return true for SHARED type', () => {
      expect(BudgetTypeHelper.isShared('SHARED')).toBe(true);
    });

    it('should return false for PERSONAL type', () => {
      expect(BudgetTypeHelper.isShared('PERSONAL')).toBe(false);
    });
  });

  describe('BudgetTypeHelper.getDisplayName', () => {
    it('should return correct display names', () => {
      expect(BudgetTypeHelper.getDisplayName('PERSONAL')).toBe('Personal');
      expect(BudgetTypeHelper.getDisplayName('SHARED')).toBe('Compartilhado');
    });
  });

  describe('BudgetTypeHelper.getDescription', () => {
    it('should return correct descriptions', () => {
      expect(BudgetTypeHelper.getDescription('PERSONAL')).toBe(
        'Orçamento pessoal para uso individual'
      );
      expect(BudgetTypeHelper.getDescription('SHARED')).toBe(
        'Orçamento compartilhado para uso em grupo'
      );
    });
  });
});
