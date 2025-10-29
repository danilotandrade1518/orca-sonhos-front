import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BudgetState } from '@core/services/budget/budget.state';
import { AuthService } from '@core/services/auth/auth.service';

@Component({
  selector: 'os-budget-detail-page',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="budget-detail-page">
      @switch (currentState()) { @case ('loading') {
      <div class="budget-detail-page__loading">
        <div class="spinner"></div>
        <p>Carregando detalhes do orçamento...</p>
      </div>
      } @case ('error') {
      <div class="budget-detail-page__error">
        <p class="error-message">{{ errorMessage() }}</p>
        <button type="button" class="button button--secondary" (click)="navigateToList()">
          Voltar para Lista
        </button>
      </div>
      } @default { @if (budget(); as budget) {
      <header class="budget-detail-page__header">
        <div class="budget-detail-page__header-content">
          <button
            type="button"
            class="budget-detail-page__back-button"
            (click)="navigateToList()"
            aria-label="Voltar para lista de orçamentos"
          >
            ← Voltar
          </button>

          <div class="budget-detail-page__title-section">
            <h1 class="budget-detail-page__title">{{ budget.name }}</h1>
            <span
              class="budget-detail-page__type-badge"
              [class.budget-detail-page__type-badge--personal]="budget.type === 'PERSONAL'"
              [class.budget-detail-page__type-badge--shared]="budget.type === 'SHARED'"
            >
              {{ budget.type === 'PERSONAL' ? 'Pessoal' : 'Compartilhado' }}
            </span>
          </div>
        </div>

        <div class="budget-detail-page__actions">
          <button type="button" class="button button--secondary" (click)="navigateToEdit()">
            Editar
          </button>
          <button type="button" class="button button--danger" (click)="confirmDelete()">
            Excluir
          </button>
        </div>
      </header>

      <main class="budget-detail-page__content">
        <section class="budget-detail-page__card">
          <h2 class="budget-detail-page__card-title">Informações Básicas</h2>

          <div class="budget-detail-page__info-grid">
            <div class="info-item">
              <span class="info-item__label">ID:</span>
              <span class="info-item__value">{{ budget.id }}</span>
            </div>

            <div class="info-item">
              <span class="info-item__label">Tipo:</span>
              <span class="info-item__value">
                {{ budget.type === 'PERSONAL' ? 'Pessoal' : 'Compartilhado' }}
              </span>
            </div>

            <div class="info-item">
              <span class="info-item__label">Participantes:</span>
              <span class="info-item__value">
                {{ budget.participantsCount }}
                {{ budget.participantsCount === 1 ? 'participante' : 'participantes' }}
              </span>
            </div>
          </div>
        </section>

        <section class="budget-detail-page__card">
          <h2 class="budget-detail-page__card-title">Visão Geral</h2>
          <p class="budget-detail-page__placeholder">
            Detalhes do orçamento serão exibidos aqui nas próximas fases.
          </p>
          <p class="budget-detail-page__placeholder-subtitle">
            Aguarde a implementação dos componentes de overview e participants.
          </p>
        </section>
      </main>
      } @else {
      <div class="budget-detail-page__not-found">
        <h2>Orçamento não encontrado</h2>
        <p>O orçamento que você está procurando não existe ou foi removido.</p>
        <button type="button" class="button button--primary" (click)="navigateToList()">
          Voltar para Lista
        </button>
      </div>
      } } }
    </div>
  `,
  styleUrl: './budget-detail.page.scss',
})
export class BudgetDetailPage implements OnInit {
  private readonly budgetState = inject(BudgetState);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = this.budgetState.loading;
  readonly error = this.budgetState.error;

  readonly currentUser = this.authService.currentUser;

  readonly budgetId = signal<string | null>(null);

  readonly budget = computed(() => {
    const id = this.budgetId();
    if (!id) return null;

    const budgets = this.budgetState.budgets();
    return budgets.find((b) => b.id === id) || null;
  });

  readonly currentState = computed(() => {
    if (this.loading()) return 'loading';
    if (this.error()) return 'error';
    return 'success';
  });

  readonly errorMessage = computed(() => this.error() || 'Erro ao carregar orçamento');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.budgetId.set(id);

      if (this.budgetState.budgets().length === 0) {
        this.budgetState.loadBudgets();
      }

      this.budgetState.selectBudget(id);
    }
  }

  navigateToList(): void {
    this.router.navigate(['/budgets']);
  }

  navigateToEdit(): void {
    const id = this.budgetId();
    if (id) {
      this.router.navigate(['/budgets', id, 'edit']);
    }
  }

  confirmDelete(): void {
    const budget = this.budget();
    const user = this.currentUser();
    if (!budget || !user) return;

    if (confirm(`Tem certeza que deseja excluir o orçamento "${budget.name}"?`)) {
      this.budgetState.deleteBudget(user.id, budget.id);
      this.navigateToList();
    }
  }
}
