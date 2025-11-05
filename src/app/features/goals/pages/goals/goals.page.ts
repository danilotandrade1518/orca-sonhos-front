import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { GoalListComponent } from '../../components/goal-list/goal-list.component';
import { GoalAmountModalComponent } from '../../components/goal-amount-modal/goal-amount-modal.component';
import { GoalsState } from '../../state/goals-state/goals.state';
import { NotificationService } from '../../../../core/services/notification/notification.service';

@Component({
  selector: 'os-goals-page',
  imports: [CommonModule, GoalListComponent, GoalAmountModalComponent],
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

      @if (showAddModal()) {
      <os-goal-amount-modal
        [mode]="'add'"
        [goalId]="selectedGoalId()!"
        [currentAmount]="selectedGoal()?.accumulatedAmount ?? 0"
        [submitting]="state.isLoading()"
        [error]="state.error()"
        (save)="onAddAmount($event)"
        (cancelled)="closeAddModal()"
      />
      } @if (showRemoveModal()) {
      <os-goal-amount-modal
        [mode]="'remove'"
        [goalId]="selectedGoalId()!"
        [currentAmount]="selectedGoal()?.accumulatedAmount ?? 0"
        [submitting]="state.isLoading()"
        [error]="state.error()"
        (save)="onRemoveAmount($event)"
        (cancelled)="closeRemoveModal()"
      />
      }
    </section>
  `,
  styleUrl: './goals.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsPage {
  readonly state = inject(GoalsState);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notificationService = inject(NotificationService);

  private readonly _showAddModal = signal(false);
  private readonly _showRemoveModal = signal(false);
  private readonly _selectedGoalId = signal<string | null>(null);

  readonly showAddModal = this._showAddModal.asReadonly();
  readonly showRemoveModal = this._showRemoveModal.asReadonly();
  readonly selectedGoalId = this._selectedGoalId.asReadonly();

  readonly selectedGoal = computed(() => {
    const id = this._selectedGoalId();
    if (!id) return null;
    return this.state.items().find((g) => g.id === id) || null;
  });

  constructor() {
    effect(() => {
      this.state.load();
    });
  }

  navigateToNew(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onAportar(goalId: string): void {
    this._selectedGoalId.set(goalId);
    this._showAddModal.set(true);
  }

  onEditar(goalId: string): void {
    this.router.navigate([goalId], { relativeTo: this.route });
  }

  onExcluir(goalId: string): void {
    this.state.delete({ id: goalId });
  }

  onAddAmount(event: { goalId: string; amount: number }): void {
    this.state.addAmount({ id: event.goalId, amount: event.amount });
    this.closeAddModal();
    this.notificationService.showSuccess('Aporte adicionado com sucesso');
  }

  onRemoveAmount(event: { goalId: string; amount: number }): void {
    this.state.removeAmount({ id: event.goalId, amount: event.amount });
    this.closeRemoveModal();
    this.notificationService.showSuccess('Aporte removido com sucesso');
  }

  closeAddModal(): void {
    this._showAddModal.set(false);
    this._selectedGoalId.set(null);
  }

  closeRemoveModal(): void {
    this._showRemoveModal.set(false);
    this._selectedGoalId.set(null);
  }
}
