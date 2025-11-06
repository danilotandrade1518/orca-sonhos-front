import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountState } from '@core/services/account/account-state/account.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AccountCardComponent } from '@shared/ui-components/molecules/account-card';
import { AccountFormComponent } from '../../components/account-form/account-form.component';
import { TransferModalComponent } from '../../components/transfer-modal/transfer-modal.component';
import { ReconcileModalComponent } from '../../components/reconcile-modal/reconcile-modal.component';
import { ConfirmDeleteModalComponent } from '../../components/confirm-delete-modal/confirm-delete-modal.component';
import type { AccountDto } from '../../../../../dtos/account/account-types';

@Component({
  selector: 'os-accounts-page',
  standalone: true,
  imports: [
    CommonModule,
    AccountCardComponent,
    AccountFormComponent,
    TransferModalComponent,
    ReconcileModalComponent,
    ConfirmDeleteModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="os-accounts" role="main" aria-label="Página de contas">
      <a href="#main-content" class="os-accounts__skip-link">Pular para conteúdo principal</a>

      <header class="os-accounts__header">
        <div class="os-accounts__header-content">
          <div>
            <h1 class="os-accounts__title">Contas</h1>
            <p class="os-accounts__subtitle">Gerencie suas contas financeiras</p>
          </div>
          <div class="os-accounts__actions">
            <button
              type="button"
              class="os-accounts__action-button os-accounts__action-button--primary"
              (click)="openCreateModal()"
              [disabled]="!selectedBudgetId()"
              aria-label="Criar nova conta"
            >
              Nova Conta
            </button>
            <button
              type="button"
              class="os-accounts__action-button os-accounts__action-button--secondary"
              (click)="openTransferModal()"
              [disabled]="!selectedBudgetId() || !hasAccounts()"
              aria-label="Transferir entre contas"
            >
              Transferir
            </button>
            <button
              type="button"
              class="os-accounts__action-button os-accounts__action-button--secondary"
              (click)="openReconcileModal()"
              [disabled]="!selectedBudgetId() || !hasAccounts()"
              aria-label="Reconciliar conta"
            >
              Reconciliar
            </button>
          </div>
        </div>
      </header>

      <div
        class="os-accounts__live-region"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        [attr.aria-label]="state.loading() ? 'Carregando contas' : ''"
      >
        {{ state.loading() ? 'Carregando contas...' : '' }}
      </div>

      @if (state.error()) {
      <div
        class="os-accounts__live-region os-accounts__live-region--error"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        {{ state.error() }}
      </div>
      }

      <div id="main-content" tabindex="-1" class="os-accounts__content">
        @switch (currentState()) { @case ('loading') {
        <div
          class="os-accounts__loading"
          role="status"
          aria-live="polite"
          aria-label="Carregando contas"
        >
          <div class="os-accounts__spinner" aria-hidden="true"></div>
          <p>Carregando contas...</p>
        </div>
        } @case ('error') {
        <div class="os-accounts__error" role="alert" aria-live="assertive">
          <p class="os-accounts__error-message">{{ errorMessage() }}</p>
          <button
            type="button"
            class="os-accounts__retry-button"
            (click)="retry()"
            aria-label="Tentar carregar contas novamente"
          >
            Tentar Novamente
          </button>
        </div>
        } @case ('empty') {
        <div class="os-accounts__empty" role="status" aria-live="polite">
          <div class="os-accounts__empty-icon" aria-hidden="true">💰</div>
          <h2 class="os-accounts__empty-title">Nenhuma conta cadastrada</h2>
          <p class="os-accounts__empty-description">
            Crie sua primeira conta para começar a gerenciar suas finanças
          </p>
          <button
            type="button"
            class="os-accounts__create-button"
            (click)="openCreateModal()"
            [disabled]="!selectedBudgetId()"
            aria-label="Criar primeira conta"
          >
            Criar primeira conta
          </button>
        </div>
        } @default {
        <div class="os-accounts__grid">
          @for (account of accounts(); track account.id) {
          <os-account-card
            [account]="account"
            [actions]="{ edit: true, delete: true }"
            (edit)="onEditAccount($event)"
            (delete)="onDeleteAccount($event)"
          />
          }
        </div>
        } }
      </div>

      @if (showCreateModal()) {
      <os-account-form [mode]="'create'" (saved)="onFormSaved()" (cancelled)="onFormCancelled()" />
      } @if (showEditModal() && editingAccount()) {
      <os-account-form
        [account]="editingAccount()!"
        [mode]="'edit'"
        (saved)="onFormSaved()"
        (cancelled)="onFormCancelled()"
      />
      } @if (showTransferModal()) {
      <os-transfer-modal (closed)="closeTransferModal()" />
      } @if (showReconcileModal() && reconcilingAccount()) {
      <os-reconcile-modal
        [account]="reconcilingAccount()!"
        (closed)="closeReconcileModal()"
      />
      } @if (showDeleteModal() && deletingAccount()) {
      <os-confirm-delete-modal
        [account]="deletingAccount()!"
        (closed)="closeDeleteModal()"
      />
      }
    </section>
  `,
  styleUrl: './accounts.page.scss',
})
export class AccountsPage implements OnInit {
  readonly state = inject(AccountState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private _lastBudgetId: string | null = null;

  readonly selectedBudgetId = this.budgetSelection.selectedBudgetId;
  readonly accounts = computed(() => this.state.accountsByBudgetId());
  readonly hasAccounts = computed(() => this.accounts().length > 0);

  readonly editingAccount = signal<AccountDto | null>(null);
  readonly deletingAccount = signal<AccountDto | null>(null);
  readonly reconcilingAccount = signal<AccountDto | null>(null);

  readonly showCreateModal = computed(() => {
    return this.route.snapshot.data['modalMode'] === 'create';
  });

  readonly showEditModal = computed(() => {
    return this.route.snapshot.data['modalMode'] === 'edit' && this.editingAccount() !== null;
  });

  readonly showTransferModal = signal(false);
  readonly showReconcileModal = signal(false);
  readonly showDeleteModal = signal(false);

  readonly currentState = computed(() => {
    if (this.state.loading()) return 'loading';
    if (this.state.error()) return 'error';
    if (!this.selectedBudgetId()) return 'empty';
    if (this.accounts().length === 0) return 'empty';
    return 'success';
  });

  readonly errorMessage = computed(() => this.state.error() || 'Erro ao carregar contas');

  constructor() {
    effect(() => {
      const budgetId = this.selectedBudgetId();

      if (budgetId === this._lastBudgetId || this.state.loading()) {
        return;
      }

      untracked(() => {
        if (budgetId) {
          this._lastBudgetId = budgetId;
          this.state.loadAccounts();
        } else {
          this._lastBudgetId = null;
        }
      });
    });
  }

  ngOnInit(): void {
    const budgetId = this.selectedBudgetId();
    if (budgetId) {
      this.state.loadAccounts();
    }
    
    const accountId = this.route.snapshot.paramMap.get('id');
    if (accountId && this.route.snapshot.data['modalMode'] === 'edit') {
      const accounts = this.state.accounts();
      const account = accounts.find((a) => a.id === accountId);
      if (account) {
        this.editingAccount.set(account);
      }
    }
  }

  retry(): void {
    this.state.clearError();
    this.state.loadAccounts();
  }

  openCreateModal(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  openTransferModal(): void {
    if (!this.selectedBudgetId() || !this.hasAccounts()) {
      return;
    }
    this.showTransferModal.set(true);
  }

  openReconcileModal(): void {
    if (!this.selectedBudgetId() || !this.hasAccounts()) {
      return;
    }
    const firstAccount = this.accounts()[0];
    if (firstAccount) {
      this.reconcilingAccount.set(firstAccount);
      this.showReconcileModal.set(true);
    }
  }

  onEditAccount(account: AccountDto): void {
    this.editingAccount.set(account);
    this.router.navigate([account.id, 'edit'], { relativeTo: this.route });
  }

  onDeleteAccount(account: AccountDto): void {
    this.deletingAccount.set(account);
    this.showDeleteModal.set(true);
  }

  closeTransferModal(): void {
    this.showTransferModal.set(false);
  }

  closeReconcileModal(): void {
    this.showReconcileModal.set(false);
    this.reconcilingAccount.set(null);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.deletingAccount.set(null);
  }

  onFormSaved(): void {
    this.editingAccount.set(null);
    this.router.navigate(['/accounts'], { replaceUrl: true });
  }

  onFormCancelled(): void {
    this.editingAccount.set(null);
    this.router.navigate(['/accounts'], { replaceUrl: true });
  }
}
