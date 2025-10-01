export type BudgetType = 'PERSONAL' | 'SHARED';

export class BudgetTypeHelper {
  static isValid(type: unknown): type is BudgetType {
    return typeof type === 'string' && ['PERSONAL', 'SHARED'].includes(type);
  }

  static getValues(): BudgetType[] {
    return ['PERSONAL', 'SHARED'];
  }

  static isPersonal(type: BudgetType): boolean {
    return type === 'PERSONAL';
  }

  static isShared(type: BudgetType): boolean {
    return type === 'SHARED';
  }

  static getDisplayName(type: BudgetType): string {
    switch (type) {
      case 'PERSONAL':
        return 'Personal';
      case 'SHARED':
        return 'Compartilhado';
      default:
        return 'Desconhecido';
    }
  }

  static getDescription(type: BudgetType): string {
    switch (type) {
      case 'PERSONAL':
        return 'Orçamento pessoal para uso individual';
      case 'SHARED':
        return 'Orçamento compartilhado para uso em grupo';
      default:
        return 'Tipo de orçamento desconhecido';
    }
  }
}
