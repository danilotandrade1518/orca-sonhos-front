import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

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
    CommonModule,
    OsCardComponent,
    OsMoneyDisplayComponent,
    OsBadgeComponent,
    OsIconComponent,
  ],
  templateUrl: './os-budget-summary.component.html',
  styleUrls: ['./os-budget-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsBudgetSummaryComponent {
  // Inputs
  budgetData = input.required<BudgetSummaryData | null>();
  variant = input<'default' | 'compact' | 'detailed'>('default');
  size = input<'small' | 'medium' | 'large'>('medium');
  showProgress = input<boolean>(true);
  showStatus = input<boolean>(true);
  showDates = input<boolean>(false);
  clickable = input<boolean>(false);

  // Computed properties
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

  // Methods
  onCardClick(): void {
    if (this.clickable() && this.budgetData()) {
      // Emit event or handle navigation
      console.log('Budget card clicked:', this.budgetData()?.id);
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
}
