import { ChangeDetectionStrategy, Component, input, output, computed } from '@angular/core';
import type { GoalDto } from '../../../../../dtos/goal/goal-types/goal-types';
import { GoalCardComponent } from '../goal-card/goal-card.component';
import { OsEntityListComponent } from '../../../../shared/ui-components/organisms/os-entity-list/os-entity-list.component';

@Component({
  selector: 'os-goal-list',
  imports: [GoalCardComponent, OsEntityListComponent],
  template: `
    <section class="os-goal-list" role="region" aria-label="Lista de metas">
      <div class="os-goal-list__live" role="status" aria-live="polite" aria-atomic="true">
        {{ isLoading() ? 'Carregando metas...' : '' }}
      </div>

      @if (error()) {
      <div class="os-goal-list__error" role="alert" aria-live="assertive">{{ error() }}</div>
      }

      <os-entity-list
        [layout]="'grid'"
        [size]="'medium'"
        [isLoading]="isLoading()"
        [isEmpty]="isEmpty()"
        [loadingText]="'Carregando metas...'"
        [emptyTitle]="'Nenhuma meta encontrada'"
        [emptyText]="'Crie sua primeira meta para começar a transformar seus sonhos em realidade'"
        [emptyIcon]="'flag'"
        [emptyAction]="true"
        [emptyActionLabel]="'Criar primeira meta'"
        [emptyActionIcon]="'flag'"
        [ariaLabel]="'Lista de metas'"
        (emptyActionClick)="create.emit()"
      >
        @for (g of goals(); track g.id || $index) {
        @if (g.id) {
        <os-goal-card
          [goal]="g"
          [progress]="progressById()(g.id)"
          [remaining]="remainingById()(g.id)"
          [suggested]="suggestedById()(g.id)"
          (cardClick)="cardClick.emit(g.id)"
          (aportar)="aportar.emit($event)"
          (editar)="editar.emit($event)"
          (excluir)="excluir.emit($event)"
        />
        }
        }
      </os-entity-list>
    </section>
  `,
  styleUrl: './goal-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalListComponent {
  readonly goals = input.required<GoalDto[]>();
  readonly isLoading = input(false);
  readonly lastUpdated = input<Date | null>(null);
  readonly error = input<string | null>(null);

  readonly progressById = input.required<(id: string) => number>();
  readonly remainingById = input.required<(id: string) => number>();
  readonly suggestedById = input.required<(id: string) => number | null>();

  readonly refresh = output<void>();
  readonly create = output<void>();
  readonly cardClick = output<string>();
  readonly aportar = output<string>();
  readonly editar = output<string>();
  readonly excluir = output<string>();

  readonly isEmpty = computed(() => {
    return !this.isLoading() && this.goals().length === 0;
  });
}
