import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { GoalDto } from '../../../../../dtos/goal/goal-types/goal-types';
import {
  OsGoalProgressCardComponent,
  GoalProgressData,
} from '../../../../shared/ui-components/molecules/os-goal-progress-card/os-goal-progress-card.component';

@Component({
  selector: 'os-goal-card',
  imports: [CommonModule, OsGoalProgressCardComponent],
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
    
    return {
      id: g.id,
      title: g.name,
      currentValue: g.accumulatedAmount,
      targetValue: g.totalAmount,
      unit: 'BRL',
      deadline: deadline,
      priority: this.getPriorityFromProgress(),
      suggestedAmount: this.suggested(),
    };
  });

  readonly goalState = computed(() => {
    const p = this.progress();
    if (p >= 100) return 'completed' as const;
    // Verificar se está atrasado baseado no deadline
    const deadline = this.goal().deadline;
    if (deadline) {
      const dueDate = new Date(deadline);
      const now = new Date();
      if (dueDate < now && p < 100) {
        return 'overdue' as const;
      }
    }
    return 'default' as const;
  });

  private getPriorityFromProgress(): 'low' | 'medium' | 'high' {
    const p = this.progress();
    if (p < 33) return 'high';
    if (p < 66) return 'medium';
    return 'low';
  }
}
