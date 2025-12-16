import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { OsBadgeComponent } from '../../atoms/os-badge/os-badge.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsCardComponent } from '../../molecules/os-card/os-card.component';
import { OsMoneyDisplayComponent } from '../../molecules/os-money-display/os-money-display.component';

export interface BudgetSummaryData {
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
}

@Component({
  selector: 'os-budget-summary',
  standalone: true,
  imports: [
    OsCardComponent,
    OsMoneyDisplayComponent,
    OsBadgeComponent,
    OsIconComponent
],
  templateUrl: './os-budget-summary.component.html',
  styleUrls: ['./os-budget-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsBudgetSummaryComponent {
  
  budgetData = input.required<BudgetSummaryData | null>();
  variant = input<'default' | 'compact' | 'detailed'>('default');
  size = input<'small' | 'medium' | 'large'>('medium');
  showProgress = input<boolean>(true);
  showStatus = input<boolean>(true);
  showDates = input<boolean>(false);
  clickable = input<boolean>(false);
  showChart = input<boolean>(true);
  loading = input<boolean>(false);
  highlightTotals = input<boolean>(true);
  animated = input<boolean>(true);
  ariaLabel = input<string>('');
  ariaDescribedBy = input<string>('');
  
  cardClicked = output<BudgetSummaryData>();
  chartClicked = output<{ type: 'pie' | 'bar'; data: BudgetSummaryData }>();
  
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

  readonly formattedDates = computed(() => {
    const data = this.budgetData();
    if (!data || !this.showDates()) return null;

    return {
      start: data.startDate.toLocaleDateString('pt-BR'),
      end: data.endDate.toLocaleDateString('pt-BR'),
      lastUpdated: data.lastUpdated.toLocaleDateString('pt-BR'),
    };
  });

  readonly chartData = computed(() => {
    const data = this.budgetData();
    if (!data || !this.showChart()) return null;

    const spent = data.spentAmount;
    const remaining = Math.max(0, data.remainingAmount);
    const overBudget = Math.max(0, data.spentAmount - data.totalBudget);

    return {
      spent: {
        value: spent,
        percentage: (spent / data.totalBudget) * 100,
        color: 'var(--os-color-primary)',
      },
      remaining: {
        value: remaining,
        percentage: (remaining / data.totalBudget) * 100,
        color: 'var(--os-color-success)',
      },
      overBudget: {
        value: overBudget,
        percentage: (overBudget / data.totalBudget) * 100,
        color: 'var(--os-color-error)',
      },
    };
  });

  readonly effectiveAriaLabel = computed(() => {
    const data = this.budgetData();
    if (!data) return this.ariaLabel() || 'Resumo de orçamento';

    const customLabel = this.ariaLabel();
    if (customLabel) return customLabel;

    return `Resumo do orçamento ${data.name}: ${data.percentage}% utilizado, ${data.status}`;
  });

  readonly cardClasses = computed(() => {
    const variant = this.variant();
    const size = this.size();
    const clickable = this.clickable();
    const loading = this.loading();
    const animated = this.animated();

    return [
      'os-budget-summary',
      `os-budget-summary--${variant}`,
      `os-budget-summary--${size}`,
      clickable ? 'os-budget-summary--clickable' : '',
      loading ? 'os-budget-summary--loading' : '',
      animated ? 'os-budget-summary--animated' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });
  
  onCardClick(): void {
    if (this.clickable() && this.budgetData()) {
      this.cardClicked.emit(this.budgetData()!);
    }
  }

  onChartClick(type: 'pie' | 'bar'): void {
    if (this.budgetData()) {
      this.chartClicked.emit({ type, data: this.budgetData()! });
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

  getTotalHighlightClass(): string {
    if (!this.highlightTotals()) return '';
    return 'os-budget-summary__total--highlighted';
  }

  getChartType(): 'pie' | 'bar' {
    return this.variant() === 'compact' ? 'pie' : 'bar';
  }
}
