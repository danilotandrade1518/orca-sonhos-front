import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  OnDestroy,
  signal,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BudgetState } from '@core/services/budget/budget.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { AccountState } from '@core/services/account/account-state/account.state';
import { SharingState } from '@core/services/sharing/sharing.state';
import { ReportsState } from '@features/reports/state/reports-state/reports.state';
import { OsDashboardWidgetsComponent, type DashboardWidget, type BudgetSummaryData } from '@shared/ui-components/organisms/os-dashboard-widgets/os-dashboard-widgets.component';
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
import { LocaleService } from '@shared/formatting';
import { ShareBudgetComponent } from '../../components/share-budget/share-budget.component';
import { CollaborationDashboardComponent } from '../../components/collaboration-dashboard/collaboration-dashboard.component';
import type { ModalTemplateConfig } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';

@Component({
  selector: 'os-budget-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    OsModalTemplateComponent,
    OsButtonComponent,
    OsPageComponent,
    OsPageHeaderComponent,
    OsSkeletonComponent,
    OsAlertComponent,
    ShareBudgetComponent,
    OsDashboardWidgetsComponent,
    CollaborationDashboardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Detalhes do orçamento">
      @switch (currentState()) { @case ('loading') {
      <os-page-header title="Carregando..." [breadcrumbs]="breadcrumbs()" />
      <div
        class="budget-detail-page__loading"
        role="status"
        aria-live="polite"
        aria-label="Carregando detalhes do orçamento"
      >
        <os-skeleton variant="card" size="lg" />
        <os-skeleton variant="card" size="lg" />
        <os-skeleton variant="card" size="lg" />
      </div>
      } @case ('error') {
      <os-page-header title="Erro" [breadcrumbs]="breadcrumbs()" />
      <os-alert
        type="error"
        [title]="'Erro ao carregar orçamento'"
        [role]="'alert'"
        [ariaLive]="'assertive'"
        [showIcon]="true"
        [dismissible]="false"
      >
        {{ errorMessage() }}
        <div class="budget-detail-page__error-action">
          <os-button
            variant="primary"
            size="medium"
            icon="arrow-left"
            (buttonClick)="navigateToList()"
            [attr.aria-label]="'Voltar para lista de orçamentos'"
          >
            Voltar para Lista
          </os-button>
        </div>
      </os-alert>
      } @default { @if (budget(); as budget) {
      <os-page-header
        [title]="budget.name"
        [subtitle]="budget.type === 'PERSONAL' ? 'Orçamento Pessoal' : 'Orçamento Compartilhado'"
        [breadcrumbs]="breadcrumbs()"
        [actions]="pageHeaderActions()"
        (actionClick)="onPageHeaderActionClick($event)"
        (breadcrumbClick)="onBreadcrumbClick($event)"
      />

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
          @if (dashboardWidgets().length > 0) {
          <os-dashboard-widgets
            [widgets]="dashboardWidgets()"
            [variant]="'default'"
            [size]="'medium'"
            [state]="'success'"
            [showCreateActions]="false"
            [ariaLabel]="'Resumo financeiro do orçamento ' + budget.name"
          />
          } @else {
          <div class="budget-detail-page__placeholder" role="status">
            <p>Carregando dados financeiros...</p>
          </div>
          }
          <div class="budget-detail-page__actions-section">
            <os-button
              variant="primary"
              size="medium"
              icon="receipt"
              (buttonClick)="navigateToTransactions()"
              [attr.aria-label]="'Ver transações do orçamento ' + budget.name"
            >
              Ver Transações
            </os-button>
          </div>
        </section>

        <section class="budget-detail-page__card">
          <div class="budget-detail-page__card-header">
            <h2 class="budget-detail-page__card-title">Contas do Orçamento</h2>
            <os-button
              variant="primary"
              size="small"
              icon="plus"
              (buttonClick)="navigateToCreateAccount()"
              [attr.aria-label]="'Criar nova conta para o orçamento ' + budget.name"
            >
              Criar Nova Conta
            </os-button>
          </div>

          @if (accountsLoading()) {
          <div class="budget-detail-page__accounts-loading" role="status" aria-live="polite">
            <p>Carregando contas...</p>
          </div>
          } @else if (accounts().length === 0) {
          <div class="budget-detail-page__accounts-empty" role="status">
            <p>Nenhuma conta cadastrada para este orçamento.</p>
            <os-button
              variant="primary"
              size="medium"
              icon="plus"
              (buttonClick)="navigateToCreateAccount()"
              [attr.aria-label]="'Criar primeira conta'"
            >
              Criar Primeira Conta
            </os-button>
          </div>
          } @else {
          <div class="budget-detail-page__accounts-list" role="list" aria-label="Lista de contas">
            @for (account of accounts(); track account.id) {
            <div class="budget-detail-page__account-item" role="listitem">
              <div class="budget-detail-page__account-info">
                <span class="budget-detail-page__account-name">{{ account.name }}</span>
                <span class="budget-detail-page__account-type">{{
                  getAccountTypeLabel(account.type)
                }}</span>
              </div>
              <span class="budget-detail-page__account-balance">
                {{ formatCurrency(account.balance) }}
              </span>
            </div>
            }
          </div>
          <div class="budget-detail-page__accounts-actions">
            <os-button
              variant="secondary"
              size="medium"
              (buttonClick)="navigateToAccounts()"
              [attr.aria-label]="'Ver todas as contas'"
            >
              Ver Todas as Contas
            </os-button>
          </div>
          }
        </section>

        <section class="budget-detail-page__card">
          <div class="budget-detail-page__card-header">
            <h2 class="budget-detail-page__card-title">Colaboração</h2>
            <os-button
              variant="primary"
              size="small"
              icon="users"
              (buttonClick)="openShareModal()"
              [attr.aria-label]="'Gerenciar participantes do orçamento ' + budget.name"
            >
              Gerenciar Participantes
            </os-button>
          </div>

          <os-collaboration-dashboard
            [budgetId]="budgetId()!"
            [creatorId]="creatorId()"
            (participantRemoved)="onCollaborationParticipantRemoved($event)"
          />
        </section>
      </main>
      } @else {
      <os-page-header title="Orçamento não encontrado" [breadcrumbs]="breadcrumbs()" />
      <os-alert
        type="warning"
        title="Orçamento não encontrado"
        [role]="'alert'"
        [ariaLive]="'polite'"
        [showIcon]="true"
        [dismissible]="false"
      >
        O orçamento que você está procurando não existe ou foi removido.
        <div class="budget-detail-page__error-action">
          <os-button
            variant="primary"
            size="medium"
            icon="arrow-left"
            (buttonClick)="navigateToList()"
            [attr.aria-label]="'Voltar para lista de orçamentos'"
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
      } @if (showShareModal()) {
      <os-share-budget
        [budgetId]="budgetId()!"
        [budgetName]="budget()?.name || ''"
        [creatorId]="currentUser()?.id || null"
        [isOpen]="showShareModal()"
        (opened)="onShareModalOpened()"
        (closed)="onShareModalClosed()"
        (participantAdded)="onParticipantAdded()"
        (participantRemoved)="onParticipantRemoved()"
      />
      }
    </os-page>
  `,
  styleUrl: './budget-detail.page.scss',
})
export class BudgetDetailPage implements OnInit, OnDestroy {
  private readonly budgetState = inject(BudgetState);
  private readonly budgetSelectionService = inject(BudgetSelectionService);
  private readonly authService = inject(AuthService);
  private readonly accountState = inject(AccountState);
  private readonly sharingState = inject(SharingState);
  private readonly reportsState = inject(ReportsState);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly localeService = inject(LocaleService);

  private _lastBudgetId: string | null = null;

  readonly loading = this.budgetState.loading;
  readonly error = this.budgetState.error;

  readonly currentUser = this.authService.currentUser;
  readonly accounts = computed(() => this.accountState.accountsByBudgetId());
  readonly accountsLoading = computed(() => this.accountState.loading());

  readonly budgetId = signal<string | null>(null);
  readonly showDeleteConfirm = signal(false);
  readonly showShareModal = signal(false);

  readonly participants = computed(() => this.sharingState.participants());
  readonly participantsCount = computed(() => this.sharingState.participantsCount());
  readonly participantsLoading = computed(() => this.sharingState.loading());

  readonly creatorId = computed(() => {
    const user = this.currentUser();
    return user?.id || null;
  });

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

  readonly showDeleteConfirmModal = computed(() => {
    return this.showDeleteConfirm();
  });

  readonly deleteModalConfig = computed<ModalTemplateConfig>(() => {
    const budget = this.budget();
    return {
      title: 'Excluir Orçamento',
      subtitle: budget
        ? `Tem certeza que deseja excluir o orçamento "${budget.name}"? Esta ação não pode ser desfeita.`
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

  readonly breadcrumbs = computed((): BreadcrumbItem[] => [
    { label: 'Orçamentos', route: '/budgets' },
    { label: this.budget()?.name || 'Detalhes', route: undefined },
  ]);

  readonly pageHeaderActions = computed((): PageHeaderAction[] => {
    const budget = this.budget();
    if (!budget) return [];

    return [
      {
        label: 'Editar',
        variant: 'secondary',
        size: 'medium',
        icon: 'edit',
      },
      {
        label: 'Excluir',
        variant: 'danger',
        size: 'medium',
        icon: 'trash',
      },
    ];
  });

  private resourcesLoaded = signal(false);

  readonly selectedBudgetId = computed(() => this.budgetSelectionService.selectedBudgetId());

  readonly budgetSummaryData = computed((): BudgetSummaryData | null => {
    const accounts = this.accounts();
    const revenueExpense = this.reportsState.revenueExpense();

    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    const monthlyIncome = revenueExpense?.revenue || 0;
    const monthlyExpense = revenueExpense?.expense || 0;
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100 : 0;
    const budgetUtilization = monthlyIncome > 0 ? (monthlyExpense / monthlyIncome) * 100 : 0;

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpense,
      savingsRate: Math.max(0, savingsRate),
      budgetUtilization: Math.min(100, Math.max(0, budgetUtilization)),
    };
  });

  readonly dashboardWidgets = computed((): DashboardWidget[] => {
    const summaryData = this.budgetSummaryData();
    if (!summaryData) {
      return [];
    }

    return [
      {
        id: 'widget-budget-summary',
        type: 'budget-summary',
        title: 'Resumo Financeiro',
        size: 'full-width',
        position: { row: 1, column: 1 },
        enabled: true,
        data: summaryData,
      },
    ];
  });

  constructor() {
    effect(() => {
      const budgets = this.budgetState.budgets();
      const routeBudgetId = this.budgetId();
      const currentSelectedId = this.selectedBudgetId();

      if (routeBudgetId && budgets.length > 0 && currentSelectedId !== routeBudgetId) {
        untracked(() => {
          const budget = budgets.find((b) => b.id === routeBudgetId);
          if (budget) {
            this.budgetState.selectBudget(routeBudgetId);
          }
        });
      }
    });

    effect(() => {
      const budgetId = this.selectedBudgetId();

      if (budgetId === this._lastBudgetId || this.resourcesLoaded()) {
        return;
      }

      untracked(() => {
        if (budgetId) {
          this._lastBudgetId = budgetId;
          this.loadResources(budgetId);
          this.reportsState.loadReports();
        } else {
          this._lastBudgetId = null;
        }
      });
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.budgetId.set(id);

    if (this.budgetState.budgets().length === 0) {
      this.budgetState.loadBudgets();
    } else {
      const budget = this.budgetState.budgets().find((b) => b.id === id);
      if (budget) {
        this.budgetState.selectBudget(id);
        this.cdr.markForCheck();
      }
    }
  }

  private loadResources(id: string): void {
    const selectedBudgetId = this.selectedBudgetId();

    if (!selectedBudgetId || selectedBudgetId !== id) {
      return;
    }

    if (this.resourcesLoaded()) {
      return;
    }

    try {
      this.accountState.loadAccounts();
      this.sharingState.loadParticipants(id);
      this.sharingState.startPolling(id);
      this.resourcesLoaded.set(true);
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading resources', error);
    }
  }

  ngOnDestroy(): void {
    const id = this.budgetId();
    if (id) {
      this.sharingState.stopPolling();
    }

    this.resourcesLoaded.set(false);
  }

  navigateToList(): void {
    this.router.navigate(['/budgets']);
  }

  navigateToTransactions(): void {
    const id = this.budgetId();
    if (id) {
      this.router.navigate(['/transactions'], { queryParams: { budgetId: id } });
    }
  }

  navigateToEdit(): void {
    const id = this.budgetId();
    if (id) {
      this.router.navigate(['/budgets', id, 'edit']);
    }
  }

  navigateToCreateAccount(): void {
    this.router.navigate(['/accounts'], { queryParams: { create: true } });
  }

  navigateToAccounts(): void {
    this.router.navigate(['/accounts']);
  }

  getAccountTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      CHECKING_ACCOUNT: 'Conta Corrente',
      SAVINGS_ACCOUNT: 'Poupança',
      PHYSICAL_WALLET: 'Carteira Física',
      DIGITAL_WALLET: 'Carteira Digital',
      INVESTMENT_ACCOUNT: 'Investimento',
      OTHER: 'Outros',
    };
    return labels[type] || type;
  }

  formatCurrency(value: number): string {
    return this.localeService.formatCurrency(value, 'BRL');
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
    const budget = this.budget();
    const user = this.currentUser();
    if (!budget || !user) {
      this.onDeleteCancelled();
      return;
    }

    this.budgetState.deleteBudget(user.id, budget.id);
    this.onDeleteCancelled();
    this.navigateToList();
  }

  onDeleteCancelled(): void {
    this.showDeleteConfirm.set(false);
  }

  openShareModal(): void {
    this.showShareModal.set(true);
  }

  onShareModalOpened(): void {
    const id = this.budgetId();
    if (id) {
      this.sharingState.loadParticipants(id);
    }
  }

  onShareModalClosed(): void {
    this.showShareModal.set(false);
    const id = this.budgetId();
    if (id) {
      this.sharingState.loadParticipants(id);
      this.budgetState.loadBudgets();
    }
  }

  onParticipantAdded(): void {
    const id = this.budgetId();
    if (id) {
      this.sharingState.loadParticipants(id);
      this.budgetState.loadBudgets();
    }
  }

  onParticipantRemoved(): void {
    const id = this.budgetId();
    if (id) {
      this.sharingState.loadParticipants(id);
      this.budgetState.loadBudgets();
    }
  }

  onCollaborationParticipantRemoved(participantId: string): void {
    const id = this.budgetId();
    if (id) {
      this.sharingState.loadParticipants(id);
      this.budgetState.loadBudgets();
    }
  }

  onPageHeaderActionClick(action: PageHeaderAction): void {
    if (action.label === 'Editar') {
      this.navigateToEdit();
    } else if (action.label === 'Excluir') {
      this.confirmDelete();
    }
  }

  onBreadcrumbClick(breadcrumb: BreadcrumbItem): void {
    if (breadcrumb.route) {
      this.router.navigate([breadcrumb.route]);
    }
  }
}
