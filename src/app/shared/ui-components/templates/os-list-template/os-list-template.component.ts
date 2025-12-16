import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  inject,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  viewChild
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { OsSpinnerComponent } from '../../atoms/os-spinner/os-spinner.component';
import { OsFilterBarComponent } from '../../molecules/os-filter-bar/os-filter-bar.component';
import { OsDataGridComponent } from '../../organisms/os-data-grid/os-data-grid.component';
import { OsPageHeaderComponent } from '../../organisms/os-page-header/os-page-header.component';

export interface ListTemplateData {
  id: string;
  title: string;
  subtitle?: string;
  status?: string;
  date?: Date;
  amount?: number;
  category?: string;
  tags?: string[];
  [key: string]: unknown;
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

export interface ListTemplateInfiniteScroll {
  enabled: boolean;
  threshold: number;
  loadMoreText: string;
  loadingText: string;
  noMoreText: string;
}

export interface ListTemplateMobileFilters {
  enabled: boolean;
  overlay: boolean;
  position: 'left' | 'right';
  width: string;
}

@Component({
  selector: 'os-list-template',
  template: `
    <div [class]="templateClass()" role="main" [attr.aria-label]="title()">
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

      <!-- Mobile Filter Toggle -->
      @if (showFilters() && isMobile() && mobileFilters().enabled) {
      <div class="os-list-template__mobile-filter-toggle">
        <os-button
          variant="secondary"
          size="medium"
          [icon]="mobileFiltersOpen() ? 'close' : 'filter_list'"
          (click)="toggleMobileFilters()"
          [attr.aria-expanded]="mobileFiltersOpen()"
          aria-controls="mobile-filters"
        >
          {{ mobileFiltersOpen() ? 'Fechar Filtros' : 'Filtros' }}
        </os-button>
      </div>
      }

      <!-- Filters Section -->
      @if (showFilters()) {
      <div
        class="os-list-template__filters"
        [class.os-list-template__filters--mobile]="isMobile() && mobileFilters().enabled"
        [class.os-list-template__filters--mobile-open]="isMobile() && mobileFiltersOpen()"
        [id]="isMobile() ? 'mobile-filters' : null"
        [attr.aria-hidden]="isMobile() && !mobileFiltersOpen()"
      >
        <os-filter-bar
          [variant]="filterVariant()"
          [size]="filterSize()"
          (clear)="onClearFilters()"
          (apply)="onApplyFilters()"
        />
      </div>
      }

      <!-- Content Section -->
      <div class="os-list-template__content" role="region" aria-label="Lista de dados">
        @if (loading() && !infiniteScrollLoading()) {
        <div class="os-list-template__loading">
          <os-spinner [variant]="spinnerVariant()" [size]="spinnerSize()" />
          <span class="os-list-template__loading-text">{{ loadingText() }}</span>
        </div>
        } @else if (isEmpty()) {
        <div class="os-list-template__empty" role="status" aria-live="polite">
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
        <div class="os-list-template__grid-container">
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

          <!-- Infinite Scroll Trigger -->
          @if (infiniteScroll().enabled && !isEmpty() && !loading()) {
          <div
            class="os-list-template__infinite-trigger"
            #infiniteTrigger
            [attr.aria-live]="infiniteScrollLoading() ? 'polite' : 'off'"
          >
            @if (infiniteScrollLoading()) {
            <div class="os-list-template__infinite-loading">
              <os-spinner size="sm" />
              <span>{{ infiniteScroll().loadingText }}</span>
            </div>
            } @else if (hasMoreItems()) {
            <os-button
              variant="secondary"
              size="medium"
              [icon]="'expand_more'"
              (click)="loadMoreItems()"
            >
              {{ infiniteScroll().loadMoreText }}
            </os-button>
            } @else {
            <div class="os-list-template__infinite-end">
              <os-icon name="check_circle" size="sm" />
              <span>{{ infiniteScroll().noMoreText }}</span>
            </div>
            }
          </div>
          }
        </div>
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
export class OsListTemplateComponent implements AfterViewInit, OnDestroy {
  
  private breakpointObserver = inject(BreakpointObserver);
  private elementRef = inject(ElementRef);
  
  readonly infiniteTrigger = viewChild<ElementRef>('infiniteTrigger');
  
  mobileFiltersOpen = signal(false);
  infiniteScrollLoading = signal(false);
  hasMoreItems = signal(true);
  private currentPage = signal(1);
  private intersectionObserver?: IntersectionObserver;
  
  variant = input<'default' | 'compact' | 'detailed'>('default');
  size = input<'small' | 'medium' | 'large'>('medium');
  theme = input<'light' | 'dark'>('light');
  
  title = input<string>('');
  subtitle = input<string>('');
  breadcrumbs = input<{ label: string; url?: string }[]>([]);
  showBackButton = input<boolean>(false);
  backUrl = input<string>('');
  
  data = input<ListTemplateData[]>([]);
  columns = input<{ key: string; label: string; sortable?: boolean }[]>([]);
  filters = input<ListTemplateFilter[]>([]);
  sort = input<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  page = input<number>(1);
  pageSize = input<number>(10);
  totalItems = input<number>(0);
  
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  loadingText = input<string>('Carregando...');
  
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
  
  showFilters = input<boolean>(true);
  showFooter = input<boolean>(true);
  showGridHeader = input<boolean>(true);
  showGridFooter = input<boolean>(true);
  showLastUpdate = input<boolean>(true);
  
  headerActions = input<
    {
      label: string;
      icon?: string;
      variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
      size?: 'small' | 'medium' | 'large';
      disabled?: boolean;
      loading?: boolean;
    }[]
  >([]);
  gridActions = input<
    { key: string; label: string; icon?: string; color?: 'primary' | 'secondary' | 'warn' }[]
  >([]);
  footerActions = input<ListTemplateAction[]>([]);
  
  footerText = input<string>('');
  lastUpdate = input<Date>(new Date());
  
  infiniteScroll = input<ListTemplateInfiniteScroll>({
    enabled: false,
    threshold: 0.8,
    loadMoreText: 'Carregar mais',
    loadingText: 'Carregando...',
    noMoreText: 'Todos os itens foram carregados',
  });
  mobileFilters = input<ListTemplateMobileFilters>({
    enabled: true,
    overlay: true,
    position: 'left',
    width: '300px',
  });
  
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
  
  loadMore = output<void>();
  mobileFiltersToggle = output<boolean>();
  
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
  
  isMobile = computed(() => {
    return this.breakpointObserver.isMatched(Breakpoints.Handset);
  });
  
  filterOptions = computed(() => {
    return this.filters().map((filter) => ({
      key: filter.field,
      label: filter.field,
      value:
        typeof filter.value === 'object' && 'from' in filter.value
          ? filter.value.from
          : filter.value,
      type: this.getFilterType(filter.value),
    }));
  });

  private getFilterType(
    value:
      | string
      | number
      | Date
      | {
          from: Date;
          to: Date;
        }
  ): 'text' | 'select' | 'date' | 'number' {
    if (typeof value === 'number') return 'number';
    if (value instanceof Date) return 'date';
    if (typeof value === 'object' && value.from && value.to) return 'date';
    return 'text';
  }
  
  onRowClick(item: Record<string, unknown>) {
    this.rowClick.emit({
      item: item as ListTemplateData,
      index: 0,
      event: new MouseEvent('click'),
    });
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

  onFilterChange(filters: { field?: string; operator?: string; value?: unknown }[]) {
    
    const convertedFilters: ListTemplateFilter[] = filters.map((filter) => ({
      field: filter.field || '',
      operator: (filter.operator as ListTemplateFilter['operator']) || 'equals',
      value: (filter.value as ListTemplateFilter['value']) || '',
    }));
    this.filterChange.emit(convertedFilters);
  }

  onSortChange(sort: { field?: string; direction?: 'asc' | 'desc' }) {
    
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
    
    this.filterChange.emit(this.filters());
  }
  
  toggleMobileFilters() {
    const newState = !this.mobileFiltersOpen();
    this.mobileFiltersOpen.set(newState);
    this.mobileFiltersToggle.emit(newState);
  }

  loadMoreItems() {
    if (this.infiniteScroll().enabled && !this.infiniteScrollLoading()) {
      this.infiniteScrollLoading.set(true);
      this.loadMore.emit();
      
      setTimeout(() => {
        this.infiniteScrollLoading.set(false);
        this.currentPage.set(this.currentPage() + 1);
        
        this.hasMoreItems.set(this.currentPage() < 10); 
      }, 1000);
    }
  }
  
  ngAfterViewInit() {
    
    if (this.infiniteScroll().enabled && this.infiniteTrigger()) {
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private setupIntersectionObserver() {
    const infiniteTrigger = this.infiniteTrigger();
    if (!infiniteTrigger) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            this.infiniteScroll().enabled &&
            !this.infiniteScrollLoading()
          ) {
            this.loadMoreItems();
          }
        });
      },
      {
        threshold: this.infiniteScroll().threshold,
        rootMargin: '50px',
      }
    );

    this.intersectionObserver.observe(infiniteTrigger.nativeElement);
  }
}
