import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  effect,
  inject,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { OsBadgeComponent } from '../../atoms/os-badge/os-badge.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsProgressBarComponent } from '../../atoms/os-progress-bar/os-progress-bar.component';
import { OsSpinnerComponent } from '../../atoms/os-spinner/os-spinner.component';
import { OsCardComponent } from '../../molecules/os-card/os-card.component';
import { OsMoneyDisplayComponent } from '../../molecules/os-money-display/os-money-display.component';

export interface BudgetTrackerData {
  id: string;
  name: string;
  totalBudget: number;
  spentAmount: number;
  remainingAmount: number;
  percentage: number;
  status: 'on-track' | 'over-budget' | 'under-budget' | 'completed';
  category: string;
  startDate: Date;
  endDate: Date;
  lastUpdated: Date;
  monthlySpending: MonthlySpending[];
  trends: BudgetTrends;
  categoryColor?: string;
  categoryIcon?: string;
  alertThreshold?: number;
  isUrgent?: boolean;
}

export interface MonthlySpending {
  month: string;
  year: number;
  amount: number;
  percentage: number;
}

export interface BudgetTrends {
  spendingTrend: 'increasing' | 'decreasing' | 'stable';
  projection: number;
  riskLevel: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'os-budget-tracker',
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
  templateUrl: './os-budget-tracker.component.html',
  styleUrls: ['./os-budget-tracker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsBudgetTrackerComponent {
  private breakpointObserver = inject(BreakpointObserver);

  constructor() {
    effect(() => {
      this.breakpointObserver
        .observe([Breakpoints.Handset, Breakpoints.Tablet])
        .subscribe((result) => {
          this.isMobile.set(result.matches);
        });
    });
  }
  isMobile = signal<boolean>(false);

  budgetData = input.required<BudgetTrackerData | null>();
  variant = input<'default' | 'compact' | 'detailed'>('default');
  size = input<'small' | 'medium' | 'large'>('medium');
  showCharts = input<boolean>(true);
  showTrends = input<boolean>(true);
  showProjections = input<boolean>(true);
  showStatus = input<boolean>(true);
  loading = input<boolean>(false);
  clickable = input<boolean>(false);
  showAlerts = input<boolean>(true);
  enableDrillDown = input<boolean>(true);
  alertThreshold = input<number>(80);

  readonly budgetClick = output<BudgetTrackerData>();
  readonly refreshClick = output<void>();
  readonly exportClick = output<void>();
  readonly categoryClick = output<{ category: string; data: BudgetTrackerData }>();
  readonly alertClick = output<{
    type: 'over-budget' | 'urgent' | 'threshold';
    data: BudgetTrackerData;
  }>();

  readonly progressPercentage = computed(() => {
    const data = this.budgetData();
    return data ? Math.min(Math.max(data.percentage, 0), 100) : 0;
  });

  readonly statusInfo = computed(() => {
    const data = this.budgetData();
    if (!data) return { type: 'info' as const, label: 'N/A', icon: 'info' };

    switch (data.status) {
      case 'on-track':
        return { type: 'success' as const, label: 'No Prazo', icon: 'check_circle' };
      case 'over-budget':
        return { type: 'error' as const, label: 'Acima do Orçamento', icon: 'warning' };
      case 'under-budget':
        return { type: 'warning' as const, label: 'Abaixo do Orçamento', icon: 'info' };
      case 'completed':
        return { type: 'success' as const, label: 'Concluído', icon: 'check' };
      default:
        return { type: 'info' as const, label: 'N/A', icon: 'info' };
    }
  });

  readonly isOverBudget = computed(() => {
    const data = this.budgetData();
    return data ? data.spentAmount > data.totalBudget : false;
  });

  readonly isCompleted = computed(() => {
    const data = this.budgetData();
    return data ? data.status === 'completed' : false;
  });

  readonly trendInfo = computed(() => {
    const data = this.budgetData();
    if (!data || !this.showTrends()) return null;

    const trend = data.trends;
    return {
      icon: this.getTrendIcon(trend.spendingTrend),
      label: this.getTrendLabel(trend.spendingTrend),
      color: this.getTrendColor(trend.riskLevel),
      riskLevel: trend.riskLevel,
    };
  });

  readonly projectionInfo = computed(() => {
    const data = this.budgetData();
    if (!data || !this.showProjections()) return null;

    const projection = data.trends.projection;
    const remaining = data.remainingAmount;
    const isProjectedOver = projection > remaining;

    return {
      value: projection,
      isOver: isProjectedOver,
      percentage: data.totalBudget > 0 ? (projection / data.totalBudget) * 100 : 0,
    };
  });

  readonly monthlyData = computed(() => {
    const data = this.budgetData();
    if (!data || !this.showCharts()) return [];

    return data.monthlySpending.slice(-6); // Last 6 months
  });

  readonly formattedDates = computed(() => {
    const data = this.budgetData();
    if (!data) return null;

    return {
      start: data.startDate.toLocaleDateString('pt-BR'),
      end: data.endDate.toLocaleDateString('pt-BR'),
      lastUpdated: data.lastUpdated.toLocaleDateString('pt-BR'),
    };
  });

  readonly alertInfo = computed(() => {
    const data = this.budgetData();
    if (!data || !this.showAlerts()) return null;

    const threshold = this.alertThreshold();
    const isOverBudget = data.spentAmount > data.totalBudget;
    const isOverThreshold = data.percentage >= threshold;
    const isUrgent = data.isUrgent || data.percentage >= 90;

    if (isOverBudget) {
      return {
        type: 'over-budget' as const,
        severity: 'high' as const,
        message: 'Orçamento estourado!',
        icon: 'warning',
        color: 'var(--os-color-error)',
        urgent: true,
      };
    }

    if (isUrgent) {
      return {
        type: 'urgent' as const,
        severity: 'high' as const,
        message: 'Atenção: próximo do limite!',
        icon: 'priority_high',
        color: 'var(--os-color-warning)',
        urgent: true,
      };
    }

    if (isOverThreshold) {
      return {
        type: 'threshold' as const,
        severity: 'medium' as const,
        message: `${threshold}% do orçamento utilizado`,
        icon: 'info',
        color: 'var(--os-color-info)',
        urgent: false,
      };
    }

    return null;
  });

  readonly categoryInfo = computed(() => {
    const data = this.budgetData();
    if (!data) return null;

    return {
      name: data.category,
      color: data.categoryColor || this.getDefaultCategoryColor(data.category),
      icon: data.categoryIcon || this.getDefaultCategoryIcon(data.category),
      clickable: this.enableDrillDown(),
    };
  });

  readonly chartData = computed(() => {
    const data = this.budgetData();
    if (!data || !this.showCharts()) return null;

    return {
      monthly: data.monthlySpending.slice(-6),
      maxValue: Math.max(...data.monthlySpending.map((m) => m.percentage)),
      average:
        data.monthlySpending.reduce((sum, m) => sum + m.percentage, 0) /
        data.monthlySpending.length,
    };
  });

  onCardClick(): void {
    const data = this.budgetData();
    if (this.clickable() && data) {
      this.budgetClick.emit(data);
    }
  }

  onRefreshClick(): void {
    this.refreshClick.emit();
  }

  onExportClick(): void {
    this.exportClick.emit();
  }

  onCategoryClick(): void {
    const data = this.budgetData();
    if (data && this.enableDrillDown()) {
      this.categoryClick.emit({ category: data.category, data });
    }
  }

  onAlertClick(): void {
    const data = this.budgetData();
    const alert = this.alertInfo();
    if (data && alert) {
      this.alertClick.emit({ type: alert.type, data });
    }
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

  private getTrendIcon(trend: string): string {
    switch (trend) {
      case 'increasing':
        return 'trending_up';
      case 'decreasing':
        return 'trending_down';
      case 'stable':
        return 'trending_flat';
      default:
        return 'trending_flat';
    }
  }

  private getTrendLabel(trend: string): string {
    switch (trend) {
      case 'increasing':
        return 'Crescendo';
      case 'decreasing':
        return 'Diminuindo';
      case 'stable':
        return 'Estável';
      default:
        return 'N/A';
    }
  }

  private getTrendColor(riskLevel: string): string {
    switch (riskLevel) {
      case 'low':
        return 'var(--os-color-success)';
      case 'medium':
        return 'var(--os-color-warning)';
      case 'high':
        return 'var(--os-color-error)';
      default:
        return 'var(--os-color-info)';
    }
  }

  getMonthName(month: string): string {
    const months = {
      '01': 'Jan',
      '02': 'Fev',
      '03': 'Mar',
      '04': 'Abr',
      '05': 'Mai',
      '06': 'Jun',
      '07': 'Jul',
      '08': 'Ago',
      '09': 'Set',
      '10': 'Out',
      '11': 'Nov',
      '12': 'Dez',
    };
    return months[month as keyof typeof months] || month;
  }

  getDefaultCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      Alimentação: 'var(--os-color-success)',
      Transporte: 'var(--os-color-primary)',
      Saúde: 'var(--os-color-error)',
      Educação: 'var(--os-color-info)',
      Lazer: 'var(--os-color-warning)',
      Casa: 'var(--os-color-secondary)',
      Geral: 'var(--os-color-text-secondary)',
    };
    return colors[category] || 'var(--os-color-primary)';
  }

  getDefaultCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      Alimentação: 'restaurant',
      Transporte: 'directions_car',
      Saúde: 'local_hospital',
      Educação: 'school',
      Lazer: 'sports_esports',
      Casa: 'home',
      Geral: 'category',
    };
    return icons[category] || 'category';
  }
}
