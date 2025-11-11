import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, inject } from '@angular/core';

import { OsIconComponent } from '@shared/ui-components/atoms/os-icon/os-icon.component';
import { OsProgressBarComponent } from '@shared/ui-components/atoms/os-progress-bar/os-progress-bar.component';
import { OsMoneyDisplayComponent } from '@shared/ui-components/molecules/os-money-display/os-money-display.component';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsDeleteButtonComponent } from '../../atoms/os-delete-button';
import { LocaleService } from '@shared/formatting';

export interface GoalProgressData {
  id: string;
  title: string;
  description?: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline?: Date;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  suggestedAmount?: number | null;
}

export type GoalProgressState = 'default' | 'completed' | 'overdue' | 'loading';

@Component({
  selector: 'os-goal-progress-card',
  standalone: true,
  imports: [
    CommonModule,
    OsIconComponent,
    OsProgressBarComponent,
    OsMoneyDisplayComponent,
    OsButtonComponent,
    OsDeleteButtonComponent,
  ],
  template: `
    <div
      class="os-goal-progress-card"
      [class]="containerClass()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-describedby]="descriptionId()"
      role="region"
    >
      @if (isLoading()) {
      <div class="os-goal-progress-card__skeleton" aria-hidden="true">
        <div class="os-goal-progress-card__skeleton-header">
          <div class="os-goal-progress-card__skeleton-title"></div>
          <div class="os-goal-progress-card__skeleton-badge"></div>
        </div>
        <div class="os-goal-progress-card__skeleton-content">
          <div class="os-goal-progress-card__skeleton-progress"></div>
          <div class="os-goal-progress-card__skeleton-values"></div>
        </div>
      </div>
      } @else {
      <div class="os-goal-progress-card__header">
        <div class="os-goal-progress-card__title-section">
          <h3 class="os-goal-progress-card__title">{{ goalData()?.title }}</h3>
          @if (goalData()?.category) {
          <span class="os-goal-progress-card__category">{{ goalData()?.category }}</span>
          }
        </div>
        <div class="os-goal-progress-card__status">
          @if (isCompleted()) {
          <os-icon name="check" size="sm" variant="success" [ariaLabel]="'Meta concluída'" />
          } @else if (isOverdue()) {
          <os-icon name="warning" size="sm" variant="error" [ariaLabel]="'Meta atrasada'" />
          }
        </div>
      </div>

      @if (goalData()?.description) {
      <p class="os-goal-progress-card__description" [id]="descriptionId()">
        {{ goalData()?.description }}
      </p>
      }

      <div class="os-goal-progress-card__progress">
        <os-progress-bar
          [value]="progressPercentage()"
          [variant]="getProgressVariant()"
          [ariaLabel]="getProgressAriaLabel()"
        />
      </div>

      <div class="os-goal-progress-card__values">
        <div class="os-goal-progress-card__current">
          <span class="os-goal-progress-card__value-label">Acumulado</span>
          <os-money-display
            [value]="goalData()?.currentValue || 0"
            [currency]="getCurrencyFromUnit()"
            [size]="'xs'"
            [ariaLabel]="getCurrentValueAriaLabel()"
            class="os-goal-progress-card__value"
          />
        </div>
        <div class="os-goal-progress-card__target">
          <span class="os-goal-progress-card__value-label">Meta</span>
          <os-money-display
            [value]="goalData()?.targetValue || 0"
            [currency]="getCurrencyFromUnit()"
            [size]="'xs'"
            [ariaLabel]="getTargetValueAriaLabel()"
            class="os-goal-progress-card__value"
          />
        </div>
        <div class="os-goal-progress-card__remaining">
          <span class="os-goal-progress-card__value-label">Restante</span>
          <os-money-display
            [value]="remainingValue()"
            [currency]="getCurrencyFromUnit()"
            [size]="'xs'"
            [ariaLabel]="getRemainingValueAriaLabel()"
            class="os-goal-progress-card__value"
          />
        </div>
        @if (showSuggestedAmount() && goalData()?.suggestedAmount !== undefined) {
        <div class="os-goal-progress-card__suggested">
          <span class="os-goal-progress-card__value-label">Aporte sugerido</span>
          @if (goalData()?.suggestedAmount === null) {
          <span class="os-goal-progress-card__value-text">—</span>
          } @else {
          <os-money-display
            [value]="goalData()?.suggestedAmount!"
            [currency]="getCurrencyFromUnit()"
            [size]="'xs'"
            [ariaLabel]="getSuggestedAmountAriaLabel()"
            class="os-goal-progress-card__value"
          />
          }
        </div>
        }
      </div>

      @if (goalData()?.deadline) {
      <div class="os-goal-progress-card__deadline">
        <os-icon name="calendar" size="xs" variant="default" aria-hidden="true" />
        <span class="os-goal-progress-card__deadline-text">
          Prazo: {{ formatDeadline(goalData()?.deadline) }}
        </span>
      </div>
      } @if (showActions() && goalData()?.id) {
      <footer class="os-goal-progress-card__actions">
        <os-button
          variant="primary"
          size="small"
          icon="add"
          (buttonClick)="onAportar()"
          [attr.aria-label]="'Aportar na meta ' + goalData()?.title"
        >
          Aportar
        </os-button>
        <os-button
          variant="secondary"
          size="small"
          icon="edit"
          (buttonClick)="onEditar()"
          [attr.aria-label]="'Editar meta ' + goalData()?.title"
        >
          Editar
        </os-button>
        <os-delete-button
          [ariaLabel]="'Excluir meta ' + goalData()?.title"
          (deleteClick)="onExcluir()"
        />
      </footer>
      } }
    </div>
  `,
  styleUrls: ['./os-goal-progress-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsGoalProgressCardComponent {
  private readonly localeService = inject(LocaleService);

  readonly goalData = input<GoalProgressData | null>(null);
  readonly variant = input<'default' | 'compact' | 'extended'>('default');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly state = input<GoalProgressState>('default');
  readonly ariaLabel = input<string>('Card de progresso da meta');
  readonly showActions = input<boolean>(false);
  readonly showSuggestedAmount = input<boolean>(false);

  readonly aportar = output<string>();
  readonly editar = output<string>();
  readonly excluir = output<string>();

  readonly isLoading = computed(() => this.state() === 'loading');
  readonly isCompleted = computed(() => this.state() === 'completed');
  readonly isOverdue = computed(() => this.state() === 'overdue');

  readonly progressPercentage = computed(() => {
    const data = this.goalData();
    if (!data || data.targetValue === 0) return 0;
    return Math.min((data.currentValue / data.targetValue) * 100, 100);
  });

  readonly remainingValue = computed(() => {
    const data = this.goalData();
    if (!data) return 0;
    return Math.max(data.targetValue - data.currentValue, 0);
  });

  readonly containerClass = computed(() => {
    const classes = ['os-goal-progress-card'];

    if (this.variant() !== 'default') {
      classes.push(`os-goal-progress-card--${this.variant()}`);
    }

    if (this.size() !== 'medium') {
      classes.push(`os-goal-progress-card--${this.size()}`);
    }

    if (this.state() !== 'default') {
      classes.push(`os-goal-progress-card--${this.state()}`);
    }

    if (this.isCompleted()) {
      classes.push('os-goal-progress-card--completed');
    }

    if (this.isOverdue()) {
      classes.push('os-goal-progress-card--overdue');
    }

    return classes.join(' ');
  });

  readonly descriptionId = computed(() => `goal-description-${this.goalData()?.id || 'default'}`);

  getProgressVariant(): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' {
    const progress = this.progressPercentage();

    if (progress >= 100) return 'success';
    if (this.isOverdue()) return 'danger';

    if (progress < 33) return 'danger';
    if (progress < 66) return 'warning';
    return 'success';
  }

  getProgressAriaLabel(): string {
    const percentage = Math.round(this.progressPercentage());
    return `Progresso da meta: ${percentage}%`;
  }

  getCurrentValueAriaLabel(): string {
    const data = this.goalData();
    const value = data?.currentValue || 0;
    const currency = this.getCurrencyFromUnit() as 'BRL' | 'USD' | 'EUR' | 'GBP';
    return `Valor atual: ${this.localeService.formatCurrency(value, currency)}`;
  }

  getTargetValueAriaLabel(): string {
    const data = this.goalData();
    const value = data?.targetValue || 0;
    const currency = this.getCurrencyFromUnit() as 'BRL' | 'USD' | 'EUR' | 'GBP';
    return `Valor da meta: ${this.localeService.formatCurrency(value, currency)}`;
  }

  getRemainingValueAriaLabel(): string {
    const value = this.remainingValue();
    const currency = this.getCurrencyFromUnit() as 'BRL' | 'USD' | 'EUR' | 'GBP';
    return `Valor restante: ${this.localeService.formatCurrency(value, currency)}`;
  }

  getSuggestedAmountAriaLabel(): string {
    const value = this.goalData()?.suggestedAmount || 0;
    const currency = this.getCurrencyFromUnit() as 'BRL' | 'USD' | 'EUR' | 'GBP';
    return `Aporte sugerido: ${this.localeService.formatCurrency(value, currency)}`;
  }

  getCurrencyFromUnit(): string {
    const unit = this.goalData()?.unit || 'BRL';
    if (['BRL', 'USD', 'EUR', 'GBP'].includes(unit.toUpperCase())) {
      return unit.toUpperCase();
    }
    return 'BRL';
  }

  formatDeadline(date: Date | undefined): string {
    if (!date) return '';
    return this.localeService.formatDateShort(date);
  }

  onAportar(): void {
    const data = this.goalData();
    if (data?.id) {
      this.aportar.emit(data.id);
    }
  }

  onEditar(): void {
    const data = this.goalData();
    if (data?.id) {
      this.editar.emit(data.id);
    }
  }

  onExcluir(): void {
    const data = this.goalData();
    if (data?.id) {
      this.excluir.emit(data.id);
    }
  }
}
