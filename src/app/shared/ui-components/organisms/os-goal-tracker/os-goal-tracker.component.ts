import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { OsBadgeComponent } from '../../atoms/os-badge/os-badge.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsProgressBarComponent } from '../../atoms/os-progress-bar/os-progress-bar.component';
import { OsSpinnerComponent } from '../../atoms/os-spinner/os-spinner.component';
import { OsCardComponent } from '../../molecules/os-card/os-card.component';
import { OsMoneyDisplayComponent } from '../../molecules/os-money-display/os-money-display.component';

export interface GoalTrackerData {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline?: Date;
  startDate: Date;
  lastUpdated: Date;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  category?: string;
  monthlyContribution?: number;
  progressHistory: ProgressHistory[];
}

export interface ProgressHistory {
  date: Date;
  amount: number;
  percentage: number;
  note?: string;
}

@Component({
  selector: 'os-goal-tracker',
  standalone: true,
  imports: [
    CommonModule,
    OsCardComponent,
    OsMoneyDisplayComponent,
    OsBadgeComponent,
    OsIconComponent,
    OsProgressBarComponent,
    OsSpinnerComponent,
  ],
  templateUrl: './os-goal-tracker.component.html',
  styleUrls: ['./os-goal-tracker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsGoalTrackerComponent {
  // Inputs
  goalData = input.required<GoalTrackerData | null>();
  variant = input<'default' | 'compact' | 'detailed'>('default');
  size = input<'small' | 'medium' | 'large'>('medium');
  theme = input<'light' | 'dark'>('light');
  showTimeline = input<boolean>(true);
  showHistory = input<boolean>(true);
  showContribution = input<boolean>(true);
  showStatus = input<boolean>(true);
  loading = input<boolean>(false);
  clickable = input<boolean>(false);

  // Outputs
  readonly goalClick = output<GoalTrackerData>();
  readonly refreshClick = output<void>();
  readonly actionClick = output<{ action: string; goal: GoalTrackerData }>();

  // Additional properties for template
  readonly ariaLabel = input<string | null>(null);

  // Computed properties
  readonly progressPercentage = computed(() => {
    const data = this.goalData();
    if (!data || data.targetAmount <= 0) return 0;
    return Math.min(Math.round((data.currentAmount / data.targetAmount) * 100), 100);
  });

  readonly remainingAmount = computed(() => {
    const data = this.goalData();
    if (!data) return 0;
    return Math.max(data.targetAmount - data.currentAmount, 0);
  });

  readonly isCompleted = computed(() => {
    const data = this.goalData();
    return data ? data.status === 'completed' || this.progressPercentage() >= 100 : false;
  });

  readonly isOverdue = computed(() => {
    const data = this.goalData();
    if (!data || !data.deadline || this.isCompleted()) return false;
    return new Date() > data.deadline;
  });

  readonly statusInfo = computed(() => {
    const data = this.goalData();
    if (!data) return { type: 'info' as const, label: 'N/A', icon: 'info' };

    switch (data.status) {
      case 'active':
        return this.isOverdue()
          ? { type: 'error' as const, label: 'Atrasado', icon: 'warning' }
          : { type: 'success' as const, label: 'Ativo', icon: 'play_circle' };
      case 'completed':
        return { type: 'success' as const, label: 'Concluído', icon: 'check_circle' };
      case 'paused':
        return { type: 'warning' as const, label: 'Pausado', icon: 'pause_circle' };
      case 'cancelled':
        return { type: 'error' as const, label: 'Cancelado', icon: 'cancel' };
      default:
        return { type: 'info' as const, label: 'N/A', icon: 'info' };
    }
  });

  readonly priorityInfo = computed(() => {
    const data = this.goalData();
    if (!data) return { type: 'info' as const, label: 'N/A', color: 'var(--os-color-info)' };

    switch (data.priority) {
      case 'high':
        return { type: 'error' as const, label: 'Alta', color: 'var(--os-color-error)' };
      case 'medium':
        return { type: 'warning' as const, label: 'Média', color: 'var(--os-color-warning)' };
      case 'low':
        return { type: 'success' as const, label: 'Baixa', color: 'var(--os-color-success)' };
      default:
        return { type: 'info' as const, label: 'N/A', color: 'var(--os-color-info)' };
    }
  });

  readonly timelineInfo = computed(() => {
    const data = this.goalData();
    if (!data || !this.showTimeline()) return null;

    return {
      start: data.startDate.toLocaleDateString('pt-BR'),
      deadline: data.deadline ? data.deadline.toLocaleDateString('pt-BR') : 'Sem prazo',
      lastUpdated: data.lastUpdated.toLocaleDateString('pt-BR'),
      daysRemaining: this.getDaysRemaining(),
    };
  });

  readonly recentHistory = computed(() => {
    const data = this.goalData();
    if (!data || !this.showHistory()) return [];

    return data.progressHistory.slice(-3).reverse(); // Last 3 entries
  });

  readonly contributionInfo = computed(() => {
    const data = this.goalData();
    if (!data || !this.showContribution() || !data.monthlyContribution) return null;

    const remaining = this.remainingAmount();
    const monthsNeeded = Math.ceil(remaining / data.monthlyContribution);

    return {
      monthly: data.monthlyContribution,
      monthsNeeded,
      isFeasible: monthsNeeded <= 12, // Consider feasible if less than 1 year
    };
  });

  readonly progressVariant = computed(() => {
    if (this.isCompleted()) return 'success';
    if (this.isOverdue()) return 'danger';
    const data = this.goalData();
    if (data?.priority === 'high') return 'warning';
    return 'primary';
  });

  readonly progressSize = computed(() => {
    const sizeMap: Record<string, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  });

  readonly iconSize = computed(() => {
    const sizeMap: Record<string, 'sm' | 'md' | 'lg'> = {
      small: 'sm',
      medium: 'md',
      large: 'lg',
    };
    return sizeMap[this.size()];
  });

  readonly badgeSize = computed(() => {
    const sizeMap: Record<string, 'sm' | 'md' | 'lg'> = {
      small: 'sm',
      medium: 'md',
      large: 'lg',
    };
    return sizeMap[this.size()];
  });

  readonly moneySize = computed(() => {
    const sizeMap: Record<string, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  });

  readonly goalClasses = computed(() => {
    const classes = ['os-goal-tracker'];
    classes.push(`os-goal-tracker--${this.variant()}`);
    classes.push(`os-goal-tracker--${this.size()}`);

    if (this.theme() === 'dark') {
      classes.push('os-goal-tracker--dark');
    }

    if (this.isCompleted()) {
      classes.push('os-goal-tracker--completed');
    }

    if (this.isOverdue()) {
      classes.push('os-goal-tracker--overdue');
    }

    return classes.join(' ');
  });

  readonly cardVariant = computed(() => {
    const data = this.goalData();
    if (!data) return 'default';

    if (this.isCompleted()) return 'elevated';
    if (this.isOverdue()) return 'outlined';
    if (data.priority === 'high') return 'elevated';
    return 'default';
  });

  // Methods
  onCardClick(): void {
    const data = this.goalData();
    if (this.clickable() && data) {
      this.goalClick.emit(data);
    }
  }

  onRefreshClick(): void {
    this.refreshClick.emit();
  }

  onActionClick(action: string): void {
    const data = this.goalData();
    if (data) {
      this.actionClick.emit({ action, goal: data });
    }
  }

  getDaysRemaining(): number {
    const data = this.goalData();
    if (!data || !data.deadline) return 0;

    const now = new Date();
    const diffTime = data.deadline.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  formatHistoryDate(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  getStatusColor(): string {
    const status = this.statusInfo();
    switch (status.type) {
      case 'success':
        return 'var(--os-color-success)';
      case 'warning':
        return 'var(--os-color-warning)';
      case 'error':
        return 'var(--os-color-error)';
      default:
        return 'var(--os-color-info)';
    }
  }
}
