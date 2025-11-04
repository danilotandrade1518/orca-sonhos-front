import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { GoalDto } from '../../../../../dtos/goal/goal-types/goal-types';

@Component({
  selector: 'os-goal-card',
  imports: [CommonModule],
  template: `
    <article class="os-goal-card" [attr.aria-label]="goal().name">
      <header class="os-goal-card__header">
        <h3 class="os-goal-card__title">{{ goal().name }}</h3>
      </header>

      <section class="os-goal-card__progress" aria-label="Progresso da meta">
        <div
          class="os-goal-card__progress-bar"
          role="progressbar"
          [attr.aria-valuemin]="0"
          [attr.aria-valuemax]="100"
          [attr.aria-valuenow]="progress()"
        >
          <div class="os-goal-card__progress-bar-fill" [style.width.%]="progress()"></div>
        </div>
        <div class="os-goal-card__progress-info">
          <span class="os-goal-card__progress-value">{{ progress() | number : '1.0-2' }}%</span>
        </div>
      </section>

      <section class="os-goal-card__values" aria-label="Valores da meta">
        <div class="os-goal-card__value">
          <span class="os-goal-card__value-label">Acumulado</span>
          <span class="os-goal-card__value-text">{{
            goal().accumulatedAmount | currency : 'BRL' : 'symbol-narrow' : '1.2-2' : 'pt'
          }}</span>
        </div>
        <div class="os-goal-card__value">
          <span class="os-goal-card__value-label">Restante</span>
          <span class="os-goal-card__value-text">{{
            remaining() | currency : 'BRL' : 'symbol-narrow' : '1.2-2' : 'pt'
          }}</span>
        </div>
        <div class="os-goal-card__value">
          <span class="os-goal-card__value-label">Aporte sugerido</span>
          <span class="os-goal-card__value-text">{{
            suggested() === null
              ? '—'
              : (suggested() | currency : 'BRL' : 'symbol-narrow' : '1.2-2' : 'pt')
          }}</span>
        </div>
      </section>

      <footer class="os-goal-card__actions">
        <button type="button" class="os-goal-card__action" (click)="aportar.emit(goal().id!)">
          Aportar
        </button>
        <button type="button" class="os-goal-card__action" (click)="editar.emit(goal().id!)">
          Editar
        </button>
        <button
          type="button"
          class="os-goal-card__action os-goal-card__action--danger"
          (click)="excluir.emit(goal().id!)"
        >
          Excluir
        </button>
      </footer>
    </article>
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

  readonly thresholdClass = computed(() => {
    const p = this.progress();
    if (p < 33) return 'danger';
    if (p < 66) return 'warning';
    return 'success';
  });
}
