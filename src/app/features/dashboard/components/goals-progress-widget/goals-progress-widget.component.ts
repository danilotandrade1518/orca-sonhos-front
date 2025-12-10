import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { GoalDto } from '../../../../../dtos/goal/goal-types/goal-types';
import { OsButtonComponent } from '@shared/ui-components/atoms/os-button/os-button.component';
import { OsIconComponent } from '@shared/ui-components/atoms/os-icon/os-icon.component';
import { OsProgressBarComponent } from '@shared/ui-components/atoms/os-progress-bar/os-progress-bar.component';
import { OsMoneyDisplayComponent } from '@shared/ui-components/molecules/os-money-display/os-money-display.component';
import { LocaleService } from '@shared/formatting';

interface GoalProgressItem {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  progress: number;
  remaining: number;
  status: 'on-track' | 'atrasada' | 'adiantada';
  suggestedMonthly: number | null;
}

@Component({
  selector: 'os-goals-progress-widget',
  standalone: true,
  imports: [
    CommonModule,
    OsButtonComponent,
    OsIconComponent,
    OsProgressBarComponent,
    OsMoneyDisplayComponent,
  ],
  template: `
    <div class="goals-progress-widget" role="region" [attr.aria-labelledby]="'goals-progress-title'">
      <header class="goals-progress-widget__header">
        <h2 id="goals-progress-title" class="goals-progress-widget__title">Progresso das Metas</h2>
        @if (subtitle()) {
        <p class="goals-progress-widget__subtitle">{{ subtitle() }}</p>
        } @else {
        <p class="goals-progress-widget__subtitle">
          {{ summaryText() }}
        </p>
        }
      </header>

      @if (isLoading()) {
      <div class="goals-progress-widget__loading" role="status" aria-live="polite">
        <div class="goals-progress-widget__skeleton" aria-hidden="true">
          @for (item of [1, 2, 3]; track item) {
          <div class="goals-progress-widget__skeleton-item">
            <div class="goals-progress-widget__skeleton-title"></div>
            <div class="goals-progress-widget__skeleton-progress"></div>
            <div class="goals-progress-widget__skeleton-values"></div>
          </div>
          }
        </div>
      </div>
      } @else if (isEmpty()) {
      <div class="goals-progress-widget__empty" role="status">
        <os-icon name="flag" size="lg" variant="default" aria-hidden="true" />
        <p class="goals-progress-widget__empty-text">Você ainda não tem metas. Comece criando sua primeira meta.</p>
        <os-button variant="primary" size="medium" icon="add" (buttonClick)="onCreateGoal()">
          Criar Primeira Meta
        </os-button>
      </div>
      } @else {
      <div class="goals-progress-widget__content">
        <div class="goals-progress-widget__summary">
          <div class="goals-progress-widget__summary-item">
            <span class="goals-progress-widget__summary-label">Total de Metas</span>
            <span class="goals-progress-widget__summary-value">{{ goals().length }}</span>
          </div>
          @if (onTrackCount() > 0) {
          <div class="goals-progress-widget__summary-item">
            <span class="goals-progress-widget__summary-label">No Prazo</span>
            <span class="goals-progress-widget__summary-value goals-progress-widget__summary-value--success">
              {{ onTrackCount() }}
            </span>
          </div>
          }
        </div>

        <ul class="goals-progress-widget__list" role="list">
          @for (goal of displayedGoals(); track goal.id) {
          <li class="goals-progress-widget__item" role="listitem">
            <div class="goals-progress-widget__item-header">
              <h3 class="goals-progress-widget__item-title">{{ goal.name }}</h3>
              <span
                class="goals-progress-widget__item-badge"
                [class]="'goals-progress-widget__item-badge--' + goal.status"
                [attr.aria-label]="getStatusLabel(goal.status)"
              >
                @if (goal.status === 'on-track') {
                <os-icon name="check_circle" size="xs" variant="success" aria-hidden="true" />
                } @else if (goal.status === 'atrasada') {
                <os-icon name="warning" size="xs" variant="error" aria-hidden="true" />
                } @else {
                <os-icon name="trending_up" size="xs" variant="info" aria-hidden="true" />
                }
                {{ getStatusLabel(goal.status) }}
              </span>
            </div>

            <div class="goals-progress-widget__item-progress">
              <os-progress-bar
                [value]="goal.progress"
                [variant]="getProgressVariant(goal.status)"
                [ariaLabel]="'Progresso da meta ' + goal.name + ': ' + goal.progress.toFixed(0) + '%'"
              />
            </div>

            <div class="goals-progress-widget__item-values">
              <div class="goals-progress-widget__item-value">
                <span class="goals-progress-widget__item-value-label">Acumulado</span>
                <os-money-display
                  [value]="goal.currentValue"
                  [currency]="'BRL'"
                  [size]="'sm'"
                  [ariaLabel]="'Valor acumulado: ' + formatCurrency(goal.currentValue)"
                />
              </div>
              <div class="goals-progress-widget__item-value">
                <span class="goals-progress-widget__item-value-label">Meta</span>
                <os-money-display
                  [value]="goal.targetValue"
                  [currency]="'BRL'"
                  [size]="'sm'"
                  [ariaLabel]="'Valor da meta: ' + formatCurrency(goal.targetValue)"
                />
              </div>
              <div class="goals-progress-widget__item-value">
                <span class="goals-progress-widget__item-value-label">Restante</span>
                <os-money-display
                  [value]="goal.remaining"
                  [currency]="'BRL'"
                  [size]="'sm'"
                  [variant]="'negative'"
                  [ariaLabel]="'Valor restante: ' + formatCurrency(goal.remaining)"
                />
              </div>
              @if (goal.suggestedMonthly !== null) {
              <div class="goals-progress-widget__item-value">
                <span class="goals-progress-widget__item-value-label">Aporte sugerido</span>
                <os-money-display
                  [value]="goal.suggestedMonthly"
                  [currency]="'BRL'"
                  [size]="'sm'"
                  [ariaLabel]="'Aporte mensal sugerido: ' + formatCurrency(goal.suggestedMonthly)"
                />
              </div>
              }
            </div>
          </li>
          }
        </ul>

        @if (hasMoreGoals()) {
        <footer class="goals-progress-widget__footer">
          <os-button
            variant="secondary"
            size="medium"
            icon="arrow_forward"
            (buttonClick)="onViewAllGoals()"
            [attr.aria-label]="'Ver todas as ' + goals().length + ' metas'"
          >
            Ver todas as metas
          </os-button>
        </footer>
        }
      </div>
      }
    </div>
  `,
  styleUrls: ['./goals-progress-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsProgressWidgetComponent {
  private readonly router = inject(Router);
  private readonly localeService = inject(LocaleService);

  readonly goals = input<GoalDto[]>([]);
  readonly isLoading = input<boolean>(false);
  readonly subtitle = input<string | undefined>(undefined);
  readonly maxDisplayed = input<number>(5);

  readonly isEmpty = computed(() => !this.isLoading() && this.goals().length === 0);
  readonly displayedGoals = computed(() => {
    const goals = this.goals();
    return this.processGoals(goals).slice(0, this.maxDisplayed());
  });
  readonly hasMoreGoals = computed(() => this.goals().length > this.maxDisplayed());
  readonly onTrackCount = computed(() => {
    return this.processGoals(this.goals()).filter((g) => g.status === 'on-track').length;
  });

  readonly summaryText = computed(() => {
    const total = this.goals().length;
    const onTrack = this.onTrackCount();
    if (total === 0) {
      return 'Comece criando sua primeira meta';
    }
    if (onTrack === total) {
      return `Todas as ${total} ${total === 1 ? 'meta está' : 'metas estão'} no prazo`;
    }
    return `${onTrack} de ${total} ${total === 1 ? 'meta' : 'metas'} no prazo`;
  });

  private processGoals(goals: GoalDto[]): GoalProgressItem[] {
    const now = new Date();

    return goals
      .filter((goal) => goal.totalAmount > 0)
      .map((goal) => {
        
        const progress = (goal.accumulatedAmount / goal.totalAmount) * 100;
        const remainingCents = Math.max(goal.totalAmount - goal.accumulatedAmount, 0);

        let status: 'on-track' | 'atrasada' | 'adiantada' = 'on-track';
        let suggestedMonthly: number | null = null;

        if (goal.deadline) {
          const deadline = new Date(goal.deadline);
          if (deadline <= now) {
            status = goal.accumulatedAmount >= goal.totalAmount ? 'on-track' : 'atrasada';
          } else {
            const monthsRemaining = this.calculateMonthsRemaining(now, deadline);
            const expectedProgress = monthsRemaining > 0 ? Math.max(0, 100 - (monthsRemaining / 12) * 100) : 100;

            if (progress >= expectedProgress) {
              status = 'on-track';
            } else if (progress < expectedProgress - 10) {
              status = 'atrasada';
            } else {
              status = 'adiantada';
            }

            if (monthsRemaining > 0 && remainingCents > 0) {
              const remainingReais = remainingCents / 100;
              suggestedMonthly = Math.round((remainingReais / monthsRemaining) * 100) / 100;
            }
          }
        }

        return {
          id: goal.id,
          name: goal.name,
          currentValue: goal.accumulatedAmount / 100,
          targetValue: goal.totalAmount / 100,
          progress: Math.min(Math.max(progress, 0), 100),
          remaining: remainingCents / 100,
          status,
          suggestedMonthly,
        };
      })
      .sort((a, b) => {
        if (a.status === 'atrasada' && b.status !== 'atrasada') return -1;
        if (a.status !== 'atrasada' && b.status === 'atrasada') return 1;
        return b.progress - a.progress;
      });
  }

  private calculateMonthsRemaining(start: Date, end: Date): number {
    const yearsDiff = end.getFullYear() - start.getFullYear();
    const monthsDiff = end.getMonth() - start.getMonth();
    const totalMonths = yearsDiff * 12 + monthsDiff;

    if (end.getDate() < start.getDate()) {
      return Math.max(0, totalMonths - 1);
    }

    return Math.max(0, totalMonths);
  }

  getStatusLabel(status: 'on-track' | 'atrasada' | 'adiantada'): string {
    switch (status) {
      case 'on-track':
        return 'No prazo';
      case 'atrasada':
        return 'Atrasada';
      case 'adiantada':
        return 'Adiantada';
    }
  }

  getProgressVariant(status: 'on-track' | 'atrasada' | 'adiantada'): 'primary' | 'success' | 'warning' | 'danger' {
    switch (status) {
      case 'on-track':
        return 'success';
      case 'atrasada':
        return 'danger';
      case 'adiantada':
        return 'primary';
    }
  }

  formatCurrency(value: number): string {
    return this.localeService.formatCurrency(value, 'BRL');
  }

  onViewAllGoals(): void {
    this.router.navigate(['/goals']);
  }

  onCreateGoal(): void {
    this.router.navigate(['/goals/new']);
  }
}
