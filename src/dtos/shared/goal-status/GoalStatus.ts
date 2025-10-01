export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';

export class GoalStatusHelper {
  static readonly ALL_STATUSES: readonly GoalStatus[] = [
    'active',
    'completed',
    'paused',
    'cancelled',
  ] as const;

  static isValid(value: unknown): value is GoalStatus {
    return typeof value === 'string' && this.ALL_STATUSES.includes(value as GoalStatus);
  }

  static getLabel(status: GoalStatus): string {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'completed':
        return 'Concluído';
      case 'paused':
        return 'Pausado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  }

  static getLabelEn(status: GoalStatus): string {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'paused':
        return 'Paused';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  static getIcon(status: GoalStatus): string {
    switch (status) {
      case 'active':
        return 'play_circle';
      case 'completed':
        return 'check_circle';
      case 'paused':
        return 'pause_circle';
      case 'cancelled':
        return 'cancel';
      default:
        return 'help_outline';
    }
  }

  static getColorClass(status: GoalStatus): string {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'completed':
        return 'text-blue-600';
      case 'paused':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  }

  static isActive(status: GoalStatus): boolean {
    return status === 'active';
  }

  static isCompleted(status: GoalStatus): boolean {
    return status === 'completed';
  }

  static isPaused(status: GoalStatus): boolean {
    return status === 'paused';
  }

  static isCancelled(status: GoalStatus): boolean {
    return status === 'cancelled';
  }

  static canContribute(status: GoalStatus): boolean {
    return status === 'active' || status === 'paused';
  }

  static canModify(status: GoalStatus): boolean {
    return status === 'active' || status === 'paused';
  }

  static isFinal(status: GoalStatus): boolean {
    return status === 'completed' || status === 'cancelled';
  }

  static getNextStatuses(currentStatus: GoalStatus): GoalStatus[] {
    switch (currentStatus) {
      case 'active':
        return ['completed', 'paused', 'cancelled'];
      case 'paused':
        return ['active', 'cancelled'];
      case 'completed':
        return [];
      case 'cancelled':
        return [];
      default:
        return [];
    }
  }

  static getOperationalStatuses(): GoalStatus[] {
    return ['active', 'paused'];
  }

  static getFinalStatuses(): GoalStatus[] {
    return ['completed', 'cancelled'];
  }

  static sortForDisplay(statuses: GoalStatus[]): GoalStatus[] {
    const order: Record<GoalStatus, number> = {
      active: 1,
      paused: 2,
      completed: 3,
      cancelled: 4,
    };

    return [...statuses].sort((a, b) => order[a] - order[b]);
  }

  static getPriority(status: GoalStatus): number {
    switch (status) {
      case 'active':
        return 1;
      case 'paused':
        return 2;
      case 'completed':
        return 3;
      case 'cancelled':
        return 4;
      default:
        return 999;
    }
  }

  static getDefault(): GoalStatus {
    return 'active';
  }
}
