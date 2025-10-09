import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { OsPageHeaderComponent } from '../../organisms/os-page-header/os-page-header.component';
import { OsDataGridComponent } from '../../organisms/os-data-grid/os-data-grid.component';
import { OsFilterBarComponent } from '../../molecules/os-filter-bar/os-filter-bar.component';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsSpinnerComponent } from '../../atoms/os-spinner/os-spinner.component';

export interface ListTemplateData {
  id: string;
  title: string;
  subtitle?: string;
  status?: string;
  date?: Date;
  amount?: number;
  category?: string;
  tags?: string[];
}

export interface ListTemplateFilter {
  field: string;
  operator:
    | 'equals'
    | 'contains'
    | 'startsWith'
    | 'endsWith'
    | 'greaterThan'
    | 'lessThan'
    | 'between';
  value: string | number | Date | { from: Date; to: Date };
}

export interface ListTemplateAction {
  id: string;
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  disabled?: boolean;
}

@Component({
  selector: 'os-list-template',
  template: `
    <div [class]="templateClass()">
      <!-- Header Section -->
      <os-page-header
        [variant]="headerVariant()"
        [size]="headerSize()"
        [title]="title()"
        [subtitle]="subtitle()"
        [breadcrumbs]="breadcrumbs()"
        [actions]="headerActions()"
        (actionClick)="onHeaderActionClick($event)"
      />

      <!-- Filters Section -->
      @if (showFilters()) {
      <div class="os-list-template__filters">
        <os-filter-bar
          [variant]="filterVariant()"
          [size]="filterSize()"
          (clear)="onClearFilters()"
          (apply)="onApplyFilters()"
        />
      </div>
      }

      <!-- Content Section -->
      <div class="os-list-template__content">
        @if (loading()) {
        <div class="os-list-template__loading">
          <os-spinner [variant]="spinnerVariant()" [size]="spinnerSize()" />
          <span class="os-list-template__loading-text">{{ loadingText() }}</span>
        </div>
        } @else if (isEmpty()) {
        <div class="os-list-template__empty">
          <os-icon [name]="emptyIcon()" [variant]="emptyIconVariant()" [size]="emptyIconSize()" />
          <h3 class="os-list-template__empty-title">{{ emptyTitle() }}</h3>
          <p class="os-list-template__empty-description">{{ emptyDescription() }}</p>
          @if (emptyAction()) {
          <os-button
            [variant]="emptyActionVariant()"
            [size]="emptyActionSize()"
            [icon]="emptyActionIcon()"
            (click)="onEmptyActionClick($event)"
          >
            {{ emptyAction()!.label }}
          </os-button>
          }
        </div>
        } @else {
        <os-data-grid
          [variant]="gridVariant()"
          [size]="gridSize()"
          [data]="data()"
          [columns]="columns()"
          [filterOptions]="filterOptions()"
          [tableActions]="gridActions()"
          [title]="title()"
          [subtitle]="subtitle()"
          [showHeaderActions]="showGridHeader()"
          [showFooter]="showGridFooter()"
          [isLoading]="loading()"
          (rowClick)="onRowClick($event)"
          (tableActionClick)="onGridActionClick($event)"
          (filterChange)="onFilterChange($event)"
          (sortChange)="onSortChange($event)"
          (pageChange)="onPageChange($event)"
          (refresh)="onRefresh()"
          (export)="onExport()"
          (add)="onAdd()"
        />
        }
      </div>

      <!-- Footer Section -->
      @if (showFooter()) {
      <div class="os-list-template__footer">
        <div class="os-list-template__footer-info">
          <span class="os-list-template__footer-text">{{ footerText() }}</span>
          @if (showLastUpdate()) {
          <span class="os-list-template__footer-update">
            Última atualização: {{ lastUpdate() | date : 'dd/MM/yyyy HH:mm' }}
          </span>
          }
        </div>
        <div class="os-list-template__footer-actions">
          @for (action of footerActions(); track action.id) {
          <os-button
            [variant]="action.variant || 'tertiary'"
            [size]="footerActionSize()"
            [icon]="action.icon || ''"
            [disabled]="action.disabled || disabled()"
            (click)="onFooterActionClick(action, $event)"
          >
            {{ action.label }}
          </os-button>
          }
        </div>
      </div>
      }
    </div>
  `,
  styleUrls: ['./os-list-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    OsPageHeaderComponent,
    OsDataGridComponent,
    OsFilterBarComponent,
    OsButtonComponent,
    OsIconComponent,
    OsSpinnerComponent,
  ],
})
export class OsListTemplateComponent {
  // Inputs
  variant = input<'default' | 'compact' | 'detailed'>('default');
  size = input<'small' | 'medium' | 'large'>('medium');
  theme = input<'light' | 'dark'>('light');

  // Header
  title = input<string>('');
  subtitle = input<string>('');
  breadcrumbs = input<Array<{ label: string; url?: string }>>([]);
  showBackButton = input<boolean>(false);
  backUrl = input<string>('');

  // Data
  data = input<ListTemplateData[]>([]);
  columns = input<Array<{ key: string; label: string; sortable?: boolean }>>([]);
  filters = input<ListTemplateFilter[]>([]);
  sort = input<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  page = input<number>(1);
  pageSize = input<number>(10);
  totalItems = input<number>(0);

  // States
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  loadingText = input<string>('Carregando...');

  // Empty State
  emptyTitle = input<string>('Nenhum item encontrado');
  emptyDescription = input<string>('Não há dados para exibir no momento.');
  emptyIcon = input<string>('list');
  emptyAction = input<{
    id: string;
    label: string;
    icon?: string;
    variant?: string;
    size?: string;
  } | null>(null);

  // Visibility
  showFilters = input<boolean>(true);
  showFooter = input<boolean>(true);
  showGridHeader = input<boolean>(true);
  showGridFooter = input<boolean>(true);
  showLastUpdate = input<boolean>(true);

  // Actions
  headerActions = input<
    Array<{
      label: string;
      icon?: string;
      variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
      size?: 'small' | 'medium' | 'large';
      disabled?: boolean;
      loading?: boolean;
    }>
  >([]);
  gridActions = input<
    Array<{ key: string; label: string; icon?: string; color?: 'primary' | 'secondary' | 'warn' }>
  >([]);
  footerActions = input<ListTemplateAction[]>([]);

  // Footer
  footerText = input<string>('');
  lastUpdate = input<Date>(new Date());

  // Outputs
  rowClick = output<{ item: ListTemplateData; index: number; event: MouseEvent }>();
  headerActionClick = output<{
    label: string;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
  }>();
  gridActionClick = output<{
    key: string;
    label: string;
    icon?: string;
    color?: 'primary' | 'secondary' | 'warn';
  }>();
  footerActionClick = output<{ action: ListTemplateAction; event: MouseEvent }>();
  filterChange = output<ListTemplateFilter[]>();
  sortChange = output<{ field: string; direction: 'asc' | 'desc' }>();
  pageChange = output<{ page: number; pageSize: number }>();
  refresh = output<void>();
  export = output<void>();
  add = output<void>();
  backClick = output<MouseEvent>();
  emptyActionClick = output<MouseEvent>();

  // Computed Properties
  templateClass = computed(() => {
    return [
      'os-list-template',
      `os-list-template--${this.variant()}`,
      `os-list-template--${this.size()}`,
      `os-list-template--${this.theme()}`,
      this.loading() ? 'os-list-template--loading' : '',
      this.disabled() ? 'os-list-template--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  headerVariant = computed(() => {
    const sizeMap = { small: 'compact', medium: 'default', large: 'extended' };
    return sizeMap[this.size()] as 'compact' | 'default' | 'extended';
  });

  headerSize = computed(() => {
    const sizeMap = { small: 'small', medium: 'medium', large: 'large' };
    return sizeMap[this.size()] as 'small' | 'medium' | 'large';
  });

  filterVariant = computed(() => {
    const sizeMap = { small: 'compact', medium: 'default', large: 'expanded' };
    return sizeMap[this.size()] as 'compact' | 'default' | 'expanded';
  });

  filterSize = computed(() => {
    const sizeMap = { small: 'small', medium: 'medium', large: 'large' };
    return sizeMap[this.size()] as 'small' | 'medium' | 'large';
  });

  gridVariant = computed(() => {
    const sizeMap = { small: 'compact', medium: 'default', large: 'detailed' };
    return sizeMap[this.size()] as 'compact' | 'default' | 'detailed';
  });

  gridSize = computed(() => {
    const sizeMap = { small: 'small', medium: 'medium', large: 'large' };
    return sizeMap[this.size()] as 'small' | 'medium' | 'large';
  });

  spinnerVariant = computed(() => {
    return this.theme() === 'dark' ? 'secondary' : 'default';
  });

  spinnerSize = computed(() => {
    const sizeMap = { small: 'sm', medium: 'md', large: 'lg' };
    return sizeMap[this.size()] as 'sm' | 'md' | 'lg';
  });

  emptyIconVariant = computed(() => {
    return this.theme() === 'dark' ? 'secondary' : 'default';
  });

  emptyIconSize = computed(() => {
    const sizeMap = { small: 'md', medium: 'lg', large: 'xl' };
    return sizeMap[this.size()] as 'md' | 'lg' | 'xl';
  });

  footerActionSize = computed(() => {
    const sizeMap = { small: 'small', medium: 'medium', large: 'large' };
    return sizeMap[this.size()] as 'small' | 'medium' | 'large';
  });

  isEmpty = computed(() => {
    return !this.loading() && this.data().length === 0;
  });

  emptyActionVariant = computed(() => {
    const action = this.emptyAction();
    if (!action) return 'primary';
    return (action.variant as 'primary' | 'secondary' | 'tertiary' | 'danger') || 'primary';
  });

  emptyActionSize = computed(() => {
    const action = this.emptyAction();
    if (!action) return 'medium';
    return (action.size as 'small' | 'medium' | 'large') || 'medium';
  });

  emptyActionIcon = computed(() => {
    const action = this.emptyAction();
    return action?.icon || '';
  });

  // Convert ListTemplateFilter[] to OsFilterOption[]
  filterOptions = computed(() => {
    return this.filters().map((filter) => ({
      key: filter.field,
      label: filter.field,
      value: filter.value,
      type: this.getFilterType(filter.value),
    }));
  });

  private getFilterType(value: any): 'text' | 'select' | 'date' | 'number' {
    if (typeof value === 'number') return 'number';
    if (value instanceof Date) return 'date';
    if (typeof value === 'object' && value.from && value.to) return 'date';
    return 'text';
  }

  // Event Handlers
  onRowClick(event: { item: ListTemplateData; index: number; event: MouseEvent }) {
    this.rowClick.emit(event);
  }

  onHeaderActionClick(action: {
    label: string;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
  }) {
    this.headerActionClick.emit(action);
  }

  onGridActionClick(action: {
    key: string;
    label: string;
    icon?: string;
    color?: 'primary' | 'secondary' | 'warn';
  }) {
    this.gridActionClick.emit(action);
  }

  onFooterActionClick(action: ListTemplateAction, event: MouseEvent) {
    this.footerActionClick.emit({ action, event });
  }

  onFilterChange(filters: any[]) {
    // Convert OsDataGridFilter[] to ListTemplateFilter[]
    const convertedFilters: ListTemplateFilter[] = filters.map((filter) => ({
      field: filter.field || '',
      operator: filter.operator || 'equals',
      value: filter.value || '',
    }));
    this.filterChange.emit(convertedFilters);
  }

  onSortChange(sort: any) {
    // Convert OsDataGridSort to our format
    const convertedSort = {
      field: sort.field || '',
      direction: sort.direction || 'asc',
    } as { field: string; direction: 'asc' | 'desc' };
    this.sortChange.emit(convertedSort);
  }

  onPageChange(page: { page: number; pageSize: number }) {
    this.pageChange.emit(page);
  }

  onRefresh() {
    this.refresh.emit();
  }

  onExport() {
    this.export.emit();
  }

  onAdd() {
    this.add.emit();
  }

  onBackClick(event: MouseEvent) {
    this.backClick.emit(event);
  }

  onEmptyActionClick(event: MouseEvent) {
    this.emptyActionClick.emit(event);
  }

  onClearFilters() {
    this.filterChange.emit([]);
  }

  onApplyFilters() {
    // Filter application logic can be implemented here
    // For now, just emit the current filters
    this.filterChange.emit(this.filters());
  }
}
