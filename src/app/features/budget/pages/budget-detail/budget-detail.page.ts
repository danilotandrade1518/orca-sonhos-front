import {
  Component,
  computed,
  inject,
  OnInit,
  OnDestroy,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BudgetState } from '@core/services/budget/budget.state';
import { AuthService } from '@core/services/auth/auth.service';
import { AccountState } from '@core/services/account/account-state/account.state';
import { SharingState } from '@core/services/sharing/sharing.state';
import { OsModalTemplateComponent } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import { ShareBudgetComponent } from '../../components/share-budget/share-budget.component';
import type { ModalTemplateConfig } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';

@Component({
  selector: 'os-budget-detail-page',
  standalone: true,
  imports: [CommonModule, OsModalTemplateComponent, ShareBudgetComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="budget-detail-page">
      @switch (currentState()) { @case ('loading') {
      <div
        class="budget-detail-page__loading"
        role="status"
        aria-live="polite"
        aria-label="Carregando detalhes do orçamento"
      >
        <div class="spinner" aria-hidden="true"></div>
        <p>Carregando detalhes do orçamento...</p>
      </div>
      } @case ('error') {
      <div class="budget-detail-page__error" role="alert" aria-live="assertive">
        <p class="error-message">{{ errorMessage() }}</p>
        <button
          type="button"
          class="button button--secondary"
          (click)="navigateToList()"
          aria-label="Voltar para lista de orçamentos"
        >
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
          <button
            type="button"
            class="button button--secondary"
            (click)="navigateToEdit()"
            [attr.aria-label]="'Editar orçamento ' + budget.name"
          >
            Editar
          </button>
          <button
            type="button"
            class="button button--danger"
            (click)="confirmDelete()"
            [attr.aria-label]="'Excluir orçamento ' + budget.name"
          >
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
          <div class="budget-detail-page__actions-section">
            <button
              type="button"
              class="button button--primary"
              (click)="navigateToTransactions()"
              [attr.aria-label]="'Ver transações do orçamento ' + budget.name"
            >
              Ver Transações
            </button>
          </div>
        </section>

        <section class="budget-detail-page__card">
          <div class="budget-detail-page__card-header">
            <h2 class="budget-detail-page__card-title">Contas do Orçamento</h2>
            <button
              type="button"
              class="button button--primary button--small"
              (click)="navigateToCreateAccount()"
              [attr.aria-label]="'Criar nova conta para o orçamento ' + budget.name"
            >
              Criar Nova Conta
            </button>
          </div>

          @if (accountsLoading()) {
          <div class="budget-detail-page__accounts-loading" role="status" aria-live="polite">
            <p>Carregando contas...</p>
          </div>
          } @else if (accounts().length === 0) {
          <div class="budget-detail-page__accounts-empty" role="status">
            <p>Nenhuma conta cadastrada para este orçamento.</p>
            <button
              type="button"
              class="button button--primary"
              (click)="navigateToCreateAccount()"
              aria-label="Criar primeira conta"
            >
              Criar Primeira Conta
            </button>
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
            <button
              type="button"
              class="button button--secondary"
              (click)="navigateToAccounts()"
              aria-label="Ver todas as contas"
            >
              Ver Todas as Contas
            </button>
          </div>
          }
        </section>

        <section class="budget-detail-page__card">
          <div class="budget-detail-page__card-header">
            <h2 class="budget-detail-page__card-title">Colaboração</h2>
            <button
              type="button"
              class="button button--primary button--small"
              (click)="openShareModal()"
              [attr.aria-label]="'Gerenciar participantes do orçamento ' + budget.name"
            >
              Gerenciar Participantes
            </button>
          </div>

          @if (participantsLoading()) {
          <div class="budget-detail-page__participants-loading" role="status" aria-live="polite">
            <p>Carregando participantes...</p>
          </div>
          } @else if (participantsCount() === 0) {
          <div class="budget-detail-page__participants-empty" role="status">
            <p>Nenhum participante adicionado ainda.</p>
            <button
              type="button"
              class="button button--primary"
              (click)="openShareModal()"
              aria-label="Adicionar primeiro participante"
            >
              Adicionar Participante
            </button>
          </div>
          } @else {
          <div class="budget-detail-page__participants-info">
            <p>
              <strong>{{ participantsCount() }}</strong>
              {{ participantsCount() === 1 ? 'participante' : 'participantes' }}
            </p>
          </div>
          }
        </section>
      </main>
      } @else {
      <div class="budget-detail-page__not-found" role="alert" aria-live="polite">
        <h2>Orçamento não encontrado</h2>
        <p>O orçamento que você está procurando não existe ou foi removido.</p>
        <button
          type="button"
          class="button button--primary"
          (click)="navigateToList()"
          aria-label="Voltar para lista de orçamentos"
        >
          Voltar para Lista
        </button>
      </div>
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
    </div>
  `,
  styleUrl: './budget-detail.page.scss',
})
export class BudgetDetailPage implements OnInit, OnDestroy {
  private readonly budgetState = inject(BudgetState);
  private readonly authService = inject(AuthService);
  private readonly accountState = inject(AccountState);
  private readonly sharingState = inject(SharingState);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.budgetId.set(id);

      if (this.budgetState.budgets().length === 0) {
        this.budgetState.loadBudgets();
      }

      this.budgetState.selectBudget(id);
      this.accountState.loadAccounts();
      this.sharingState.loadParticipants(id);
      this.sharingState.startPolling(id);
    }
  }

  ngOnDestroy(): void {
    const id = this.budgetId();
    if (id) {
      this.sharingState.stopPolling();
    }
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
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
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
}
