import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import {
  BudgetUsageIndicator,
  CashFlowIndicator,
  EmergencyReserveIndicator,
  GoalsOnTrackIndicator,
  HealthIndicatorStatus,
} from '../../types/dashboard.types';
import { OsBadgeComponent } from '@shared/ui-components/atoms/os-badge/os-badge.component';
import { OsIconComponent } from '@shared/ui-components/atoms/os-icon/os-icon.component';
import { OsProgressBarComponent } from '@shared/ui-components/atoms/os-progress-bar/os-progress-bar.component';
import { OsMoneyDisplayComponent } from '@shared/ui-components/molecules/os-money-display/os-money-display.component';

export interface FinancialHealthIndicators {
  budgetUsage: BudgetUsageIndicator | null;
  cashFlow: CashFlowIndicator | null;
  goalsOnTrack: GoalsOnTrackIndicator | null;
  emergencyReserve: EmergencyReserveIndicator | null;
}

@Component({
  selector: 'os-financial-health-indicator',
  standalone: true,
  imports: [
    CommonModule,
    OsBadgeComponent,
    OsIconComponent,
    OsProgressBarComponent,
    OsMoneyDisplayComponent,
  ],
  template: `
    <div class="financial-health-indicator" role="region" [attr.aria-labelledby]="'financial-health-title'">
      <header class="financial-health-indicator__header">
        <h2 id="financial-health-title" class="financial-health-indicator__title">Saúde Financeira</h2>
      </header>

      <div class="financial-health-indicator__grid">
        @if (indicators().budgetUsage) {
        <div class="financial-health-indicator__card" [class]="getCardClass(indicators().budgetUsage!.status)">
          <div class="financial-health-indicator__card-header">
            <os-icon
              [name]="getStatusIcon(indicators().budgetUsage!.status)"
              [size]="'md'"
              [variant]="getStatusIconVariant(indicators().budgetUsage!.status)"
              [ariaHidden]="true"
            />
            <h3 class="financial-health-indicator__card-title">{{ indicators().budgetUsage!.label }}</h3>
          </div>
          <div class="financial-health-indicator__card-content">
            <div class="financial-health-indicator__value">
              <span class="financial-health-indicator__value-number">{{ indicators().budgetUsage!.percentage.toFixed(1) }}%</span>
            </div>
            <os-progress-bar
              [value]="indicators().budgetUsage!.percentage"
              [variant]="getProgressVariant(indicators().budgetUsage!.status)"
              [max]="100"
              [ariaLabel]="'Uso de orçamento: ' + indicators().budgetUsage!.percentage.toFixed(1) + '%'"
            />
            <os-badge
              [variant]="getBadgeVariant(indicators().budgetUsage!.status)"
              [size]="'sm'"
              [text]="getStatusLabel(indicators().budgetUsage!.status)"
              [role]="'status'"
              [ariaLabel]="'Status: ' + getStatusLabel(indicators().budgetUsage!.status)"
            />
            <p class="financial-health-indicator__description">{{ indicators().budgetUsage!.description }}</p>
          </div>
        </div>
        }

        @if (indicators().cashFlow) {
        <div class="financial-health-indicator__card" [class]="getCardClass(indicators().cashFlow!.status)">
          <div class="financial-health-indicator__card-header">
            <os-icon
              [name]="getCashFlowIcon(indicators().cashFlow!.status)"
              [size]="'md'"
              [variant]="getStatusIconVariant(indicators().cashFlow!.status)"
              [ariaHidden]="true"
            />
            <h3 class="financial-health-indicator__card-title">{{ indicators().cashFlow!.label }}</h3>
          </div>
          <div class="financial-health-indicator__card-content">
            <div class="financial-health-indicator__value">
              <span class="financial-health-indicator__value-number">{{ indicators().cashFlow!.ratio.toFixed(1) }}%</span>
            </div>
            <div class="financial-health-indicator__absolute-value">
              <os-money-display
                [value]="indicators().cashFlow!.absoluteValue"
                [currency]="'BRL'"
                [size]="'sm'"
                [variant]="indicators().cashFlow!.absoluteValue >= 0 ? 'positive' : 'negative'"
                [ariaLabel]="'Valor absoluto: ' + indicators().cashFlow!.description"
              />
            </div>
            <os-badge
              [variant]="getBadgeVariant(indicators().cashFlow!.status)"
              [size]="'sm'"
              [text]="getStatusLabel(indicators().cashFlow!.status)"
              [role]="'status'"
              [ariaLabel]="'Status: ' + getStatusLabel(indicators().cashFlow!.status)"
            />
            <p class="financial-health-indicator__description">{{ indicators().cashFlow!.description }}</p>
          </div>
        </div>
        }

        @if (indicators().goalsOnTrack) {
        <div class="financial-health-indicator__card" [class]="getCardClass(indicators().goalsOnTrack!.status)">
          <div class="financial-health-indicator__card-header">
            <os-icon
              [name]="getStatusIcon(indicators().goalsOnTrack!.status)"
              [size]="'md'"
              [variant]="getStatusIconVariant(indicators().goalsOnTrack!.status)"
              [ariaHidden]="true"
            />
            <h3 class="financial-health-indicator__card-title">{{ indicators().goalsOnTrack!.label }}</h3>
          </div>
          <div class="financial-health-indicator__card-content">
            <div class="financial-health-indicator__value">
              <span class="financial-health-indicator__value-number">{{ indicators().goalsOnTrack!.percentage.toFixed(1) }}%</span>
            </div>
            <os-progress-bar
              [value]="indicators().goalsOnTrack!.percentage"
              [variant]="getProgressVariant(indicators().goalsOnTrack!.status)"
              [max]="100"
              [ariaLabel]="'Metas no prazo: ' + indicators().goalsOnTrack!.percentage.toFixed(1) + '%'"
            />
            <os-badge
              [variant]="getBadgeVariant(indicators().goalsOnTrack!.status)"
              [size]="'sm'"
              [text]="indicators().goalsOnTrack!.onTrackCount + ' / ' + indicators().goalsOnTrack!.totalActiveCount"
              [role]="'status'"
              [ariaLabel]="indicators().goalsOnTrack!.onTrackCount + ' de ' + indicators().goalsOnTrack!.totalActiveCount + ' metas no prazo'"
            />
            <p class="financial-health-indicator__description">{{ indicators().goalsOnTrack!.description }}</p>
          </div>
        </div>
        }

        @if (indicators().emergencyReserve) {
        <div class="financial-health-indicator__card" [class]="getCardClass(indicators().emergencyReserve!.status)">
          <div class="financial-health-indicator__card-header">
            <os-icon
              [name]="getStatusIcon(indicators().emergencyReserve!.status)"
              [size]="'md'"
              [variant]="getStatusIconVariant(indicators().emergencyReserve!.status)"
              [ariaHidden]="true"
            />
            <h3 class="financial-health-indicator__card-title">{{ indicators().emergencyReserve!.label }}</h3>
          </div>
          <div class="financial-health-indicator__card-content">
            <div class="financial-health-indicator__value">
              <span class="financial-health-indicator__value-number">{{ indicators().emergencyReserve!.monthsCovered.toFixed(1) }}</span>
              <span class="financial-health-indicator__value-unit">meses</span>
            </div>
            <os-badge
              [variant]="getBadgeVariant(indicators().emergencyReserve!.status)"
              [size]="'sm'"
              [text]="getStatusLabel(indicators().emergencyReserve!.status)"
              [role]="'status'"
              [ariaLabel]="'Status: ' + getStatusLabel(indicators().emergencyReserve!.status)"
            />
            <p class="financial-health-indicator__description">{{ indicators().emergencyReserve!.description }}</p>
          </div>
        </div>
        }
      </div>

      @if (hasNoIndicators()) {
      <div class="financial-health-indicator__empty" role="status">
        <p>Não há dados suficientes para calcular os indicadores de saúde financeira.</p>
      </div>
      }
    </div>
  `,
  styleUrls: ['./financial-health-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialHealthIndicatorComponent {
  indicators = input.required<FinancialHealthIndicators>();

  hasNoIndicators = computed(() => {
    const ind = this.indicators();
    return !ind.budgetUsage && !ind.cashFlow && !ind.goalsOnTrack && !ind.emergencyReserve;
  });

  getCardClass(status: HealthIndicatorStatus): string {
    return `financial-health-indicator__card--${status}`;
  }

  getStatusIcon(status: HealthIndicatorStatus): string {
    switch (status) {
      case 'healthy':
        return 'check-circle';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'info';
    }
  }

  getCashFlowIcon(status: HealthIndicatorStatus): string {
    switch (status) {
      case 'healthy':
        return 'trending-up';
      case 'warning':
        return 'trending-flat';
      case 'critical':
        return 'trending-down';
      default:
        return 'info';
    }
  }

  getStatusIconVariant(status: HealthIndicatorStatus): 'success' | 'warning' | 'error' | 'default' {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  }

  getBadgeVariant(status: HealthIndicatorStatus): 'success' | 'warning' | 'error' | 'default' {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
      default:
        return 'default';
    }
  }

  getProgressVariant(status: HealthIndicatorStatus): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'danger';
      default:
        return 'primary';
    }
  }

  getStatusLabel(status: HealthIndicatorStatus): string {
    switch (status) {
      case 'healthy':
        return 'Saudável';
      case 'warning':
        return 'Atenção';
      case 'critical':
        return 'Crítico';
      default:
        return 'Indefinido';
    }
  }
}
