import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  untracked,
} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { AccountState } from '@core/services/account/account-state/account.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { AccountCardComponent } from '@shared/ui-components/molecules/account-card';
import { ConfirmDialogService } from '@core/services/confirm-dialog';
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import {
  OsPageHeaderComponent,
  PageHeaderAction,
} from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import { OsButtonComponent } from '@shared/ui-components/atoms/os-button/os-button.component';
import { OsEntityListComponent } from '@shared/ui-components/organisms/os-entity-list/os-entity-list.component';
import { OsAlertComponent } from '@shared/ui-components/molecules/os-alert/os-alert.component';
import type { AccountDto } from '../../../../../dtos/account/account-types';

@Component({
  selector: 'os-accounts-page',
  standalone: true,
  imports: [
    AccountCardComponent,
    OsPageComponent,
    OsPageHeaderComponent,
    OsButtonComponent,
    OsEntityListComponent,
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
    </os-page>
  `,
  styleUrl: './accounts.page.scss',
})
export class AccountsPage implements OnInit {
  readonly state = inject(AccountState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly authService = inject(AuthService);

  private _lastBudgetId: string | null = null;

  readonly selectedBudgetId = this.budgetSelection.selectedBudgetId;
  readonly accounts = computed(() => this.state.accountsByBudgetId());
  readonly hasAccounts = computed(() => this.accounts().length > 0);

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
        icon: 'exchange-alt',
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
  }

  retry(): void {
    this.state.clearError();
    this.state.loadAccounts();
  }

  openCreateModal(): void {
    this.router.navigate(['/accounts/new']);
  }

  openTransferModal(): void {
    if (!this.selectedBudgetId() || !this.hasAccounts()) {
      return;
    }
    this.router.navigate(['transfer'], { relativeTo: this.route });
  }

  onEditAccount(account: AccountDto): void {
    this.router.navigate([account.id], { relativeTo: this.route });
  }

  async onDeleteAccount(account: AccountDto): Promise<void> {
    const confirmed = await this.confirmDialogService.open({
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir a conta "${account.name}"? Esta ação não pode ser desfeita. Se a conta possuir transações vinculadas, a exclusão será bloqueada.`,
      variant: 'danger',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
    });

    if (confirmed) {
      const user = this.authService.currentUser();
      if (user) {
        this.state.deleteAccount({
          userId: user.id,
          accountId: account.id,
        });
      }
    }
  }
}
