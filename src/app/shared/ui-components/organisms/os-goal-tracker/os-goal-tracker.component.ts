import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { OsBadgeComponent } from '../../atoms/os-badge/os-badge.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsProgressBarComponent } from '../../atoms/os-progress-bar/os-progress-bar.component';
import { OsSpinnerComponent } from '../../atoms/os-spinner/os-spinner.component';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsCardComponent } from '../../molecules/os-card/os-card.component';
import { OsMoneyDisplayComponent } from '../../molecules/os-money-display/os-money-display.component';
import { OsDropdownComponent } from '../../molecules/os-dropdown/os-dropdown.component';

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
    OsButtonComponent,
    OsDropdownComponent,
  ],
  templateUrl: './os-goal-tracker.component.html',
  styleUrls: ['./os-goal-tracker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsGoalTrackerComponent implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);

  goalData = input.required<GoalTrackerData | null>();
  variant = input<'default' | 'compact' | 'detailed'>('default');
  size = input<'small' | 'medium' | 'large'>('medium');
  theme = input<'light' | 'dark'>('light');
  showTimeline = input<boolean>(true);
  showHistory = input<boolean>(true);
  showContribution = input<boolean>(true);
  showStatus = input<boolean>(true);
  showQuickActions = input<boolean>(true);
  showFilters = input<boolean>(true);
  showPriority = input<boolean>(true);
  loading = input<boolean>(false);
  clickable = input<boolean>(false);
  enableHapticFeedback = input<boolean>(true);

  readonly goalClick = output<GoalTrackerData>();
  readonly refreshClick = output<void>();
  readonly actionClick = output<{ action: string; goal: GoalTrackerData }>();
  readonly filterChange = output<{ status: string; priority: string }>();
  readonly priorityChange = output<{ goalId: string; priority: string }>();

  readonly ariaLabel = input<string | null>(null);

  readonly isMobile = signal(false);
  readonly selectedStatus = signal<string>('all');
  readonly selectedPriority = signal<string>('all');
  readonly showQuickActionsMenu = signal(false);
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

    return data.progressHistory.slice(-3).reverse();
  });

  readonly contributionInfo = computed(() => {
    const data = this.goalData();
    if (!data || !this.showContribution() || !data.monthlyContribution) return null;

    const remaining = this.remainingAmount();
    const monthsNeeded = Math.ceil(remaining / data.monthlyContribution);

    return {
      monthly: data.monthlyContribution,
      monthsNeeded,
      isFeasible: monthsNeeded <= 12,
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

    const data = this.goalData();
    if (data?.priority === 'high') {
      classes.push('os-goal-tracker--high-priority');
    }

    if (this.isMobile()) {
      classes.push('os-goal-tracker--mobile');
    }

    return classes.join(' ');
  });

  readonly quickActions = computed(() => {
    const data = this.goalData();
    if (!data) return [];

    const actions = [
      { id: 'refresh', label: 'Atualizar', icon: 'refresh', variant: 'secondary' as const },
    ];

    if (data.status === 'active') {
      actions.push(
        { id: 'pause', label: 'Pausar', icon: 'pause', variant: 'secondary' as const },
        {
          id: 'add_contribution',
          label: 'Adicionar Contribuição',
          icon: 'add',
          variant: 'secondary' as const,
        }
      );
    }

    if (data.status === 'paused') {
      actions.push({
        id: 'resume',
        label: 'Retomar',
        icon: 'play_arrow',
        variant: 'secondary' as const,
      });
    }

    if (!this.isCompleted()) {
      actions.push({
        id: 'cancel',
        label: 'Cancelar',
        icon: 'cancel',
        variant: 'secondary' as const,
      });
    }

    return actions;
  });

  readonly statusFilterOptions = computed(() => [
    { value: 'all', label: 'Todos os Status', icon: 'filter_list' },
    { value: 'active', label: 'Ativos', icon: 'play_circle' },
    { value: 'completed', label: 'Concluídos', icon: 'check_circle' },
    { value: 'paused', label: 'Pausados', icon: 'pause_circle' },
    { value: 'cancelled', label: 'Cancelados', icon: 'cancel' },
  ]);

  readonly priorityFilterOptions = computed(() => [
    { value: 'all', label: 'Todas as Prioridades', icon: 'filter_list' },
    { value: 'high', label: 'Alta Prioridade', icon: 'priority_high' },
    { value: 'medium', label: 'Média Prioridade', icon: 'remove' },
    { value: 'low', label: 'Baixa Prioridade', icon: 'keyboard_arrow_down' },
  ]);

  readonly priorityVisual = computed(() => {
    const data = this.goalData();
    if (!data) return { level: 0, color: 'var(--os-color-gray-400)', icon: 'remove' };

    switch (data.priority) {
      case 'high':
        return { level: 3, color: 'var(--os-color-error)', icon: 'priority_high' };
      case 'medium':
        return { level: 2, color: 'var(--os-color-warning)', icon: 'remove' };
      case 'low':
        return { level: 1, color: 'var(--os-color-success)', icon: 'keyboard_arrow_down' };
      default:
        return { level: 0, color: 'var(--os-color-gray-400)', icon: 'remove' };
    }
  });

  readonly isUrgent = computed(() => {
    const data = this.goalData();
    if (!data) return false;
    return data.priority === 'high' && (this.isOverdue() || this.progressPercentage() < 25);
  });

  readonly accessibilityAttributes = computed(() => {
    const data = this.goalData();
    if (!data) return {};

    return {
      role: 'region',
      'aria-label': `Meta: ${data.title}`,
      'aria-describedby': `goal-${data.id}-description`,
      'aria-live': this.isUrgent() ? 'assertive' : 'polite',
    };
  });

  readonly cardVariant = computed(() => {
    const data = this.goalData();
    if (!data) return 'default';

    if (this.isCompleted()) return 'elevated';
    if (this.isOverdue()) return 'outlined';
    if (data.priority === 'high') return 'elevated';
    return 'default';
  });

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

  onQuickAction(actionId: string): void {
    const data = this.goalData();
    if (!data) return;

    this.triggerHapticFeedback();
    this.actionClick.emit({ action: actionId, goal: data });
  }

  onStatusFilterChange(event: string | number | boolean): void {
    const status = String(event);
    this.selectedStatus.set(status);
    this.triggerHapticFeedback();
    this.filterChange.emit({ status, priority: this.selectedPriority() });
  }

  onPriorityFilterChange(event: string | number | boolean): void {
    const priority = String(event);
    this.selectedPriority.set(priority);
    this.triggerHapticFeedback();
    this.filterChange.emit({ status: this.selectedStatus(), priority });
  }

  onPriorityChange(priority: string): void {
    const data = this.goalData();
    if (!data) return;

    this.triggerHapticFeedback();
    this.priorityChange.emit({ goalId: data.id, priority });
  }

  toggleQuickActionsMenu(): void {
    this.showQuickActionsMenu.set(!this.showQuickActionsMenu());
    this.triggerHapticFeedback();
  }

  private triggerHapticFeedback(): void {
    if (!this.enableHapticFeedback()) return;

    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe((result) => {
        this.isMobile.set(result.matches);
      });
  }
}
