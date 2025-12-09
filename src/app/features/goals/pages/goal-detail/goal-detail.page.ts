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
import { GoalsState } from '../../state/goals-state/goals.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { OsModalTemplateComponent } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import { OsButtonComponent } from '@shared/ui-components/atoms/os-button/os-button.component';
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import {
  OsPageHeaderComponent,
  PageHeaderAction,
  BreadcrumbItem,
} from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import { OsSkeletonComponent } from '@shared/ui-components/atoms/os-skeleton/os-skeleton.component';
import { OsAlertComponent } from '@shared/ui-components/molecules/os-alert/os-alert.component';
import { OsProgressBarComponent } from '@shared/ui-components/atoms/os-progress-bar/os-progress-bar.component';
import { LocaleService } from '@shared/formatting';
import type { ModalTemplateConfig } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';

@Component({
  selector: 'os-goal-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    OsModalTemplateComponent,
    OsButtonComponent,
    OsPageComponent,
    OsPageHeaderComponent,
    OsSkeletonComponent,
    OsAlertComponent,
    OsProgressBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Detalhes da meta">
      @switch (currentState()) { @case ('loading') {
      <os-page-header title="Carregando..." [breadcrumbs]="breadcrumbs()" />
      <div
        class="goal-detail-page__loading"
        role="status"
        aria-live="polite"
        aria-label="Carregando detalhes da meta"
      >
        <os-skeleton variant="card" size="lg" />
        <os-skeleton variant="card" size="lg" />
      </div>
      } @case ('error') {
      <os-page-header title="Erro" [breadcrumbs]="breadcrumbs()" />
      <os-alert
        type="error"
        [title]="'Erro ao carregar meta'"
        [role]="'alert'"
        [ariaLive]="'assertive'"
        [showIcon]="true"
        [dismissible]="false"
      >
        {{ errorMessage() }}
        <div class="goal-detail-page__error-action">
          <os-button
            variant="primary"
            size="medium"
            icon="arrow-left"
            (buttonClick)="navigateToList()"
            [attr.aria-label]="'Voltar para lista de metas'"
          >
            Voltar para Lista
          </os-button>
        </div>
      </os-alert>
      } @default { @if (goal(); as goal) {
      <os-page-header
        [title]="goal.name"
        [subtitle]="subtitle()"
        [breadcrumbs]="breadcrumbs()"
        [actions]="pageHeaderActions()"
        (actionClick)="onPageHeaderActionClick($event)"
        (breadcrumbClick)="onBreadcrumbClick($event)"
      />

      <main class="goal-detail-page__content">
        <section class="goal-detail-page__card">
          <h2 class="goal-detail-page__card-title">Informações Básicas</h2>

          <div class="goal-detail-page__info-grid">
            <div class="info-item">
              <span class="info-item__label">ID:</span>
              <span class="info-item__value">{{ goal.id }}</span>
            </div>

            <div class="info-item">
              <span class="info-item__label">Nome:</span>
              <span class="info-item__value">{{ goal.name }}</span>
            </div>

            <div class="info-item">
            <span class="info-item__label">Valor Alvo:</span>
            <span class="info-item__value">{{ formatCurrency(goal.totalAmount / 100) }}</span>
            </div>

            <div class="info-item">
            <span class="info-item__label">Acumulado:</span>
            <span class="info-item__value">{{ formatCurrency(goal.accumulatedAmount / 100) }}</span>
            </div>

            <div class="info-item">
            <span class="info-item__label">Restante:</span>
            <span class="info-item__value">{{ formatCurrency(remaining() / 100) }}</span>
            </div>

            @if (goal.deadline) {
            <div class="info-item">
              <span class="info-item__label">Prazo:</span>
              <span class="info-item__value">{{ formatDate(goal.deadline) }}</span>
            </div>
            } @if (goal.sourceAccountId) {
            <div class="info-item">
              <span class="info-item__label">Conta Origem:</span>
              <span class="info-item__value">{{ goal.sourceAccountId }}</span>
            </div>
            }
          </div>
        </section>

        <section class="goal-detail-page__card">
          <h2 class="goal-detail-page__card-title">Progresso</h2>
          <div class="goal-detail-page__progress-section">
            <div class="goal-detail-page__progress-info">
              <span class="goal-detail-page__progress-label">Progresso</span>
              <span class="goal-detail-page__progress-value">{{ progressPercentage() }}%</span>
            </div>
            <os-progress-bar
              [value]="progressPercentage()"
              [variant]="getProgressVariant()"
              [ariaLabel]="'Progresso da meta: ' + progressPercentage() + '%'"
            />
            @if (suggestedMonthly()) {
            <div class="goal-detail-page__suggested">
              <span class="goal-detail-page__suggested-label">Aporte sugerido (mês):</span>
              <span class="goal-detail-page__suggested-value">{{
                formatCurrency((suggestedMonthly()! ?? 0) / 100)
              }}</span>
            </div>
            }
          </div>
        </section>

        <section class="goal-detail-page__card">
          <h2 class="goal-detail-page__card-title">Ações</h2>
          <div class="goal-detail-page__actions-section">
            <os-button
              variant="primary"
              size="medium"
              icon="plus"
              (buttonClick)="openAddModal()"
              [attr.aria-label]="'Aportar na meta ' + goal.name"
            >
              Aportar
            </os-button>
            <os-button
              variant="secondary"
              size="medium"
              icon="minus"
              (buttonClick)="openRemoveModal()"
              [attr.aria-label]="'Remover valor da meta ' + goal.name"
            >
              Remover
            </os-button>
          </div>
        </section>
      </main>
      } @else {
      <os-page-header title="Meta não encontrada" [breadcrumbs]="breadcrumbs()" />
      <os-alert
        type="warning"
        title="Meta não encontrada"
        [role]="'alert'"
        [ariaLive]="'polite'"
        [showIcon]="true"
        [dismissible]="false"
      >
        A meta que você está procurando não existe ou foi removida.
        <div class="goal-detail-page__error-action">
          <os-button
            variant="primary"
            size="medium"
            icon="arrow-left"
            (buttonClick)="navigateToList()"
            [attr.aria-label]="'Voltar para lista de metas'"
          >
            Voltar para Lista
          </os-button>
        </div>
      </os-alert>
      } } } @if (showDeleteConfirmModal()) {
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
  styleUrl: './goal-detail.page.scss',
})
export class GoalDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly state = inject(GoalsState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly localeService = inject(LocaleService);

  readonly loading = this.state.isLoading;
  readonly error = this.state.error;

  readonly goalId = signal<string | null>(null);
  readonly showDeleteConfirm = signal(false);

  readonly goal = computed(() => {
    const id = this.goalId();
    if (!id) return null;
    return this.state.items().find((g) => g.id === id) || null;
  });

  readonly progressPercentage = computed(() => {
    const g = this.goal();
    if (!g) return 0;
    return this.state.progressById()(g.id);
  });

  readonly remaining = computed(() => {
    const g = this.goal();
    if (!g) return 0;
    return this.state.remainingById()(g.id);
  });

  readonly suggestedMonthly = computed(() => {
    const g = this.goal();
    if (!g) return null;
    return this.state.suggestedMonthlyById()(g.id);
  });

  readonly currentState = computed(() => {
    if (this.loading()) return 'loading';
    if (this.error()) return 'error';
    return 'success';
  });

  readonly errorMessage = computed(() => this.error() || 'Erro ao carregar meta');

  readonly subtitle = computed(() => {
    const g = this.goal();
    if (!g) return '';
    return g.deadline ? `Meta até ${this.formatDate(g.deadline)}` : 'Meta sem prazo definido';
  });

  readonly showDeleteConfirmModal = computed(() => {
    return this.showDeleteConfirm();
  });

  readonly deleteModalConfig = computed<ModalTemplateConfig>(() => {
    const goal = this.goal();
    return {
      title: 'Excluir Meta',
      subtitle: goal
        ? `Tem certeza que deseja excluir a meta "${goal.name}"? Esta ação não pode ser desfeita.`
        : 'Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita.',
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

  readonly breadcrumbs = computed((): BreadcrumbItem[] => [
    { label: 'Metas', route: '/goals' },
    { label: this.goal()?.name || 'Detalhes', route: undefined },
  ]);

  readonly pageHeaderActions = computed((): PageHeaderAction[] => {
    const goal = this.goal();
    if (!goal) return [];

    return [
      {
        label: 'Excluir',
        variant: 'danger',
        size: 'medium',
        icon: 'trash',
      },
    ];
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.goalId.set(id);

    const budgetId = this.budgetSelection.selectedBudgetId();
    if (this.state.items().length === 0 && budgetId) {
      this.state.load(budgetId);
    }
  }

  navigateToList(): void {
    this.router.navigate(['/goals']);
  }

  formatCurrency(value: number): string {
    return this.localeService.formatCurrency(value, 'BRL');
  }

  formatDate(dateString: string): string {
    return this.localeService.formatDate(new Date(dateString));
  }

  getProgressVariant(): 'success' | 'warning' | 'primary' | 'secondary' | 'danger' {
    const progress = this.progressPercentage();
    if (progress >= 100) return 'success';
    if (progress >= 75) return 'primary';
    if (progress >= 50) return 'primary';
    if (progress >= 25) return 'warning';
    return 'warning';
  }

  confirmDelete(): void {
    this.showDeleteConfirm.set(true);
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
    const goal = this.goal();
    if (!goal) {
      this.onDeleteCancelled();
      return;
    }

    this.state.delete({ id: goal.id });
    this.onDeleteCancelled();
    this.navigateToList();
  }

  onDeleteCancelled(): void {
    this.showDeleteConfirm.set(false);
  }

  openAddModal(): void {
    const id = this.goalId();
    if (id) {
      this.router.navigate(['/goals', id, 'add-amount']);
    }
  }

  openRemoveModal(): void {
    const id = this.goalId();
    if (id) {
      this.router.navigate(['/goals', id, 'remove-amount']);
    }
  }

  onPageHeaderActionClick(action: PageHeaderAction): void {
    if (action.label === 'Excluir') {
      this.confirmDelete();
    }
  }

  onBreadcrumbClick(breadcrumb: BreadcrumbItem): void {
    if (breadcrumb.route) {
      this.router.navigate([breadcrumb.route]);
    }
  }
}
