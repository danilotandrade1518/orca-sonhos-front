import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsSpinnerComponent } from '../../atoms/os-spinner/os-spinner.component';
import {
  OsDataTableComponent,
  OsDataTableColumn,
  OsDataTableAction,
  OsDataTableRow,
} from '../../molecules/os-data-table/os-data-table.component';
import {
  OsFilterBarComponent,
  OsFilterOption,
  OsFilterBarVariant,
} from '../../molecules/os-filter-bar/os-filter-bar.component';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
  type: 'income' | 'expense' | 'transfer';
  status: 'pending' | 'completed' | 'cancelled';
  account?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface TransactionListFilter {
  key: string;
  value: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
}

export interface TransactionListSort {
  column: string;
  direction: 'asc' | 'desc';
}

export interface TransactionListPagination {
  page: number;
  pageSize: number;
  total: number;
}

export type TransactionListVariant = 'default' | 'compact' | 'detailed';
export type TransactionListSize = 'small' | 'medium' | 'large';
export type TransactionListTheme = 'light' | 'dark';

@Component({
  selector: 'os-transaction-list',
  standalone: true,
  imports: [
    CommonModule,
    OsButtonComponent,
    OsIconComponent,
    OsSpinnerComponent,
    OsDataTableComponent,
    OsFilterBarComponent,
  ],
  template: `
    <div class="os-transaction-list" [class]="transactionListClasses()">
      <!-- Header -->
      @if (title() || showHeaderActions()) {
      <div class="os-transaction-list__header">
        @if (title()) {
        <div class="os-transaction-list__title-section">
          <h2 class="os-transaction-list__title">{{ title() }}</h2>
          @if (subtitle()) {
          <p class="os-transaction-list__subtitle">{{ subtitle() }}</p>
          }
        </div>
        } @if (showHeaderActions()) {
        <div class="os-transaction-list__header-actions">
          @if (showRefreshButton()) {
          <os-button
            variant="tertiary"
            [size]="getButtonSize()"
            icon="refresh"
            [loading]="isLoading()"
            (buttonClick)="onRefresh()"
            [attr.aria-label]="'Atualizar transações'"
          >
            Atualizar
          </os-button>
          } @if (showExportButton()) {
          <os-button
            variant="secondary"
            [size]="getButtonSize()"
            icon="download"
            (buttonClick)="onExport()"
            [attr.aria-label]="'Exportar transações'"
          >
            Exportar
          </os-button>
          } @if (showAddButton()) {
          <os-button
            variant="primary"
            [size]="getButtonSize()"
            icon="add"
            (buttonClick)="onAdd()"
            [attr.aria-label]="'Adicionar nova transação'"
          >
            {{ addButtonText() }}
          </os-button>
          }
        </div>
        }
      </div>
      }

      <!-- Filters -->
      @if (showFilters() && filterOptions().length > 0) {
      <div class="os-transaction-list__filters">
        <os-filter-bar
          [variant]="getFilterBarVariant()"
          [size]="getFilterBarSize()"
          [hasActiveFilters]="hasActiveFilters()"
          (clear)="onClearFilters()"
          (apply)="onApplyFilters()"
        >
          <div class="os-transaction-list__filter-content">
            @for (option of filterOptions(); track option.key) {
            <div class="os-transaction-list__filter-item">
              <label class="os-transaction-list__filter-label" [for]="'filter-' + option.key">{{
                option.label
              }}</label>
              @switch (option.type) { @case ('text') {
              <input
                type="text"
                class="os-transaction-list__filter-input"
                [id]="'filter-' + option.key"
                [placeholder]="'Filtrar por ' + option.label"
                [value]="getFilterValue(option.key)"
                (input)="onFilterChange(option.key, $event)"
              />
              } @case ('select') {
              <select
                class="os-transaction-list__filter-select"
                [id]="'filter-' + option.key"
                [value]="getFilterValue(option.key)"
                (change)="onFilterChange(option.key, $event)"
              >
                <option value="">{{ 'Todos os ' + option.label }}</option>
                @for (opt of option.options; track opt.value) {
                <option [value]="opt.value">{{ opt.label }}</option>
                }
              </select>
              } @case ('date') {
              <input
                type="date"
                class="os-transaction-list__filter-input"
                [id]="'filter-' + option.key"
                [value]="getFilterValue(option.key)"
                (change)="onFilterChange(option.key, $event)"
              />
              } @case ('number') {
              <input
                type="number"
                class="os-transaction-list__filter-input"
                [id]="'filter-' + option.key"
                [placeholder]="'Filtrar por ' + option.label"
                [value]="getFilterValue(option.key)"
                (input)="onFilterChange(option.key, $event)"
              />
              } }
            </div>
            }
          </div>
        </os-filter-bar>
      </div>
      }

      <!-- Transaction List -->
      <div class="os-transaction-list__content">
        @if (isLoading()) {
        <div class="os-transaction-list__loading">
          <os-spinner [variant]="'default'" [size]="getSpinnerSize()" />
          <p class="os-transaction-list__loading-text">Carregando transações...</p>
        </div>
        } @else if (paginatedTransactions().length === 0) {
        <div class="os-transaction-list__empty">
          <os-icon name="receipt" [size]="'lg'" />
          <h3 class="os-transaction-list__empty-title">{{ noDataTitle() }}</h3>
          <p class="os-transaction-list__empty-text">{{ noDataText() }}</p>
          @if (showAddButton()) {
          <os-button variant="primary" [size]="getButtonSize()" icon="add" (buttonClick)="onAdd()">
            {{ addButtonText() }}
          </os-button>
          }
        </div>
        } @else {
        <div class="os-transaction-list__table">
          <os-data-table
            [data]="paginatedTransactions()"
            [columns]="tableColumns()"
            [actions]="tableActions()"
            [size]="getTableSize()"
            [variant]="getTableVariant()"
            [showPagination]="showPagination()"
            [showNoData]="false"
            [pageSize]="pagination().pageSize"
            [pageIndex]="pagination().page"
            [totalItems]="totalItems()"
            [pageSizeOptions]="pageSizeOptions()"
            [showFirstLastButtons]="showFirstLastButtons()"
            (rowClick)="onRowClick($event)"
            (actionClick)="onTableActionClick($event)"
            (sortChange)="onSortChange($event)"
            (pageChange)="onPageChange($event)"
          />
        </div>
        }
      </div>

      <!-- Footer -->
      @if (showFooter()) {
      <div class="os-transaction-list__footer">
        <div class="os-transaction-list__footer-info">
          @if (showItemCount()) {
          <span class="os-transaction-list__item-count">
            {{ getItemCountText() }}
          </span>
          } @if (showLastUpdated()) {
          <span class="os-transaction-list__last-updated">
            Última atualização: {{ lastUpdated() | date : 'dd/MM/yyyy HH:mm' }}
          </span>
          }
        </div>

        @if (showFooterActions()) {
        <div class="os-transaction-list__footer-actions">
          <ng-content select="[slot=footer-actions]"></ng-content>
        </div>
        }
      </div>
      }
    </div>
  `,
  styleUrl: './os-transaction-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-transaction-list-host',
  },
})
export class OsTransactionListComponent {
  constructor() {
    // Update pagination total when filtered transactions change
    effect(() => {
      const filteredLength = this.filteredTransactions().length;
      this.pagination.update((p) => ({ ...p, total: filteredLength }));
    });
  }

  // Inputs
  transactions = input<Transaction[]>([]);
  title = input<string>('');
  subtitle = input<string>('');
  size = input<TransactionListSize>('medium');
  variant = input<TransactionListVariant>('default');
  theme = input<TransactionListTheme>('light');

  // Display options
  showHeaderActions = input<boolean>(true);
  showRefreshButton = input<boolean>(true);
  showExportButton = input<boolean>(true);
  showAddButton = input<boolean>(true);
  addButtonText = input<string>('Nova Transação');
  showFilters = input<boolean>(true);
  showPagination = input<boolean>(true);
  showFooter = input<boolean>(true);
  showItemCount = input<boolean>(true);
  showLastUpdated = input<boolean>(true);
  showFooterActions = input<boolean>(false);

  // Filter options
  filterOptions = input<OsFilterOption[]>([]);

  // Pagination
  pageSizeOptions = input<number[]>([5, 10, 25, 50]);
  showFirstLastButtons = input<boolean>(true);

  // Loading state
  isLoading = input<boolean>(false);
  lastUpdated = input<Date>(new Date());

  // No data state
  noDataTitle = input<string>('Nenhuma transação encontrada');
  noDataText = input<string>('Não há transações para exibir no momento.');

  // Outputs
  rowClick = output<Transaction>();
  tableActionClick = output<OsDataTableAction>();
  refresh = output<void>();
  export = output<void>();
  add = output<void>();
  filterChange = output<TransactionListFilter[]>();
  sortChange = output<TransactionListSort>();
  pageChange = output<TransactionListPagination>();

  // Internal state
  private filters = signal<TransactionListFilter[]>([]);
  private sort = signal<TransactionListSort | null>(null);
  protected pagination = signal<TransactionListPagination>({
    page: 0,
    pageSize: 10,
    total: 0,
  });

  // Computed properties
  transactionListClasses = computed(() => {
    const base = 'os-transaction-list';
    const variant = `os-transaction-list--${this.variant()}`;
    const size = `os-transaction-list--${this.size()}`;
    const theme = `os-transaction-list--${this.theme()}`;

    return `${base} ${variant} ${size} ${theme}`.trim();
  });

  filteredTransactions = computed(() => {
    let filtered = [...this.transactions()];

    // Apply filters
    const activeFilters = this.filters();
    if (activeFilters.length > 0) {
      filtered = filtered.filter((transaction) => {
        return activeFilters.every((filter) => {
          const value = this.getTransactionValue(transaction, filter.key);
          return this.matchesFilter(value, filter.value, filter.operator);
        });
      });
    }

    // Apply sorting
    const sortConfig = this.sort();
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = this.getTransactionValue(a, sortConfig.column);
        const bValue = this.getTransactionValue(b, sortConfig.column);

        if (sortConfig.direction === 'asc') {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
    }

    return filtered;
  });

  paginatedTransactions = computed(() => {
    const filtered = this.filteredTransactions();
    const pagination = this.pagination();
    const start = pagination.page * pagination.pageSize;
    const end = start + pagination.pageSize;

    return filtered.slice(start, end);
  });

  totalItems = computed(() => this.filteredTransactions().length);

  hasActiveFilters = computed(() => this.filters().length > 0);

  tableColumns = computed(() => {
    const baseColumns: OsDataTableColumn[] = [
      {
        key: 'description',
        label: 'Descrição',
        sortable: true,
        width: '30%',
      },
      {
        key: 'amount',
        label: 'Valor',
        sortable: true,
        width: '15%',
      },
      {
        key: 'date',
        label: 'Data',
        sortable: true,
        width: '15%',
      },
      {
        key: 'category',
        label: 'Categoria',
        sortable: true,
        width: '15%',
      },
      {
        key: 'type',
        label: 'Tipo',
        sortable: true,
        width: '10%',
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        width: '15%',
      },
    ];

    if (this.variant() === 'detailed') {
      return [
        ...baseColumns,
        {
          key: 'account',
          label: 'Conta',
          sortable: true,
          width: '10%',
        },
      ];
    }

    return baseColumns;
  });

  tableActions = computed(() => {
    const actions: OsDataTableAction[] = [
      {
        key: 'edit',
        label: 'Editar',
        icon: 'edit',
        color: 'secondary',
      },
      {
        key: 'delete',
        label: 'Excluir',
        icon: 'trash',
        color: 'warn',
      },
    ];

    return actions;
  });

  // Helper methods
  getTransactionValue(transaction: Transaction, key: string): string | number | Date {
    switch (key) {
      case 'description':
        return transaction.description;
      case 'amount':
        return transaction.amount;
      case 'date':
        return transaction.date;
      case 'category':
        return transaction.category;
      case 'type':
        return transaction.type;
      case 'status':
        return transaction.status;
      case 'account':
        return transaction.account || '';
      default:
        return '';
    }
  }

  matchesFilter(value: string | number | Date, filterValue: string, operator: string): boolean {
    if (!filterValue) return true;

    switch (operator) {
      case 'equals':
        return value === filterValue;
      case 'contains':
        return String(value).toLowerCase().includes(filterValue.toLowerCase());
      case 'greater':
        return Number(value) > Number(filterValue);
      case 'less':
        return Number(value) < Number(filterValue);
      case 'between': {
        const [min, max] = filterValue.split('-').map(Number);
        return Number(value) >= min && Number(value) <= max;
      }
      default:
        return true;
    }
  }

  getFilterValue(key: string): string {
    const filter = this.filters().find((f) => f.key === key);
    return filter ? filter.value : '';
  }

  getItemCountText(): string {
    const total = this.totalItems();
    const pageSize = this.pagination().pageSize;
    const page = this.pagination().page;
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, total);

    return `${start}-${end} de ${total} transações`;
  }

  // Size mappings
  getButtonSize() {
    const sizeMap: Record<TransactionListSize, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  }

  getFilterBarVariant(): OsFilterBarVariant {
    const variantMap: Record<TransactionListVariant, OsFilterBarVariant> = {
      default: 'default',
      compact: 'compact',
      detailed: 'expanded',
    };
    return variantMap[this.variant()];
  }

  getFilterBarSize() {
    const sizeMap: Record<TransactionListSize, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  }

  getTableSize() {
    const sizeMap: Record<TransactionListSize, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  }

  getTableVariant() {
    const variantMap: Record<TransactionListVariant, 'default' | 'striped' | 'bordered'> = {
      default: 'default',
      compact: 'striped',
      detailed: 'bordered',
    };
    return variantMap[this.variant()];
  }

  getSpinnerSize() {
    const sizeMap: Record<TransactionListSize, 'xs' | 'sm' | 'md' | 'lg' | 'xl'> = {
      small: 'sm',
      medium: 'md',
      large: 'lg',
    };
    return sizeMap[this.size()];
  }

  // Event handlers
  onRefresh(): void {
    this.refresh.emit();
  }

  onExport(): void {
    this.export.emit();
  }

  onAdd(): void {
    this.add.emit();
  }

  onFilterChange(key: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const value = target.value;

    this.filters.update((filters) => {
      const existing = filters.find((f) => f.key === key);
      if (existing) {
        if (value) {
          return filters.map((f) => (f.key === key ? { ...f, value } : f));
        } else {
          return filters.filter((f) => f.key !== key);
        }
      } else if (value) {
        return [...filters, { key, value, operator: 'contains' as const }];
      }
      return filters;
    });

    this.filterChange.emit(this.filters());
  }

  onClearFilters(): void {
    this.filters.set([]);
    this.filterChange.emit([]);
  }

  onApplyFilters(): void {
    this.filterChange.emit(this.filters());
  }

  onRowClick(row: OsDataTableRow): void {
    this.rowClick.emit(row as Transaction);
  }

  onTableActionClick(action: OsDataTableAction): void {
    this.tableActionClick.emit(action);
  }

  onSortChange(sort: Sort): void {
    this.sort.set({ column: sort.active, direction: sort.direction as 'asc' | 'desc' });
    this.sortChange.emit({ column: sort.active, direction: sort.direction as 'asc' | 'desc' });
  }

  onPageChange(page: PageEvent): void {
    this.pagination.update((p) => ({ ...p, page: page.pageIndex, pageSize: page.pageSize }));
    this.pageChange.emit({
      page: page.pageIndex,
      pageSize: page.pageSize,
      total: this.totalItems(),
    });
  }
}
