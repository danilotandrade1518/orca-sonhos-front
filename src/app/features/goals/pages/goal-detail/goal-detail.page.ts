import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  OsDetailTemplateComponent,
  type DetailTemplateAction,
  type DetailTemplateSection,
} from '../../../../shared/ui-components/templates/os-detail-template/os-detail-template.component';
import { GoalAmountModalComponent } from '../../components/goal-amount-modal/goal-amount-modal.component';
import { GoalsState } from '../../state/goals-state/goals.state';

@Component({
  selector: 'os-goal-detail-page',
  imports: [CommonModule, OsDetailTemplateComponent, GoalAmountModalComponent],
  template: `
    <section class="os-goal-detail" role="main" aria-label="Detalhe da meta">
      @if (goal()) {
      <os-detail-template
        [title]="goal()!.name"
        [subtitle]="subtitle()"
        [sections]="sections()"
        [actions]="actions()"
        [showSidebar]="true"
        (actionClicked)="onAction($event)"
      >
        <div slot="sidebar">
          <div class="os-goal-detail__sidebar">
            <p><strong>Orçamento:</strong> {{ goal()!.budgetId }}</p>
            <p>
              <strong>Conta:</strong>
              @if (goal()!.sourceAccountId) {
              <a
                href="/accounts"
                (click)="navigateToAccounts($event)"
                class="os-goal-detail__account-link"
                [attr.aria-label]="'Ver conta ' + goal()!.sourceAccountId"
              >
                {{ goal()!.sourceAccountId }}
              </a>
              } @else {
              <span>—</span>
              }
            </p>
            <p>
              <a
                href="/accounts"
                (click)="navigateToAccounts($event)"
                class="os-goal-detail__accounts-link"
                aria-label="Ver todas as contas"
              >
                Ver todas as contas
              </a>
            </p>
          </div>
        </div>
      </os-detail-template>
      } @else {
      <div class="os-goal-detail__empty" role="status" aria-live="polite">Carregando meta...</div>
      } @if (showAddModal()) {
      <os-goal-amount-modal
        [mode]="'add'"
        [goalId]="goalId()"
        [currentAmount]="goal()?.accumulatedAmount ?? 0"
        [submitting]="state.isLoading()"
        [error]="state.error()"
        (save)="onAddAmount($event)"
        (cancelled)="closeAddModal()"
      />
      } @if (showRemoveModal()) {
      <os-goal-amount-modal
        [mode]="'remove'"
        [goalId]="goalId()"
        [currentAmount]="goal()?.accumulatedAmount ?? 0"
        [submitting]="state.isLoading()"
        [error]="state.error()"
        (save)="onRemoveAmount($event)"
        (cancelled)="closeRemoveModal()"
      />
      }
    </section>
  `,
  styleUrl: './goal-detail.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly state = inject(GoalsState);

  private readonly _showAddModal = signal(false);
  private readonly _showRemoveModal = signal(false);

  readonly showAddModal = this._showAddModal.asReadonly();
  readonly showRemoveModal = this._showRemoveModal.asReadonly();

  readonly goalId = computed(() => this.route.snapshot.params['id'] as string);
  readonly goal = computed(() => this.state.items().find((g) => g.id === this.goalId()) || null);

  readonly subtitle = computed(() => {
    const g = this.goal();
    if (!g) return '';
    return g.deadline
      ? `Meta até ${new Date(g.deadline).toLocaleDateString('pt-BR')}`
      : 'Meta sem prazo definido';
  });

  readonly sections = computed<DetailTemplateSection[]>(() => {
    const g = this.goal();
    if (!g) return [];
    const progress = this.state.progressById()(g.id);
    const remaining = this.state.remainingById()(g.id);
    const suggested = this.state.suggestedMonthlyById()(g.id);

    return [
      {
        title: 'Resumo',
        fields: [
          { label: 'Progresso', value: progress, type: 'percentage', variant: 'highlight' },
          { label: 'Acumulado', value: g.accumulatedAmount, type: 'currency' },
          { label: 'Restante', value: remaining, type: 'currency' },
          {
            label: 'Aporte sugerido (mês)',
            value: suggested ?? '—',
            type: typeof suggested === 'number' ? 'currency' : 'text',
          },
        ],
      },
      {
        title: 'Informações',
        fields: [
          { label: 'Nome', value: g.name, type: 'text' },
          { label: 'Valor alvo', value: g.totalAmount, type: 'currency' },
          {
            label: 'Prazo',
            value: g.deadline ? new Date(g.deadline) : '—',
            type: g.deadline ? 'date' : 'text',
          },
          { label: 'Orçamento', value: g.budgetId, type: 'text' },
          { label: 'Conta origem', value: g.sourceAccountId || '—', type: 'text' },
        ],
      },
    ];
  });

  readonly actions = computed<DetailTemplateAction[]>(() => [
    { id: 'add', label: 'Aportar', variant: 'primary', icon: 'plus' },
    { id: 'remove', label: 'Remover', variant: 'secondary', icon: 'minus' },
    { id: 'edit', label: 'Editar', variant: 'secondary', icon: 'edit' },
    { id: 'delete', label: 'Excluir', variant: 'danger', icon: 'trash' },
  ]);

  onAction(action: DetailTemplateAction): void {
    const g = this.goal();
    if (!g) return;

    if (action.id === 'add') {
      this._showAddModal.set(true);
      return;
    }

    if (action.id === 'remove') {
      this._showRemoveModal.set(true);
      return;
    }

    if (action.id === 'edit') {
      this.router.navigate(['../', g.id], { relativeTo: this.route });
      return;
    }

    if (action.id === 'delete') {
      this.state.delete({ id: g.id });
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }

  onAddAmount(event: { goalId: string; amount: number }): void {
    this.state.addAmount({ id: event.goalId, amount: event.amount });
    this.closeAddModal();
  }

  onRemoveAmount(event: { goalId: string; amount: number }): void {
    this.state.removeAmount({ id: event.goalId, amount: event.amount });
    this.closeRemoveModal();
  }

  closeAddModal(): void {
    this._showAddModal.set(false);
  }

  closeRemoveModal(): void {
    this._showRemoveModal.set(false);
  }

  navigateToAccounts(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/accounts']);
  }
}
