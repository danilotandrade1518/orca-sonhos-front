import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { GoalDto } from '../../../../../dtos/goal/goal-types/goal-types';
import {
  OsGoalProgressCardComponent,
  GoalProgressData,
} from '../../../../shared/ui-components/molecules/os-goal-progress-card/os-goal-progress-card.component';

@Component({
  selector: 'os-goal-card',
  imports: [OsGoalProgressCardComponent],
  template: `
    <os-goal-progress-card
      [goalData]="goalProgressData()"
      [variant]="'default'"
      [size]="'medium'"
      [state]="goalState()"
      [showActions]="true"
      [showSuggestedAmount]="true"
      [ariaLabel]="'Meta: ' + goal().name"
      (aportar)="aportar.emit($event)"
      (editar)="editar.emit($event)"
      (excluir)="excluir.emit($event)"
    />
  `,
  styleUrl: './goal-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalCardComponent {
  readonly goal = input.required<GoalDto>();
  readonly progress = input.required<number>();
  readonly remaining = input.required<number>();
  readonly suggested = input.required<number | null>();

  readonly aportar = output<string>();
  readonly editar = output<string>();
  readonly excluir = output<string>();

  readonly goalProgressData = computed((): GoalProgressData => {
    const g = this.goal();
    const deadline = g.deadline ? new Date(g.deadline) : undefined;

    const accumulatedAmount =
      typeof g.accumulatedAmount === 'number' && !isNaN(g.accumulatedAmount) && isFinite(g.accumulatedAmount)
        ? g.accumulatedAmount
        : 0;
    const totalAmount =
      typeof g.totalAmount === 'number' && !isNaN(g.totalAmount) && isFinite(g.totalAmount)
        ? g.totalAmount
        : 0;
    const suggested = this.suggested();

    return {
      id: g.id,
      title: g.name,

      currentValue: accumulatedAmount / 100,
      targetValue: totalAmount / 100,
      unit: 'BRL',
      deadline: deadline,
      priority: this.getPriorityFromProgress(),
      suggestedAmount: suggested !== null && typeof suggested === 'number' && !isNaN(suggested) && isFinite(suggested)
        ? suggested / 100
        : null,
    };
  });

  readonly goalState = computed(() => {
    const p = this.progress();
    if (p >= 100) return 'completed' as const;

    const deadline = this.goal().deadline;
    if (deadline) {
      const dueDate = new Date(deadline);
      const now = new Date();

      if (dueDate <= now) {
        return p < 100 ? 'overdue' as const : 'completed' as const;
      }

      const monthsRemaining = this.calculateMonthsRemaining(now, dueDate);
      const expectedProgress = monthsRemaining > 0
        ? Math.max(0, 100 - (monthsRemaining / 12) * 100)
        : 100;

      if (p < expectedProgress - 10) {
        return 'overdue' as const;
      }
    }
    return 'default' as const;
  });

  private calculateMonthsRemaining(start: Date, end: Date): number {
    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();
    const dayDiff = end.getDate() - start.getDate();

    let months = yearDiff * 12 + monthDiff;

    if (dayDiff < 0) {
      months -= 1;
    }

    return Math.max(months, 0);
  }

  private getPriorityFromProgress(): 'low' | 'medium' | 'high' {
    const p = this.progress();
    if (p < 33) return 'high';
    if (p < 66) return 'medium';
    return 'low';
  }
}
