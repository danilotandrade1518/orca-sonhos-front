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
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import { OsPageHeaderComponent, PageHeaderAction } from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import { OsButtonComponent } from '@shared/ui-components/atoms/os-button/os-button.component';
import { OsEntityListComponent } from '@shared/ui-components/organisms/os-entity-list/os-entity-list.component';
import { OsEmptyStateComponent } from '@shared/ui-components/molecules/os-empty-state/os-empty-state.component';
import { OsSkeletonComponent } from '@shared/ui-components/atoms/os-skeleton/os-skeleton.component';
import { OsAlertComponent } from '@shared/ui-components/molecules/os-alert/os-alert.component';
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
    OsPageComponent,
    OsPageHeaderComponent,
    OsButtonComponent,
    OsEntityListComponent,
    OsEmptyStateComponent,
    OsSkeletonComponent,
    OsAlertComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Página de contas">
      <os-page-header
        title="Contas"
        subtitle="Gerencie suas contas financeiras"
        [actions]="pageHeaderActions()"
        (actionClick)="onPageHeaderActionClick($event)"
      />

      @if (currentState() === 'error') {
      <os-alert
        type="error"
        [title]="'Erro ao carregar contas'"
        [role]="'alert'"
        [ariaLive]="'assertive'"
        [showIcon]="true"
        [dismissible]="false"
      >
        {{ errorMessage() }}
        <div class="accounts-page__error-action">
          <os-button
            variant="primary"
            size="medium"
            icon="refresh"
            (buttonClick)="retry()"
            [attr.aria-label]="'Tentar carregar contas novamente'"
          >
            Tentar Novamente
          </os-button>
        </div>
      </os-alert>
      }

      <os-entity-list
        layout="grid"
        size="medium"
        [isLoading]="currentState() === 'loading'"
        [isEmpty]="currentState() === 'empty'"
        loadingText="Carregando contas..."
        emptyTitle="Nenhuma conta cadastrada"
        emptyText="Crie sua primeira conta para começar a gerenciar suas finanças"
        emptyIcon="account_balance"
        [emptyAction]="!!selectedBudgetId()"
        emptyActionLabel="Criar primeira conta"
        emptyActionIcon="plus"
        ariaLabel="Lista de contas"
        (emptyActionClick)="openCreateModal()"
      >
        @for (account of accounts(); track account.id) {
        <os-account-card
          [account]="account"
          [actions]="{ edit: true, delete: true }"
          (edit)="onEditAccount($event)"
          (delete)="onDeleteAccount($event)"
        />
        }
      </os-entity-list>

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
    </os-page>
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

  readonly pageHeaderActions = computed<PageHeaderAction[]>(() => {
    return [
      {
        label: 'Nova Conta',
        icon: 'plus',
        variant: 'primary',
        size: 'medium',
        disabled: !this.selectedBudgetId(),
      },
      {
        label: 'Transferir',
        icon: 'swap_horiz',
        variant: 'secondary',
        size: 'medium',
        disabled: !this.selectedBudgetId() || !this.hasAccounts(),
      },
      {
        label: 'Reconciliar',
        icon: 'check_circle',
        variant: 'secondary',
        size: 'medium',
        disabled: !this.selectedBudgetId() || !this.hasAccounts(),
      },
    ];
  });

  onPageHeaderActionClick(action: PageHeaderAction): void {
    if (action.label === 'Nova Conta') {
      this.openCreateModal();
    } else if (action.label === 'Transferir') {
      this.openTransferModal();
    } else if (action.label === 'Reconciliar') {
      this.openReconcileModal();
    }
  }

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
