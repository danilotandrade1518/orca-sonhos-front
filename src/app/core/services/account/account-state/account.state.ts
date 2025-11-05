import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import type {
  AccountDto,
  CreateAccountRequestDto,
  DeleteAccountRequestDto,
  ReconcileAccountRequestDto,
  TransferBetweenAccountsRequestDto,
  UpdateAccountRequestDto,
} from '../../../../../dtos/account';
import { BudgetSelectionService } from '../../budget-selection/budget-selection.service';
import { AccountsApiService } from '../accounts-api/accounts-api.service';

@Injectable({
  providedIn: 'root',
})
export class AccountState {
  private readonly accountsApi = inject(AccountsApiService);
  private readonly budgetSelectionService = inject(BudgetSelectionService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _accounts = signal<AccountDto[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly accounts = this._accounts.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasAccounts = computed(() => this._accounts().length > 0);
  readonly accountsCount = computed(() => this._accounts().length);

  readonly accountsByBudgetId = computed(() => {
    const budgetId = this.budgetSelectionService.selectedBudgetId();
    if (!budgetId) {
      return [];
    }
    return this._accounts();
  });

  readonly selectedBudgetId = this.budgetSelectionService.selectedBudgetId;

  loadAccounts(): void {
    const budgetId = this.budgetSelectionService.selectedBudgetId();

    if (!budgetId) {
      this._error.set('Nenhum orçamento selecionado');
      return;
    }

    if (this._loading()) {
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    this.accountsApi
      .listAccounts(budgetId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (accounts) => {
          this._accounts.set(accounts);
          this._loading.set(false);
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao carregar contas');
          this._loading.set(false);
        },
      });
  }

  createAccount(dto: CreateAccountRequestDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.accountsApi
      .createAccount(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (accountId) => {
          if (accountId) {
            this.loadAccounts();
          } else {
            this._error.set('Falha ao criar conta');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao criar conta');
          this._loading.set(false);
        },
      });
  }

  updateAccount(dto: UpdateAccountRequestDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.accountsApi
      .updateAccount(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          if (success) {
            this.loadAccounts();
          } else {
            this._error.set('Falha ao atualizar conta');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao atualizar conta');
          this._loading.set(false);
        },
      });
  }

  deleteAccount(dto: DeleteAccountRequestDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.accountsApi
      .deleteAccount(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          if (success) {
            this.loadAccounts();
          } else {
            this._error.set('Falha ao excluir conta. A conta pode ter transações vinculadas.');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(
            error?.message ||
              'Erro ao excluir conta. A conta pode ter transações vinculadas e não pode ser excluída.'
          );
          this._loading.set(false);
        },
      });
  }

  transferBetweenAccounts(dto: TransferBetweenAccountsRequestDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.accountsApi
      .transferBetweenAccounts(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          if (success) {
            this.loadAccounts();
          } else {
            this._error.set('Falha ao transferir entre contas');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao transferir entre contas');
          this._loading.set(false);
        },
      });
  }

  reconcileAccount(dto: ReconcileAccountRequestDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.accountsApi
      .reconcileAccount(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          if (success) {
            this.loadAccounts();
          } else {
            this._error.set('Falha ao reconciliar conta');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao reconciliar conta');
          this._loading.set(false);
        },
      });
  }

  clearError(): void {
    this._error.set(null);
  }

  refreshAccounts(): void {
    this.loadAccounts();
  }
}
