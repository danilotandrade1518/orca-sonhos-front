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
import { OsFilterBarComponent } from '@shared/ui-components/molecules/os-filter-bar/os-filter-bar.component';
import { OsInputComponent } from '@shared/ui-components/atoms/os-input/os-input.component';
import { OsSelectComponent } from '@shared/ui-components/atoms/os-select/os-select.component';
import { OsEntityListComponent } from '@shared/ui-components/organisms/os-entity-list/os-entity-list.component';
import { OsAlertComponent } from '@shared/ui-components/molecules/os-alert/os-alert.component';
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import { OsPageHeaderComponent, PageHeaderAction } from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import type { ModalTemplateConfig } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';

@Component({
  selector: 'os-budget-list-page',
  standalone: true,
  imports: [
    CommonModule,
    BudgetCardComponent,
    BudgetFormComponent,
    OsModalTemplateComponent,
    OsButtonComponent,
    OsFilterBarComponent,
    OsInputComponent,
    OsSelectComponent,
    OsEntityListComponent,
    OsAlertComponent,
    OsPageComponent,
    OsPageHeaderComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Página de orçamentos">
      <os-page-header
        title="Orçamentos"
        subtitle="Gerencie seus orçamentos pessoais e compartilhados"
        [actions]="pageHeaderActions()"
        (actionClick)="onPageHeaderActionClick($event)"
      />

      <section class="budget-list-page__toolbar">
        <os-filter-bar
          variant="default"
          size="medium"
          [hasActiveFilters]="hasActiveFilters()"
          [ariaLabel]="'Filtros de orçamentos'"
          (clear)="onClearFilters()"
          (apply)="onApplyFilters()"
        >
          <div class="budget-list-page__filters-content">
            <os-input
              type="text"
              label="Buscar"
              placeholder="Buscar orçamentos..."
              [value]="searchTerm()"
              size="medium"
              [ariaLabel]="'Buscar orçamentos por nome'"
              (valueChange)="onSearchChange($event)"
            />

            <os-select
              label="Tipo"
              [options]="typeOptions()"
              [value]="selectedType()"
              size="medium"
              [ariaLabel]="'Filtrar orçamentos por tipo'"
              (valueChange)="onTypeChange($event)"
            />
          </div>
        </os-filter-bar>
      </section>

      <main class="budget-list-page__content">
        @if (currentState() === 'error') {
        <os-alert
          type="error"
          [title]="'Erro ao carregar orçamentos'"
          [role]="'alert'"
          [ariaLive]="'assertive'"
          [showIcon]="true"
          [dismissible]="false"
        >
          {{ errorMessage() }}
          <div class="budget-list-page__error-action">
            <os-button
              variant="primary"
              size="medium"
              icon="refresh"
              (buttonClick)="retry()"
              [attr.aria-label]="'Tentar carregar orçamentos novamente'"
            >
              Tentar Novamente
            </os-button>
          </div>
        </os-alert>
        } @else {
        <os-entity-list
          [layout]="'grid'"
          [size]="'medium'"
          [isLoading]="currentState() === 'loading'"
          [isEmpty]="currentState() === 'empty'"
          [loadingText]="'Carregando orçamentos...'"
          [emptyTitle]="'Nenhum orçamento encontrado'"
          [emptyText]="'Crie seu primeiro orçamento para começar'"
          [emptyIcon]="'wallet'"
          [emptyAction]="true"
          [emptyActionLabel]="'Criar Orçamento'"
          [emptyActionIcon]="'plus'"
          [ariaLabel]="'Lista de orçamentos'"
          (emptyActionClick)="navigateToCreate()"
        >
          @for (budget of filteredBudgets(); track budget.id) {
          <os-budget-card
            [budget]="budget"
            [selected]="isSelected(budget.id)"
            (cardClick)="navigateToDetail(budget.id)"
            (editClick)="navigateToEdit($event)"
            (deleteClick)="confirmDelete($event)"
          />
          }
        </os-entity-list>
        }
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
    </os-page>
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

  readonly hasActiveFilters = computed(() => {
    return this.searchTerm().length > 0 || this.selectedType() !== 'all';
  });

  readonly typeOptions = computed(() => [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'PERSONAL', label: 'Pessoal' },
    { value: 'SHARED', label: 'Compartilhado' },
  ]);

  readonly pageHeaderActions = computed((): PageHeaderAction[] => [
    {
      label: 'Novo Orçamento',
      variant: 'primary',
      size: 'medium',
      icon: 'plus',
    },
  ]);

  ngOnInit(): void {
    this.budgetState.loadBudgets();
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  onTypeChange(value: string | number): void {
    this.selectedType.set(value as 'all' | 'PERSONAL' | 'SHARED');
  }

  onClearFilters(): void {
    this.searchTerm.set('');
    this.selectedType.set('all');
  }

  onApplyFilters(): void {
    // Filtros são aplicados automaticamente via computed filteredBudgets
    // Este método pode ser usado para ações adicionais se necessário
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

  onPageHeaderActionClick(action: PageHeaderAction): void {
    if (action.label === 'Novo Orçamento') {
      this.navigateToCreate();
    }
  }
}
