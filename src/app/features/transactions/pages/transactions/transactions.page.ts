import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  HostListener,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  OnInit,
  untracked,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OsPageHeaderComponent } from '../../../../shared/ui-components/organisms/os-page-header/os-page-header.component';
import { OsPageComponent } from '../../../../shared/ui-components/organisms/os-page/os-page.component';
import {
  OsTransactionListComponent,
  type Transaction as UiTransaction,
  type TransactionListPagination,
  type TransactionCardAction,
} from '../../../../shared/ui-components/organisms/os-transaction-list/os-transaction-list.component';
import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import { TransactionsApiService } from '../../../transactions/services/transactions-api.service';
import type { TransactionDto } from '../../../../../dtos/transaction/transaction-types';
import { lastValueFrom } from 'rxjs';
import {
  TransactionsFiltersComponent,
  type TransactionsFilters,
} from '../../components/transactions-filters/transactions-filters.component';
import { TransactionFormComponent } from '../../components/transaction-form/transaction-form.component';
import type { PageHeaderAction } from '../../../../shared/ui-components/organisms/os-page-header/os-page-header.component';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { OsModalTemplateComponent } from '../../../../shared/ui-components/templates/os-modal-template/os-modal-template.component';
import type { ModalTemplateConfig } from '../../../../shared/ui-components/templates/os-modal-template/os-modal-template.component';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { AccountState } from '../../../../core/services/account/account-state/account.state';

@Component({
  selector: 'os-transactions-page',
  imports: [
    CommonModule,
    OsPageComponent,
    OsPageHeaderComponent,
    OsTransactionListComponent,
    TransactionsFiltersComponent,
    TransactionFormComponent,
    OsModalTemplateComponent,
  ],
  template: `
    <os-page variant="default" size="medium" ariaLabel="Página de transações">
      <os-page-header
        title="Transações"
        subtitle="Gerencie suas transações financeiras"
        [actions]="headerActions()"
        [breadcrumbs]="[]"
        (actionClick)="onHeaderActionClick($event)"
      />

      <os-transactions-filters
        [accountOptions]="accountOptions()"
        (filtersChange)="onFiltersChange($event)"
        [attr.aria-label]="'Filtros de transações'"
      />

      <os-transaction-list
        [title]="'Lista'"
        [transactions]="filteredTransactions()"
        [isLoading]="isLoading()"
        [lastUpdated]="lastUpdated()"
        [layout]="'card'"
        [variant]="'default'"
        [size]="'medium'"
        [enableInfiniteScroll]="true"
        [hasMoreData]="hasMore()"
        [showFilters]="false"
        [cardActions]="cardActions()"
        (refresh)="onRefresh()"
        (pageChange)="onPageChange($event)"
        (cardActionClick)="onCardActionClick($event)"
        [attr.aria-label]="'Lista de transações'"
      />

      @if (showCreateModal()) {
      <os-transaction-form
        [accountOptions]="accountOptions()"
        (saved)="onFormSaved()"
        (cancelled)="onFormCancelled()"
      />
      } @if (showEditModal() && editingTransaction()) {
      <os-transaction-form
        [transaction]="editingTransaction()"
        [accountOptions]="accountOptions()"
        (saved)="onFormSaved()"
        (cancelled)="onFormCancelled()"
      />
      } @if (showConfirmModal()) {
      <os-modal-template
        [config]="confirmModalConfig()"
        [variant]="'compact'"
        [size]="'small'"
        [disabled]="actionLoading()"
        [loading]="actionLoading()"
        [valid]="true"
        (actionClick)="onConfirmActionClick($event)"
        (cancelled)="onConfirmCancelled()"
        (closed)="onConfirmCancelled()"
      />
      }
    </os-page>
  `,
  styleUrl: './transactions.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsPage implements OnInit, AfterViewInit, OnDestroy {
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly api = inject(TransactionsApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly accountState = inject(AccountState);
  private readonly elementRef = inject(ElementRef);
  private readonly route = inject(ActivatedRoute);

  readonly isLoading = signal<boolean>(false);
  readonly lastUpdated = signal<Date>(new Date());
  private readonly loadedPages = signal<number>(0);
  private readonly pageSize = signal<number>(20);
  private readonly hasNext = signal<boolean>(true);
  readonly hasMore = computed(() => this.hasNext());
  private readonly allItems = signal<UiTransaction[]>([]);
  private readonly serverFilters = signal<Partial<TransactionsFilters>>({});
  private readonly clientFilters = signal<Partial<TransactionsFilters>>({});

  readonly accountOptions = computed<{ value: string; label: string }[]>(() => {
    const accounts = this.accountState.accountsByBudgetId();
    return accounts.map((account) => ({
      value: account.id,
      label: account.name,
    }));
  });

  private readonly _showCreateModal = signal<boolean>(false);
  readonly showCreateModal = this._showCreateModal.asReadonly();

  private readonly _editingTransaction = signal<TransactionDto | null>(null);
  readonly editingTransaction = this._editingTransaction.asReadonly();

  readonly showEditModal = computed(() => this._editingTransaction() !== null);

  private readonly _confirmModalType = signal<'delete' | 'markLate' | 'cancelScheduled' | null>(
    null
  );
  private readonly _confirmTransaction = signal<UiTransaction | null>(null);
  readonly confirmModalType = this._confirmModalType.asReadonly();
  readonly confirmTransaction = this._confirmTransaction.asReadonly();
  readonly showConfirmModal = computed(() => this._confirmModalType() !== null);

  private readonly _actionLoading = signal<boolean>(false);
  readonly actionLoading = this._actionLoading.asReadonly();

  readonly filteredTransactions = computed(() => {
    const items = this.allItems();
    const clientFiltersValue = this.clientFilters();

    if (!clientFiltersValue.type && clientFiltersValue.amount === undefined) {
      return items;
    }

    return items.filter((item) => {
      if (clientFiltersValue.type && item.type !== clientFiltersValue.type) {
        return false;
      }
      if (
        clientFiltersValue.amount !== undefined &&
        clientFiltersValue.amount !== null &&
        item.amount !== clientFiltersValue.amount
      ) {
        return false;
      }
      return true;
    });
  });

  trackByTransactionId(_index: number, transaction: UiTransaction): string {
    return transaction.id;
  }

  readonly cardActions = computed<TransactionCardAction[]>(() => {
    return [
      {
        id: 'mark-late',
        label: 'Marcar como Atrasada',
        icon: 'warning',
        variant: 'default',
      },
      {
        id: 'cancel-scheduled',
        label: 'Cancelar Agendada',
        icon: 'cancel',
        variant: 'default',
      },
      {
        id: 'delete',
        label: 'Excluir',
        icon: 'delete',
        variant: 'danger',
      },
    ];
  });

  readonly confirmModalConfig = computed<ModalTemplateConfig>(() => {
    const type = this._confirmModalType();
    const transaction = this._confirmTransaction();

    if (!type || !transaction) {
      return {
        title: 'Confirmar ação',
        subtitle: '',
        showActions: true,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: 'Cancelar',
        actions: [],
      };
    }

    const actions: ModalTemplateConfig['actions'] = [
      {
        label: 'Confirmar',
        variant: type === 'delete' ? 'danger' : 'primary',
        size: 'medium',
        loading: this._actionLoading(),
        disabled: this._actionLoading(),
      },
    ];

    switch (type) {
      case 'delete':
        return {
          title: 'Excluir Transação',
          subtitle: `Tem certeza que deseja excluir a transação "${transaction.description}"? Esta ação não pode ser desfeita.`,
          showActions: true,
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: 'Cancelar',
          actions,
        };
      case 'markLate':
        return {
          title: 'Marcar como Atrasada',
          subtitle: `Deseja marcar a transação "${transaction.description}" como atrasada?`,
          showActions: true,
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: 'Cancelar',
          actions,
        };
      case 'cancelScheduled':
        return {
          title: 'Cancelar Transação Agendada',
          subtitle: `Deseja cancelar a transação agendada "${transaction.description}"?`,
          showActions: true,
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: 'Cancelar',
          actions,
        };
      default:
        return {
          title: 'Confirmar ação',
          subtitle: '',
          showActions: true,
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: 'Cancelar',
          actions,
        };
    }
  });

  constructor() {
    effect(() => {
      const budgetId = this.budgetSelection.selectedBudgetId();
      untracked(() => {
        if (budgetId) {
          this.resetAndLoad(budgetId);
          this.accountState.loadAccounts();
        } else {
          this.clearData();
        }
      });
    });
  }

  ngOnInit(): void {
    const budgetIdFromQuery = this.route.snapshot.queryParamMap.get('budgetId');
    if (budgetIdFromQuery) {
      const wasSelected = this.budgetSelection.selectBudgetById(budgetIdFromQuery);
      if (!wasSelected) {
        this.resetAndLoad(budgetIdFromQuery);
      }
    } else {
      const currentBudgetId = this.budgetSelection.selectedBudgetId();
      if (!currentBudgetId) {
        const availableBudgets = this.budgetSelection.availableBudgets();
        if (availableBudgets.length > 0) {
          this.budgetSelection.setSelectedBudget(availableBudgets[0]);
        }
      }
    }
  }

  ngAfterViewInit(): void {
    const skipLink = this.elementRef.nativeElement.querySelector(
      '.os-transactions__skip-link'
    ) as HTMLAnchorElement;
    if (skipLink) {
      skipLink.addEventListener('click', this.handleSkipLinkClick);
    }
  }

  ngOnDestroy(): void {
    const skipLink = this.elementRef.nativeElement.querySelector(
      '.os-transactions__skip-link'
    ) as HTMLAnchorElement;
    if (skipLink) {
      skipLink.removeEventListener('click', this.handleSkipLinkClick);
    }
  }

  private readonly handleSkipLinkClick = (e: Event): void => {
    e.preventDefault();
    const mainContent = this.elementRef.nativeElement.querySelector('#main-content') as HTMLElement;
    if (mainContent) {
      mainContent.focus();
    }
  };

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (this.showCreateModal()) {
        this.onFormCancelled();
      } else if (this.showEditModal()) {
        this.onFormCancelled();
      } else if (this.showConfirmModal()) {
        this.onConfirmCancelled();
      }
    }
  }

  onFiltersChange(filters: TransactionsFilters): void {
    const serverFilters: Partial<TransactionsFilters> = {};
    const clientFilters: Partial<TransactionsFilters> = {};

    if (filters.accountId) serverFilters.accountId = filters.accountId;
    if (filters.categoryId) serverFilters.categoryId = filters.categoryId;
    if (filters.dateFrom) serverFilters.dateFrom = filters.dateFrom;
    if (filters.dateTo) serverFilters.dateTo = filters.dateTo;
    if (filters.type) clientFilters.type = filters.type;
    if (filters.amount !== undefined && filters.amount !== null) {
      clientFilters.amount = filters.amount;
    }

    this.serverFilters.set(serverFilters);
    this.clientFilters.set(clientFilters);

    const budgetId = this.budgetSelection.selectedBudgetId();
    if (budgetId) {
      this.resetAndLoad(budgetId);
    }
  }

  headerActions(): PageHeaderAction[] {
    return [
      {
        label: 'Atualizar',
        icon: 'refresh',
        variant: 'tertiary' as const,
        loading: this.isLoading(),
      },
      {
        label: 'Nova Transação',
        icon: 'add',
        variant: 'primary' as const,
      },
    ];
  }

  onHeaderActionClick(action: PageHeaderAction): void {
    if (action.label === 'Nova Transação') {
      this.onNewTransaction();
    } else if (action.label === 'Atualizar') {
      this.onRefresh();
    }
  }

  onNewTransaction(): void {
    this._showCreateModal.set(true);
  }

  onFormSaved(): void {
    this._showCreateModal.set(false);
    this._editingTransaction.set(null);
    const budgetId = this.budgetSelection.selectedBudgetId();
    if (budgetId) {
      this.resetAndLoad(budgetId);
    }
  }

  onFormCancelled(): void {
    this._showCreateModal.set(false);
    this._editingTransaction.set(null);
  }

  onRefresh(): void {
    const budgetId = this.budgetSelection.selectedBudgetId();
    if (budgetId) this.resetAndLoad(budgetId);
  }

  async onPageChange(p: TransactionListPagination): Promise<void> {
    const budgetId = this.budgetSelection.selectedBudgetId();
    if (!budgetId) return;

    const nextRequestedPage = p.page + 1;
    if (nextRequestedPage > this.loadedPages() && this.hasNext()) {
      await this.loadPage(budgetId, nextRequestedPage);
    }
  }

  private async resetAndLoad(budgetId: string): Promise<void> {
    this.clearData();
    await this.loadPage(budgetId, 1);
  }

  private clearData(): void {
    this.allItems.set([]);
    this.loadedPages.set(0);
    this.hasNext.set(true);
  }

  private async loadPage(budgetId: string, page: number): Promise<void> {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    try {
      const serverFiltersValue = this.serverFilters();
      const params = {
        budgetId,
        page,
        pageSize: this.pageSize(),
        ...(serverFiltersValue.accountId && { accountId: serverFiltersValue.accountId }),
        ...(serverFiltersValue.categoryId && { categoryId: serverFiltersValue.categoryId }),
        ...(serverFiltersValue.dateFrom && { dateFrom: serverFiltersValue.dateFrom }),
        ...(serverFiltersValue.dateTo && { dateTo: serverFiltersValue.dateTo }),
      };

      const res = await lastValueFrom(this.api.list(params));

      const dto = res.data;
      const mapped = dto.data.map((t) => this.mapToUiTransaction(t));
      this.allItems.update((items) => {
        const existingIds = new Set(items.map((item) => item.id));
        const newItems = mapped.filter((item) => !existingIds.has(item.id));
        return [...items, ...newItems];
      });
      this.loadedPages.set(page);
      this.hasNext.set(dto.meta?.hasNext ?? false);
      this.lastUpdated.set(new Date());
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar transações';
      this.notificationService.showError(`Erro ${errorMessage}`);
      console.error('Erro ao carregar transações:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  onCardActionClick(event: { transaction: UiTransaction; action: TransactionCardAction }): void {
    const { transaction, action } = event;

    switch (action.id) {
      case 'delete':
        this._confirmModalType.set('delete');
        this._confirmTransaction.set(transaction);
        break;
      case 'mark-late':
        this._confirmModalType.set('markLate');
        this._confirmTransaction.set(transaction);
        break;
      case 'cancel-scheduled':
        this._confirmModalType.set('cancelScheduled');
        this._confirmTransaction.set(transaction);
        break;
    }
  }

  onConfirmActionClick(event: {
    label: string;
    variant: 'primary' | 'secondary' | 'tertiary' | 'danger';
    size: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
  }): void {
    if (event.label === 'Confirmar') {
      this.executeAction();
    }
  }

  onConfirmCancelled(): void {
    this._confirmModalType.set(null);
    this._confirmTransaction.set(null);
  }

  async executeAction(): Promise<void> {
    const type = this._confirmModalType();
    const transaction = this._confirmTransaction();

    if (!type || !transaction) return;

    this._actionLoading.set(true);

    try {
      const user = this.authService.currentUser();
      if (!user) {
        this.notificationService.showError('Usuário não autenticado');
        return;
      }

      const budgetId = this.budgetSelection.selectedBudgetId();
      if (!budgetId) {
        this.notificationService.showError('Nenhum orçamento selecionado');
        return;
      }

      switch (type) {
        case 'delete':
          await lastValueFrom(
            this.api.delete({
              userId: user.id,
              id: transaction.id,
            })
          );
          this.notificationService.showSuccess('Transação excluída com sucesso!');
          break;

        case 'markLate':
          await lastValueFrom(
            this.api.markLate({
              transactionId: transaction.id,
            })
          );
          this.notificationService.showSuccess('Transação marcada como atrasada!');
          break;

        case 'cancelScheduled':
          await lastValueFrom(
            this.api.cancelScheduled({
              userId: user.id,
              budgetId,
              transactionId: transaction.id,
              cancellationReason: 'Cancelado pelo usuário',
            })
          );
          this.notificationService.showSuccess('Transação agendada cancelada com sucesso!');
          break;
      }

      this.onConfirmCancelled();

      if (budgetId) {
        await this.resetAndLoad(budgetId);
      }
    } catch (error) {
      this.notificationService.showError(
        `Erro ao executar ação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      );
    } finally {
      this._actionLoading.set(false);
    }
  }

  private mapToUiTransaction(t: TransactionDto): UiTransaction {
    const rawType = (t.type || t.direction || 'EXPENSE').toString().toLowerCase();
    const type =
      rawType === 'income' || rawType === 'expense' || rawType === 'transfer'
        ? (rawType as UiTransaction['type'])
        : 'expense';
    const dateStr = t.transactionDate || t.date || new Date().toISOString();
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const transactionDate = new Date(date);
    transactionDate.setHours(0, 0, 0, 0);

    let status: UiTransaction['status'] = 'pending';
    if (transactionDate.getTime() === today.getTime()) {
      status = 'completed';
    } else if (transactionDate.getTime() < today.getTime()) {
      status = 'pending';
    } else {
      status = 'pending';
    }

    return {
      id: t.id,
      description: t.description,
      amount: t.amount,
      date,
      category: '',
      type,
      status,
      account: t.accountId,
    };
  }
}
