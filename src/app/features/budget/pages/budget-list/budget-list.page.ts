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
import { BudgetCardComponent } from '../../components/budget-card/budget-card.component';
import { BudgetFormComponent } from '../../components/budget-form/budget-form.component';
import { OsModalTemplateComponent } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import { OsButtonComponent } from '@shared/ui-components/atoms/os-button/os-button.component';
import type { ModalTemplateConfig } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';

@Component({
  selector: 'os-budget-list-page',
  standalone: true,
  imports: [CommonModule, BudgetCardComponent, BudgetFormComponent, OsModalTemplateComponent, OsButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="budget-list-page">
      <header class="budget-list-page__header">
        <h1 class="budget-list-page__title">Orçamentos</h1>
        <p class="budget-list-page__subtitle">Gerencie seus orçamentos pessoais e compartilhados</p>

        <os-button
          variant="primary"
          size="medium"
          icon="plus"
          (buttonClick)="navigateToCreate()"
          [attr.aria-label]="'Criar novo orçamento'"
        >
          Novo Orçamento
        </os-button>
      </header>

      <section class="budget-list-page__toolbar">
        <div class="budget-list-page__filters">
          <input
            type="text"
            class="budget-list-page__search"
            placeholder="Buscar orçamentos..."
            [value]="searchTerm()"
            (input)="updateSearchTerm($event)"
            aria-label="Buscar orçamentos por nome"
            id="budget-search-input"
          />

          <select
            class="budget-list-page__type-filter"
            [value]="selectedType()"
            (change)="updateTypeFilter($event)"
            aria-label="Filtrar orçamentos por tipo"
            id="budget-type-filter"
          >
            <option value="all">Todos os tipos</option>
            <option value="PERSONAL">Pessoal</option>
            <option value="SHARED">Compartilhado</option>
          </select>
        </div>
      </section>

      <main class="budget-list-page__content">
        @switch (currentState()) { @case ('loading') {
        <div
          class="budget-list-page__loading"
          role="status"
          aria-live="polite"
          aria-label="Carregando orçamentos"
        >
          <div class="spinner" aria-hidden="true"></div>
          <p>Carregando orçamentos...</p>
        </div>
        } @case ('error') {
        <div class="budget-list-page__error" role="alert" aria-live="assertive">
          <p class="error-message">{{ errorMessage() }}</p>
          <os-button
            variant="secondary"
            size="medium"
            (buttonClick)="retry()"
            [attr.aria-label]="'Tentar carregar orçamentos novamente'"
          >
            Tentar Novamente
          </os-button>
        </div>
        } @case ('empty') {
        <div class="budget-list-page__empty" role="status" aria-live="polite">
          <p>Nenhum orçamento encontrado</p>
          <p class="empty-subtitle">Crie seu primeiro orçamento para começar</p>
          <os-button
            variant="primary"
            size="medium"
            icon="plus"
            (buttonClick)="navigateToCreate()"
            [attr.aria-label]="'Criar primeiro orçamento'"
          >
            Criar Orçamento
          </os-button>
        </div>
        } @default {
        <div class="budget-list-page__grid">
          @for (budget of filteredBudgets(); track budget.id) {
          <os-budget-card
            [budget]="budget"
            [selected]="isSelected(budget.id)"
            (cardClick)="navigateToDetail(budget.id)"
            (editClick)="navigateToEdit($event)"
            (deleteClick)="confirmDelete($event)"
          />
          }
        </div>
        } }
      </main>

      @if (showCreateModal()) {
      <os-budget-form [mode]="'create'" (saved)="onFormSaved()" (cancelled)="onFormCancelled()" />
      } @if (showDeleteConfirmModal()) {
      <os-modal-template
        [config]="deleteModalConfig()"
        [variant]="'compact'"
        [size]="'small'"
        [disabled]="loading()"
        [loading]="loading()"
        [valid]="true"
        (actionClick)="onDeleteActionClick($event)"
        (cancelled)="onDeleteCancelled()"
        (closed)="onDeleteCancelled()"
      />
      }
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

  readonly deleteBudgetId = signal<string | null>(null);
  readonly deleteBudgetName = signal<string | null>(null);

  readonly currentUser = this.authService.currentUser;

  readonly budgets = this.budgetState.budgets;
  readonly loading = this.budgetState.loading;
  readonly error = this.budgetState.error;
  readonly selectedBudgetId = this.budgetState.selectedBudgetId;

  readonly showCreateModal = computed(() => {
    return this.route.snapshot.data['modalMode'] === 'create';
  });

  readonly showDeleteConfirmModal = computed(() => {
    return this.deleteBudgetId() !== null;
  });

  readonly deleteModalConfig = computed<ModalTemplateConfig>(() => {
    const budgetName = this.deleteBudgetName();
    return {
      title: 'Excluir Orçamento',
      subtitle: budgetName
        ? `Tem certeza que deseja excluir o orçamento "${budgetName}"? Esta ação não pode ser desfeita.`
        : 'Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.',
      showActions: true,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Cancelar',
      actions: [
        {
          label: 'Excluir',
          variant: 'danger',
          size: 'medium',
          disabled: this.loading(),
          loading: this.loading(),
        },
      ],
    };
  });

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
    const budgets = this.budgets();
    const budget = budgets.find((b) => b.id === budgetId);
    if (!budget) return;

    this.deleteBudgetId.set(budgetId);
    this.deleteBudgetName.set(budget.name);
  }

  onDeleteActionClick(action: {
    label: string;
    variant: 'primary' | 'secondary' | 'tertiary' | 'danger';
    size: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
  }): void {
    if (action.variant === 'danger' || action.label === 'Excluir') {
      this.onDeleteConfirmed();
    }
  }

  onDeleteConfirmed(): void {
    const budgetId = this.deleteBudgetId();
    const user = this.currentUser();
    if (!budgetId || !user) {
      this.onDeleteCancelled();
      return;
    }

    this.budgetState.deleteBudget(user.id, budgetId);
    this.onDeleteCancelled();
  }

  onDeleteCancelled(): void {
    this.deleteBudgetId.set(null);
    this.deleteBudgetName.set(null);
  }

  retry(): void {
    this.budgetState.loadBudgets();
  }

  onFormSaved(): void {
    this.router.navigate(['/budgets'], { replaceUrl: true });
  }

  onFormCancelled(): void {
    this.router.navigate(['/budgets'], { replaceUrl: true });
  }
}
