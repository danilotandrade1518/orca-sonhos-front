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
  selector: 'os-budget-list-page',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="budget-list-page">
      <header class="budget-list-page__header">
        <h1 class="budget-list-page__title">Orçamentos</h1>
        <p class="budget-list-page__subtitle">Gerencie seus orçamentos pessoais e compartilhados</p>

        <button class="budget-list-page__create-button" (click)="navigateToCreate()" type="button">
          <span>+ Novo Orçamento</span>
        </button>
      </header>

      <section class="budget-list-page__toolbar">
        <div class="budget-list-page__filters">
          <input
            type="text"
            class="budget-list-page__search"
            placeholder="Buscar orçamentos..."
            [value]="searchTerm()"
            (input)="updateSearchTerm($event)"
          />

          <select
            class="budget-list-page__type-filter"
            [value]="selectedType()"
            (change)="updateTypeFilter($event)"
          >
            <option value="all">Todos os tipos</option>
            <option value="PERSONAL">Pessoal</option>
            <option value="SHARED">Compartilhado</option>
          </select>
        </div>
      </section>

      <main class="budget-list-page__content">
        @switch (currentState()) { @case ('loading') {
        <div class="budget-list-page__loading">
          <div class="spinner"></div>
          <p>Carregando orçamentos...</p>
        </div>
        } @case ('error') {
        <div class="budget-list-page__error">
          <p class="error-message">{{ errorMessage() }}</p>
          <button type="button" class="retry-button" (click)="retry()">Tentar Novamente</button>
        </div>
        } @case ('empty') {
        <div class="budget-list-page__empty">
          <p>Nenhum orçamento encontrado</p>
          <p class="empty-subtitle">Crie seu primeiro orçamento para começar</p>
          <button type="button" class="create-button" (click)="navigateToCreate()">
            Criar Orçamento
          </button>
        </div>
        } @default {
        <div class="budget-list-page__grid">
          @for (budget of filteredBudgets(); track budget.id) {
          <div
            class="budget-card"
            [class.budget-card--selected]="isSelected(budget.id)"
            (click)="navigateToDetail(budget.id)"
            role="button"
            tabindex="0"
            [attr.aria-label]="'Orçamento ' + budget.name"
            (keydown.enter)="navigateToDetail(budget.id)"
            (keydown.space)="navigateToDetail(budget.id)"
          >
            <div class="budget-card__header">
              <h3 class="budget-card__name">{{ budget.name }}</h3>
              <span
                class="budget-card__type"
                [class.budget-card__type--personal]="budget.type === 'PERSONAL'"
                [class.budget-card__type--shared]="budget.type === 'SHARED'"
              >
                {{ budget.type === 'PERSONAL' ? 'Pessoal' : 'Compartilhado' }}
              </span>
            </div>

            <div class="budget-card__info">
              <p class="budget-card__participants">
                {{ budget.participantsCount }}
                {{ budget.participantsCount === 1 ? 'participante' : 'participantes' }}
              </p>
            </div>

            <div class="budget-card__actions">
              <button
                type="button"
                class="budget-card__action"
                (click)="navigateToEdit(budget.id); $event.stopPropagation()"
                [attr.aria-label]="'Editar orçamento ' + budget.name"
              >
                Editar
              </button>
              <button
                type="button"
                class="budget-card__action budget-card__action--danger"
                (click)="confirmDelete(budget.id); $event.stopPropagation()"
                [attr.aria-label]="'Excluir orçamento ' + budget.name"
              >
                Excluir
              </button>
            </div>
          </div>
          }
        </div>
        } }
      </main>
    </div>
  `,
  styleUrl: './budget-list.page.scss',
})
export class BudgetListPage implements OnInit {
  private readonly budgetState = inject(BudgetState);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly searchTerm = signal('');
  readonly selectedType = signal<'all' | 'PERSONAL' | 'SHARED'>('all');

  readonly currentUser = this.authService.currentUser;

  readonly budgets = this.budgetState.budgets;
  readonly loading = this.budgetState.loading;
  readonly error = this.budgetState.error;
  readonly selectedBudgetId = this.budgetState.selectedBudgetId;

  readonly filteredBudgets = computed(() => {
    const budgets = this.budgets();
    const search = this.searchTerm().toLowerCase();
    const type = this.selectedType();

    return budgets.filter((budget) => {
      const matchesSearch = budget.name.toLowerCase().includes(search);
      const matchesType = type === 'all' || budget.type === type;
      return matchesSearch && matchesType;
    });
  });

  readonly currentState = computed(() => {
    if (this.loading()) return 'loading';
    if (this.error()) return 'error';
    if (this.budgets().length === 0) return 'empty';
    if (this.filteredBudgets().length === 0) return 'empty';
    return 'success';
  });

  readonly errorMessage = computed(() => this.error() || 'Erro ao carregar orçamentos');

  ngOnInit(): void {
    this.budgetState.loadBudgets();
  }

  updateSearchTerm(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  updateTypeFilter(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedType.set(select.value as 'all' | 'PERSONAL' | 'SHARED');
  }

  isSelected(budgetId: string): boolean {
    return this.selectedBudgetId() === budgetId;
  }

  navigateToCreate(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  navigateToDetail(budgetId: string): void {
    this.router.navigate([budgetId], { relativeTo: this.route });
  }

  navigateToEdit(budgetId: string): void {
    this.router.navigate([budgetId, 'edit'], { relativeTo: this.route });
  }

  confirmDelete(budgetId: string): void {
    const user = this.currentUser();
    if (!user) return;

    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      this.budgetState.deleteBudget(user.id, budgetId);
    }
  }

  retry(): void {
    this.budgetState.loadBudgets();
  }
}
