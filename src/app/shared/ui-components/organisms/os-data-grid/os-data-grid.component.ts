import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  inject,
  effect,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import {
  OsDataTableAction,
  OsDataTableColumn,
  OsDataTableComponent,
} from '../../molecules/os-data-table/os-data-table.component';
import {
  OsFilterBarComponent,
  OsFilterOption,
} from '../../molecules/os-filter-bar/os-filter-bar.component';

export type OsDataGridSize = 'small' | 'medium' | 'large';
export type OsDataGridVariant = 'default' | 'compact' | 'detailed';

export interface OsDataGridFilter {
  key: string;
  value: string | number | Date | boolean;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte';
}

export interface OsDataGridSort {
  column: string;
  direction: 'asc' | 'desc';
}

export interface OsDataGridPagination {
  page: number;
  pageSize: number;
  total: number;
}

@Component({
  selector: 'os-data-grid',
  standalone: true,
  imports: [
    CommonModule,
    ScrollingModule,
    OsDataTableComponent,
    OsFilterBarComponent,
    OsButtonComponent,
  ],
  template: `
    <div class="os-data-grid" [class]="dataGridClasses()">
      <!-- Header -->
      @if (title() || showHeaderActions()) {
      <div class="os-data-grid__header">
        @if (title()) {
        <div class="os-data-grid__title-section">
          <h2 class="os-data-grid__title">{{ title() }}</h2>
          @if (subtitle()) {
          <p class="os-data-grid__subtitle">{{ subtitle() }}</p>
          }
        </div>
        } @if (showHeaderActions()) {
        <div class="os-data-grid__header-actions">
          @if (showRefreshButton()) {
          <os-button
            variant="tertiary"
            [size]="getButtonSize()"
            icon="refresh"
            [loading]="isLoading()"
            (buttonClick)="onRefresh()"
            [attr.aria-label]="'Atualizar dados'"
          >
            Atualizar
          </os-button>
          } @if (showExportButton()) {
          <os-button
            variant="secondary"
            [size]="getButtonSize()"
            icon="download"
            (buttonClick)="onExport()"
            [attr.aria-label]="'Exportar dados'"
          >
            Exportar
          </os-button>
          } @if (showAddButton()) {
          <os-button
            variant="primary"
            [size]="getButtonSize()"
            icon="add"
            (buttonClick)="onAdd()"
            [attr.aria-label]="'Adicionar novo item'"
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
      <div class="os-data-grid__filters">
        <os-filter-bar
          [variant]="getFilterBarVariant()"
          [size]="getFilterBarSize()"
          [hasActiveFilters]="hasActiveFilters()"
          (clear)="onClearFilters()"
          (apply)="onApplyFilters()"
        >
          <div class="os-data-grid__filter-content">
            @for (option of filterOptions(); track option.key) {
            <div class="os-data-grid__filter-item">
              <label [for]="'filter-' + option.key" class="os-data-grid__filter-label">{{
                option.label
              }}</label>
              @switch (option.type) { @case ('text') {
              <input
                [id]="'filter-' + option.key"
                type="text"
                class="os-data-grid__filter-input"
                [placeholder]="'Filtrar por ' + option.label"
                [value]="getFilterValue(option.key)"
                (input)="onFilterChange(option.key, $event)"
              />
              } @case ('select') {
              <select
                class="os-data-grid__filter-select"
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
                class="os-data-grid__filter-input"
                [value]="getFilterValue(option.key)"
                (change)="onFilterChange(option.key, $event)"
              />
              } @case ('number') {
              <input
                type="number"
                class="os-data-grid__filter-input"
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

      <!-- Data Table -->
      <div class="os-data-grid__table" [attr.aria-label]="'Tabela de dados'">
        @if (shouldUseVirtualScrolling()) {
        <cdk-virtual-scroll-viewport
          class="os-data-grid__virtual-scroll"
          [itemSize]="getVirtualScrollItemSize()"
          [minBufferPx]="getVirtualScrollMinBuffer()"
          [maxBufferPx]="getVirtualScrollMaxBuffer()"
        >
          <os-data-table
            [data]="filteredData()"
            [columns]="columns()"
            [actions]="tableActions()"
            [size]="getTableSize()"
            [variant]="getTableVariant()"
            [showPagination]="false"
            [showNoData]="showNoData()"
            [noDataText]="noDataText()"
            [pageSize]="filteredData().length"
            [pageIndex]="0"
            [totalItems]="totalItems()"
            [pageSizeOptions]="[]"
            [showFirstLastButtons]="false"
            (rowClick)="onRowClick($event)"
            (actionClick)="onTableActionClick($event)"
            (sortChange)="onSortChange($event)"
            (pageChange)="onPageChange($event)"
          />
        </cdk-virtual-scroll-viewport>
        } @else {
        <os-data-table
          [data]="filteredData()"
          [columns]="columns()"
          [actions]="tableActions()"
          [size]="getTableSize()"
          [variant]="getTableVariant()"
          [showPagination]="showPagination()"
          [showNoData]="showNoData()"
          [noDataText]="noDataText()"
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
        }
      </div>

      <!-- Footer -->
      @if (showFooter()) {
      <div class="os-data-grid__footer">
        <div class="os-data-grid__footer-info">
          @if (showItemCount()) {
          <span class="os-data-grid__item-count">
            {{ getItemCountText() }}
          </span>
          } @if (showLastUpdated()) {
          <span class="os-data-grid__last-updated">
            Última atualização: {{ lastUpdated() | date : 'dd/MM/yyyy HH:mm' }}
          </span>
          }
        </div>

        @if (showFooterActions()) {
        <div class="os-data-grid__footer-actions">
          <ng-content select="[slot=footer-actions]"></ng-content>
        </div>
        }
      </div>
      }
    </div>
  `,
  styleUrl: './os-data-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-data-grid-host',
  },
})
export class OsDataGridComponent {
  
  private readonly breakpointObserver = inject(BreakpointObserver);
  
  data = input<Record<string, unknown>[]>([]);
  columns = input<OsDataTableColumn[]>([]);
  filterOptions = input<OsFilterOption[]>([]);
  tableActions = input<OsDataTableAction[]>([]);
  title = input<string>('');
  subtitle = input<string>('');
  size = input<OsDataGridSize>('medium');
  variant = input<OsDataGridVariant>('default');
  
  useVirtualScrolling = input<boolean>(false);
  virtualScrollThreshold = input<number>(100);
  virtualScrollItemSize = input<number>(48);
  virtualScrollMinBuffer = input<number>(200);
  virtualScrollMaxBuffer = input<number>(400);
  
  showHeaderActions = input<boolean>(true);
  showRefreshButton = input<boolean>(true);
  showExportButton = input<boolean>(true);
  showAddButton = input<boolean>(true);
  addButtonText = input<string>('Adicionar');
  showFilters = input<boolean>(true);
  showPagination = input<boolean>(true);
  showNoData = input<boolean>(true);
  noDataText = input<string>('Nenhum dado encontrado');
  showFooter = input<boolean>(true);
  showItemCount = input<boolean>(true);
  showLastUpdated = input<boolean>(true);
  showFooterActions = input<boolean>(false);
  
  pageSizeOptions = input<number[]>([5, 10, 25, 50]);
  showFirstLastButtons = input<boolean>(true);
  
  isLoading = input<boolean>(false);
  lastUpdated = input<Date>(new Date());
  
  rowClick = output<Record<string, unknown>>();
  tableActionClick = output<OsDataTableAction>();
  refresh = output<void>();
  export = output<void>();
  add = output<void>();
  filterChange = output<OsDataGridFilter[]>();
  sortChange = output<OsDataGridSort>();
  pageChange = output<OsDataGridPagination>();
  
  private filters = signal<OsDataGridFilter[]>([]);
  private sort = signal<OsDataGridSort | null>(null);
  protected pagination = signal<OsDataGridPagination>({
    page: 0,
    pageSize: 10,
    total: 0,
  });
  
  private isMobile = signal<boolean>(false);

  constructor() {
    
    effect(() => {
      this.breakpointObserver
        .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
        .subscribe((result) => {
          this.isMobile.set(result.matches);
        });
    });
  }
  
  filteredData = computed(() => {
    let result = [...this.data()];
    
    const activeFilters = this.filters().filter(
      (f) => f.value !== null && f.value !== undefined && f.value !== ''
    );
    if (activeFilters.length > 0) {
      result = result.filter((item) => {
        return activeFilters.every((filter) => {
          const itemValue = this.getNestedValue(item, filter.key);
          return this.matchesFilter(itemValue, filter.value, filter.operator || 'contains');
        });
      });
    }
    
    if (this.sort()) {
      result = this.applySorting(result, this.sort()!);
    }
    
    const startIndex = this.pagination().page * this.pagination().pageSize;
    const endIndex = startIndex + this.pagination().pageSize;

    return result.slice(startIndex, endIndex);
  });
  
  totalItems = computed(() => {
    let result = [...this.data()];
    
    const activeFilters = this.filters().filter(
      (f) => f.value !== null && f.value !== undefined && f.value !== ''
    );
    if (activeFilters.length > 0) {
      result = result.filter((item) => {
        return activeFilters.every((filter) => {
          const itemValue = this.getNestedValue(item, filter.key);
          return this.matchesFilter(itemValue, filter.value, filter.operator || 'contains');
        });
      });
    }

    return result.length;
  });

  hasActiveFilters = computed(() => {
    return this.filters().some((f) => f.value !== null && f.value !== undefined && f.value !== '');
  });
  
  isMobileDevice = computed(() => this.isMobile());
  
  shouldUseVirtualScrolling = computed(() => {
    return this.useVirtualScrolling() && this.filteredData().length > this.virtualScrollThreshold();
  });
  
  dataGridClasses = () => {
    const classes = ['os-data-grid'];

    if (this.size() !== 'medium') {
      classes.push(`os-data-grid--${this.size()}`);
    }

    if (this.variant() !== 'default') {
      classes.push(`os-data-grid--${this.variant()}`);
    }

    if (this.isLoading()) {
      classes.push('os-data-grid--loading');
    }

    if (this.isMobileDevice()) {
      classes.push('os-data-grid--mobile');
    }

    if (this.shouldUseVirtualScrolling()) {
      classes.push('os-data-grid--virtual-scroll');
    }

    return classes.join(' ');
  };

  getButtonSize = () => {
    const sizeMap: Record<OsDataGridSize, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  };

  getFilterBarVariant = () => {
    const variantMap: Record<OsDataGridVariant, 'default' | 'compact' | 'expanded'> = {
      default: 'default',
      compact: 'compact',
      detailed: 'expanded',
    };
    return variantMap[this.variant()];
  };

  getFilterBarSize = () => {
    const sizeMap: Record<OsDataGridSize, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  };

  getTableSize = () => {
    const sizeMap: Record<OsDataGridSize, 'small' | 'medium' | 'large'> = {
      small: 'small',
      medium: 'medium',
      large: 'large',
    };
    return sizeMap[this.size()];
  };

  getTableVariant = () => {
    const variantMap: Record<OsDataGridVariant, 'default' | 'striped' | 'bordered'> = {
      default: 'default',
      compact: 'striped',
      detailed: 'bordered',
    };
    return variantMap[this.variant()];
  };

  getFilterValue = (key: string) => {
    const filter = this.filters().find((f) => f.key === key);
    return filter?.value || '';
  };

  getItemCountText = () => {
    const total = this.totalItems();
    const start = this.pagination().page * this.pagination().pageSize + 1;
    const end = Math.min(start + this.pagination().pageSize - 1, total);

    if (total === 0) {
      return 'Nenhum item encontrado';
    }

    return `Mostrando ${start}-${end} de ${total} itens`;
  };
  
  getVirtualScrollItemSize = () => this.virtualScrollItemSize();
  getVirtualScrollMinBuffer = () => this.virtualScrollMinBuffer();
  getVirtualScrollMaxBuffer = () => this.virtualScrollMaxBuffer();
  
  onRefresh(): void {
    this.refresh.emit();
  }

  onExport(): void {
    this.export.emit();
  }

  onAdd(): void {
    this.add.emit();
  }

  onRowClick(row: Record<string, unknown>): void {
    this.rowClick.emit(row);
  }

  onTableActionClick(action: OsDataTableAction): void {
    this.tableActionClick.emit(action);
  }

  onFilterChange(key: string, event: Event | { target?: { value: unknown } } | unknown): void {
    const value = (event as { target?: { value: unknown } })?.target?.value || event;
    this.updateFilter(key, value as string | number | Date | boolean | null | undefined);
  }

  onClearFilters(): void {
    this.filters.set([]);
    this.filterChange.emit([]);
  }

  onApplyFilters(): void {
    this.filterChange.emit([...this.filters()]);
  }

  onSortChange(sort: { active: string; direction: 'asc' | 'desc' | '' }): void {
    if (sort.direction === '') return;

    this.sort.set({
      column: sort.active,
      direction: sort.direction as 'asc' | 'desc',
    });
    this.sortChange.emit(this.sort()!);
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pagination.update((p) => ({
      ...p,
      page: event.pageIndex,
      pageSize: event.pageSize,
    }));
    this.pageChange.emit(this.pagination());
  }
  
  private updateFilter(
    key: string,
    value: string | number | Date | boolean | null | undefined
  ): void {
    const currentFilters = [...this.filters()];
    const existingIndex = currentFilters.findIndex((f) => f.key === key);

    if (value === null || value === undefined || value === '') {
      if (existingIndex >= 0) {
        currentFilters.splice(existingIndex, 1);
      }
    } else {
      const filter: OsDataGridFilter = { key, value };
      if (existingIndex >= 0) {
        currentFilters[existingIndex] = filter;
      } else {
        currentFilters.push(filter);
      }
    }

    this.filters.set(currentFilters);
  }

  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    return path
      .split('.')
      .reduce((current: unknown, key: string) => (current as Record<string, unknown>)?.[key], obj);
  }

  private matchesFilter(itemValue: unknown, filterValue: unknown, operator: string): boolean {
    if (itemValue === null || itemValue === undefined) {
      return false;
    }

    const itemStr = String(itemValue).toLowerCase();
    const filterStr = String(filterValue).toLowerCase();

    switch (operator) {
      case 'equals':
        return itemStr === filterStr;
      case 'contains':
        return itemStr.includes(filterStr);
      case 'startsWith':
        return itemStr.startsWith(filterStr);
      case 'endsWith':
        return itemStr.endsWith(filterStr);
      case 'gt':
        return Number(itemValue) > Number(filterValue);
      case 'lt':
        return Number(itemValue) < Number(filterValue);
      case 'gte':
        return Number(itemValue) >= Number(filterValue);
      case 'lte':
        return Number(itemValue) <= Number(filterValue);
      default:
        return itemStr.includes(filterStr);
    }
  }

  private applySorting(
    data: Record<string, unknown>[],
    sort: OsDataGridSort
  ): Record<string, unknown>[] {
    return [...data].sort((a, b) => {
      const aValue = this.getNestedValue(a, sort.column);
      const bValue = this.getNestedValue(b, sort.column);

      if (aValue === bValue) return 0;

      const aStr = String(aValue || '');
      const bStr = String(bValue || '');
      const comparison = aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }
}
