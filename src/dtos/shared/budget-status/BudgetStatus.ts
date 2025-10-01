export type BudgetStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export class BudgetStatusHelper {
  static readonly ALL_STATUSES: readonly BudgetStatus[] = [
    'ACTIVE',
    'INACTIVE',
    'ARCHIVED',
  ] as const;

  static isValid(value: unknown): value is BudgetStatus {
    return typeof value === 'string' && this.ALL_STATUSES.includes(value as BudgetStatus);
  }

  static getLabel(status: BudgetStatus): string {
    switch (status) {
      case 'ACTIVE':
        return 'Ativo';
      case 'INACTIVE':
        return 'Inativo';
      case 'ARCHIVED':
        return 'Arquivado';
      default:
        return 'Desconhecido';
    }
  }

  static getLabelEn(status: BudgetStatus): string {
    switch (status) {
      case 'ACTIVE':
        return 'Active';
      case 'INACTIVE':
        return 'Inactive';
      case 'ARCHIVED':
        return 'Archived';
      default:
        return 'Unknown';
    }
  }

  static getIcon(status: BudgetStatus): string {
    switch (status) {
      case 'ACTIVE':
        return 'check_circle';
      case 'INACTIVE':
        return 'pause_circle';
      case 'ARCHIVED':
        return 'archive';
      default:
        return 'help_outline';
    }
  }

  static getColorClass(status: BudgetStatus): string {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600';
      case 'INACTIVE':
        return 'text-yellow-600';
      case 'ARCHIVED':
        return 'text-gray-600';
      default:
        return 'text-gray-400';
    }
  }

  static isActive(status: BudgetStatus): boolean {
    return status === 'ACTIVE';
  }

  static isInactive(status: BudgetStatus): boolean {
    return status === 'INACTIVE';
  }

  static isArchived(status: BudgetStatus): boolean {
    return status === 'ARCHIVED';
  }

  static canModify(status: BudgetStatus): boolean {
    return status === 'ACTIVE' || status === 'INACTIVE';
  }

  static canTransact(status: BudgetStatus): boolean {
    return status === 'ACTIVE';
  }

  static getNextStatuses(currentStatus: BudgetStatus): BudgetStatus[] {
    switch (currentStatus) {
      case 'ACTIVE':
        return ['INACTIVE', 'ARCHIVED'];
      case 'INACTIVE':
        return ['ACTIVE', 'ARCHIVED'];
      case 'ARCHIVED':
        return [];
      default:
        return [];
    }
  }

  static getOperationalStatuses(): BudgetStatus[] {
    return ['ACTIVE', 'INACTIVE'];
  }

  static getNonOperationalStatuses(): BudgetStatus[] {
    return ['ARCHIVED'];
  }

  static sortForDisplay(statuses: BudgetStatus[]): BudgetStatus[] {
    const order: Record<BudgetStatus, number> = {
      ACTIVE: 1,
      INACTIVE: 2,
      ARCHIVED: 3,
    };

    return [...statuses].sort((a, b) => order[a] - order[b]);
  }

  static getPriority(status: BudgetStatus): number {
    switch (status) {
      case 'ACTIVE':
        return 1;
      case 'INACTIVE':
        return 2;
      case 'ARCHIVED':
        return 3;
      default:
        return 999;
    }
  }
}
