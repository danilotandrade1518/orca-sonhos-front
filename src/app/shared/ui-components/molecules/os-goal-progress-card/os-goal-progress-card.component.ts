import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { OsIconComponent } from '@shared/ui-components/atoms/os-icon/os-icon.component';
import { OsProgressBarComponent } from '@shared/ui-components/atoms/os-progress-bar/os-progress-bar.component';

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
}

export type GoalProgressState = 'default' | 'completed' | 'overdue' | 'loading';

@Component({
  selector: 'os-goal-progress-card',
  standalone: true,
  imports: [CommonModule, OsIconComponent, OsProgressBarComponent],
  template: `
    <div
      class="os-goal-progress-card"
      [class]="containerClass()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-describedby]="descriptionId()"
      role="region"
      tabindex="0"
      (click)="onCardClick()"
      (keydown)="onKeyDown($event)"
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
          } @else {
          <os-icon
            [name]="getPriorityIcon()"
            size="sm"
            [variant]="getPriorityVariant()"
            [ariaLabel]="getPriorityLabel()"
          />
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
          <span class="os-goal-progress-card__value-label">Atual</span>
          <span class="os-goal-progress-card__value" [attr.aria-label]="getCurrentValueAriaLabel()">
            {{ formatValue(goalData()?.currentValue || 0) }} {{ goalData()?.unit }}
          </span>
        </div>
        <div class="os-goal-progress-card__target">
          <span class="os-goal-progress-card__value-label">Meta</span>
          <span class="os-goal-progress-card__value" [attr.aria-label]="getTargetValueAriaLabel()">
            {{ formatValue(goalData()?.targetValue || 0) }} {{ goalData()?.unit }}
          </span>
        </div>
        <div class="os-goal-progress-card__remaining">
          <span class="os-goal-progress-card__value-label">Restante</span>
          <span
            class="os-goal-progress-card__value"
            [attr.aria-label]="getRemainingValueAriaLabel()"
          >
            {{ formatValue(remainingValue()) }} {{ goalData()?.unit }}
          </span>
        </div>
      </div>

      @if (goalData()?.deadline) {
      <div class="os-goal-progress-card__deadline">
        <os-icon name="calendar" size="xs" variant="default" aria-hidden="true" />
        <span class="os-goal-progress-card__deadline-text">
          Prazo: {{ formatDeadline(goalData()?.deadline) }}
        </span>
      </div>
      } }
    </div>
  `,
  styleUrls: ['./os-goal-progress-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsGoalProgressCardComponent {
  
  readonly goalData = input<GoalProgressData | null>(null);
  readonly variant = input<'default' | 'compact' | 'extended'>('default');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly state = input<GoalProgressState>('default');
  readonly ariaLabel = input<string>('Card de progresso da meta');
  
  readonly cardClick = output<GoalProgressData>();
  readonly cardExpand = output<GoalProgressData>();
  
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
  
  getPriorityIcon(): string {
    const priority = this.goalData()?.priority;
    switch (priority) {
      case 'high':
        return 'flag';
      case 'medium':
        return 'star';
      case 'low':
        return 'bookmark';
      default:
        return 'flag';
    }
  }

  getPriorityVariant():
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info' {
    const priority = this.goalData()?.priority;
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  }

  getPriorityLabel(): string {
    const priority = this.goalData()?.priority;
    switch (priority) {
      case 'high':
        return 'Prioridade alta';
      case 'medium':
        return 'Prioridade média';
      case 'low':
        return 'Prioridade baixa';
      default:
        return 'Prioridade';
    }
  }

  getProgressVariant(): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' {
    if (this.isCompleted()) return 'success';
    if (this.isOverdue()) return 'danger';
    if (this.progressPercentage() >= 90) return 'warning';
    return 'primary';
  }

  getProgressAriaLabel(): string {
    const percentage = Math.round(this.progressPercentage());
    return `Progresso da meta: ${percentage}%`;
  }

  getCurrentValueAriaLabel(): string {
    const data = this.goalData();
    return `Valor atual: ${this.formatValue(data?.currentValue || 0)} ${data?.unit || ''}`;
  }

  getTargetValueAriaLabel(): string {
    const data = this.goalData();
    return `Valor da meta: ${this.formatValue(data?.targetValue || 0)} ${data?.unit || ''}`;
  }

  getRemainingValueAriaLabel(): string {
    const data = this.goalData();
    return `Valor restante: ${this.formatValue(this.remainingValue())} ${data?.unit || ''}`;
  }

  formatValue(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  formatDeadline(date: Date | undefined): string {
    if (!date) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  onCardClick(): void {
    const data = this.goalData();
    if (data && !this.isLoading()) {
      this.cardClick.emit(data);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const data = this.goalData();
      if (data && !this.isLoading()) {
        this.cardExpand.emit(data);
      }
    }
  }
}
