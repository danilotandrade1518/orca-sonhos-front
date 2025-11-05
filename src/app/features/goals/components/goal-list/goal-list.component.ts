import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { GoalDto } from '../../../../../dtos/goal/goal-types/goal-types';
import { GoalCardComponent } from '../goal-card/goal-card.component';
import { OsButtonComponent } from '../../../../shared/ui-components/atoms/os-button/os-button.component';

@Component({
  selector: 'os-goal-list',
  imports: [CommonModule, GoalCardComponent, OsButtonComponent],
  template: `
    <section class="os-goal-list" role="region" aria-label="Lista de metas">
      <div class="os-goal-list__live" role="status" aria-live="polite" aria-atomic="true">
        {{ isLoading() ? 'Carregando metas...' : '' }}
      </div>

      @if (error()) {
      <div class="os-goal-list__error" role="alert" aria-live="assertive">{{ error() }}</div>
      } @if (isLoading()) {
      <div class="os-goal-list__skeleton">Carregando...</div>
      } @else if (goals().length === 0) {
      <div class="os-goal-list__empty">
        <p>Nenhuma meta encontrada</p>
        <os-button
          [variant]="'primary'"
          [size]="'medium'"
          [icon]="'flag'"
          [ariaLabel]="'Criar primeira meta'"
          (buttonClick)="create.emit()"
        >
          Criar primeira meta
        </os-button>
      </div>
      } @else {
      <div class="os-goal-list__grid">
        @for (g of goals(); track g.id || $index) {
        @if (g.id) {
        <os-goal-card
          [goal]="g"
          [progress]="progressById()(g.id)"
          [remaining]="remainingById()(g.id)"
          [suggested]="suggestedById()(g.id)"
          (aportar)="aportar.emit($event)"
          (editar)="editar.emit($event)"
          (excluir)="excluir.emit($event)"
        />
        }
        }
      </div>
      }
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
  readonly aportar = output<string>();
  readonly editar = output<string>();
  readonly excluir = output<string>();
}
