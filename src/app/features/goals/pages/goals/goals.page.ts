import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { GoalListComponent } from '../../components/goal-list/goal-list.component';
import { GoalsState } from '../../state/goals-state/goals.state';

@Component({
  selector: 'os-goals-page',
  imports: [CommonModule, GoalListComponent],
  template: `
    <section class="os-goals" role="main" aria-label="Página de metas">
      <a href="#main-content" class="os-goals__skip-link">Pular para conteúdo principal</a>

      <header class="os-goals__header">
        <h1>Metas</h1>
        <div class="os-goals__actions">
          <button type="button" (click)="navigateToNew()">Nova Meta</button>
        </div>
      </header>

      <div
        class="os-goals__live-region"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        [attr.aria-label]="state.isLoading() ? 'Carregando metas' : ''"
      >
        {{ state.isLoading() ? 'Carregando metas...' : '' }}
      </div>
      <div
        class="os-goals__live-region os-goals__live-region--error"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        {{ state.error() || '' }}
      </div>

      <div id="main-content" tabindex="-1">
        <os-goal-list
          [goals]="state.items()"
          [isLoading]="state.isLoading()"
          [lastUpdated]="state.lastUpdated()"
          [error]="state.error()"
          [progressById]="state.progressById()"
          [remainingById]="state.remainingById()"
          [suggestedById]="state.suggestedMonthlyById()"
          (create)="navigateToNew()"
          (aportar)="onAportar($event)"
          (editar)="onEditar($event)"
          (excluir)="onExcluir($event)"
        />
      </div>
    </section>
  `,
  styleUrl: './goals.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsPage {
  readonly state = inject(GoalsState);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      this.state.load();
    });
  }

  navigateToNew(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onAportar(goalId: string): void {
    // Placeholder: fase 6 implementará fluxo de aporte
    // Poderíamos abrir modal/rota específica futuramente
  }

  onEditar(goalId: string): void {
    this.router.navigate([goalId], { relativeTo: this.route });
  }

  onExcluir(goalId: string): void {
    this.state.delete({ id: goalId });
  }
}
