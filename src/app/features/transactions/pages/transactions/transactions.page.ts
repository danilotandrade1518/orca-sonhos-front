import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { OsPageHeaderComponent } from '../../../../shared/ui-components/organisms/os-page-header/os-page-header.component';
import {
  OsTransactionListComponent,
  type Transaction as UiTransaction,
  type TransactionListPagination,
} from '../../../../shared/ui-components/organisms/os-transaction-list/os-transaction-list.component';
import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import { TransactionsApiService } from '../../../transactions/services/transactions-api.service';
import type { TransactionDto } from '../../../../../dtos/transaction/transaction-types';
import { lastValueFrom } from 'rxjs';
import {
  TransactionsFiltersComponent,
  type TransactionsFilters,
} from '../../components/transactions-filters/transactions-filters.component';

@Component({
  selector: 'os-transactions-page',
  imports: [
    CommonModule,
    OsPageHeaderComponent,
    OsTransactionListComponent,
    TransactionsFiltersComponent,
  ],
  template: `
    <section class="os-transactions" role="main">
      <os-page-header title="Transações" [actions]="headerActions()" [breadcrumbs]="[]" />

      <os-transactions-filters
        [accountOptions]="accountOptions()"
        [categoryOptions]="categoryOptions()"
        (filtersChange)="onFiltersChange($event)"
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
        [showFilters]="false"
        (refresh)="onRefresh()"
        (pageChange)="onPageChange($event)"
      />
    </section>
  `,
  styles: [
    `
      .os-transactions {
        padding: 16px;
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsPage {
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly api = inject(TransactionsApiService);

  readonly isLoading = signal<boolean>(false);
  readonly lastUpdated = signal<Date>(new Date());
  private readonly loadedPages = signal<number>(0);
  private readonly pageSize = signal<number>(20);
  private readonly hasNext = signal<boolean>(true);
  private readonly allItems = signal<UiTransaction[]>([]);
  private readonly serverFilters = signal<Partial<TransactionsFilters>>({});
  private readonly clientFilters = signal<Partial<TransactionsFilters>>({});

  readonly accountOptions = signal<{ value: string; label: string }[]>([]);
  readonly categoryOptions = signal<{ value: string; label: string }[]>([]);

  readonly filteredTransactions = computed(() => {
    let items = this.allItems();

    const clientFiltersValue = this.clientFilters();
    if (clientFiltersValue.type) {
      items = items.filter((item) => item.type === clientFiltersValue.type);
    }
    if (clientFiltersValue.amount !== undefined && clientFiltersValue.amount !== null) {
      items = items.filter((item) => item.amount === clientFiltersValue.amount);
    }

    return items;
  });

  constructor() {
    effect(() => {
      const budgetId = this.budgetSelection.selectedBudgetId();
      if (budgetId) {
        this.resetAndLoad(budgetId);
      } else {
        this.clearData();
      }
    });
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

  headerActions() {
    return [
      {
        label: 'Atualizar',
        icon: 'refresh',
        variant: 'tertiary' as const,
        loading: this.isLoading(),
      },
      { label: 'Nova Transação', icon: 'add', variant: 'primary' as const },
    ];
  }

  onRefresh(): void {
    const budgetId = this.budgetSelection.selectedBudgetId();
    if (budgetId) this.resetAndLoad(budgetId);
  }

  async onPageChange(p: TransactionListPagination): Promise<void> {
    const budgetId = this.budgetSelection.selectedBudgetId();
    if (!budgetId) return;

    const nextRequestedPage = p.page + 1; // componente é 0-based; backend 1-based
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

      const dto = res as unknown as {
        data: TransactionDto[];
        meta: { hasNext: boolean; page: number; pageSize: number };
      };
      const mapped = dto.data.map((t) => this.mapToUiTransaction(t));
      this.allItems.update((items) => [...items, ...mapped]);
      this.loadedPages.set(page);
      this.hasNext.set(dto.meta?.hasNext ?? false);
      this.lastUpdated.set(new Date());
    } finally {
      this.isLoading.set(false);
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
