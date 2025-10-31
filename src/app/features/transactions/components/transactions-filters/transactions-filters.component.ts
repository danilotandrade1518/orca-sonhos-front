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
import { OsFilterBarComponent } from '../../../../shared/ui-components/molecules/os-filter-bar/os-filter-bar.component';
import type { OsFilterOption } from '../../../../shared/ui-components/molecules/os-filter-bar/os-filter-bar.component';

export interface TransactionsFilters {
  accountId?: string;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  type?: 'income' | 'expense' | 'transfer';
  amount?: number;
}

@Component({
  selector: 'os-transactions-filters',
  imports: [CommonModule, OsFilterBarComponent],
  template: `
    <os-filter-bar
      [variant]="'compact'"
      [size]="'medium'"
      [hasActiveFilters]="hasActiveFilters()"
      [persistFilters]="true"
      [persistKey]="'transactions-filters'"
      (clear)="onClearFilters()"
      (apply)="onApplyFilters()"
      (filtersRestored)="onFiltersRestored($event)"
    >
      <div class="os-transactions-filters__content">
        @for (option of filterOptions(); track option.key) {
        <div class="os-transactions-filters__item">
          <label [for]="'filter-' + option.key" class="os-transactions-filters__label">{{
            option.label
          }}</label>
          @switch (option.type) { @case ('text') {
          <input
            [id]="'filter-' + option.key"
            type="text"
            class="os-transactions-filters__input"
            [placeholder]="'Filtrar por ' + option.label"
            [value]="getFilterValue(option.key)"
            (input)="onFilterChange(option.key, $event)"
          />
          } @case ('select') {
          <select
            [id]="'filter-' + option.key"
            class="os-transactions-filters__select"
            [value]="getFilterValue(option.key)"
            (change)="onFilterChange(option.key, $event)"
          >
            <option value="">{{ 'Todos' }}</option>
            @for (opt of option.options; track opt.value) {
            <option [value]="opt.value">{{ opt.label }}</option>
            }
          </select>
          } @case ('date') {
          <input
            [id]="'filter-' + option.key"
            type="date"
            class="os-transactions-filters__input"
            [value]="getFilterValue(option.key)"
            (change)="onFilterChange(option.key, $event)"
          />
          } @case ('number') {
          <input
            [id]="'filter-' + option.key"
            type="number"
            class="os-transactions-filters__input"
            [placeholder]="'Filtrar por ' + option.label"
            [value]="getFilterValue(option.key)"
            (input)="onFilterChange(option.key, $event)"
          />
          } }
        </div>
        }
      </div>
    </os-filter-bar>
  `,
  styles: [
    `
      .os-transactions-filters__content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;
        width: 100%;
      }

      .os-transactions-filters__item {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .os-transactions-filters__label {
        font-size: 14px;
        font-weight: 500;
        color: var(--os-color-text-primary);
      }

      .os-transactions-filters__input,
      .os-transactions-filters__select {
        padding: 8px 12px;
        border: 1px solid var(--os-color-border);
        border-radius: 4px;
        font-size: 14px;
        background-color: var(--os-color-surface);
        color: var(--os-color-text-primary);
      }

      .os-transactions-filters__input:focus,
      .os-transactions-filters__select:focus {
        outline: 2px solid var(--os-color-primary);
        outline-offset: 2px;
      }

      @media (max-width: 768px) {
        .os-transactions-filters__content {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsFiltersComponent {
  readonly accountOptions = input<{ value: string; label: string }[]>([]);
  readonly categoryOptions = input<{ value: string; label: string }[]>([]);
  readonly initialFilters = input<Partial<TransactionsFilters>>({});

  readonly filtersChange = output<TransactionsFilters>();

  private readonly filters = signal<TransactionsFilters>({});

  readonly hasActiveFilters = computed(() => {
    const f = this.filters();
    return !!(f.accountId || f.categoryId || f.dateFrom || f.dateTo || f.type || f.amount);
  });

  readonly filterOptions = computed(() => {
    const options: OsFilterOption[] = [
      {
        key: 'accountId',
        label: 'Conta',
        value: this.filters().accountId || null,
        type: 'select',
        options: this.accountOptions(),
      },
      {
        key: 'categoryId',
        label: 'Categoria',
        value: this.filters().categoryId || null,
        type: 'select',
        options: this.categoryOptions(),
      },
      {
        key: 'dateFrom',
        label: 'Data de',
        value: this.filters().dateFrom || null,
        type: 'date',
      },
      {
        key: 'dateTo',
        label: 'Data até',
        value: this.filters().dateTo || null,
        type: 'date',
      },
      {
        key: 'type',
        label: 'Tipo',
        value: this.filters().type || null,
        type: 'select',
        options: [
          { value: 'income', label: 'Receita' },
          { value: 'expense', label: 'Despesa' },
          { value: 'transfer', label: 'Transferência' },
        ],
      },
      {
        key: 'amount',
        label: 'Valor',
        value: this.filters().amount || null,
        type: 'number',
      },
    ];

    return options;
  });

  constructor() {
    effect(() => {
      const initial = this.initialFilters();
      if (Object.keys(initial).length > 0) {
        this.filters.set({ ...this.filters(), ...initial });
      }
    });
  }

  getFilterValue(key: string): string {
    const f = this.filters();
    const value = f[key as keyof TransactionsFilters];
    if (value === undefined || value === null) return '';
    return String(value);
  }

  onFilterChange(key: string, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const value = target.value;

    this.filters.update((f) => {
      const updated = { ...f };
      if (value) {
        if (key === 'amount') {
          updated.amount = Number(value);
        } else {
          (updated as Record<string, string>)[key] = value;
        }
      } else {
        delete (updated as Record<string, unknown>)[key];
      }
      return updated;
    });
  }

  onClearFilters(): void {
    this.filters.set({});
    this.filtersChange.emit({});
  }

  onApplyFilters(): void {
    this.filtersChange.emit({ ...this.filters() });
  }

  onFiltersRestored(filters: Record<string, unknown>): void {
    const restored: TransactionsFilters = {};
    if (filters['accountId']) restored.accountId = String(filters['accountId']);
    if (filters['categoryId']) restored.categoryId = String(filters['categoryId']);
    if (filters['dateFrom']) restored.dateFrom = String(filters['dateFrom']);
    if (filters['dateTo']) restored.dateTo = String(filters['dateTo']);
    if (filters['type']) restored.type = filters['type'] as 'income' | 'expense' | 'transfer';
    if (filters['amount']) restored.amount = Number(filters['amount']);
    this.filters.set(restored);
    this.filtersChange.emit(restored);
  }
}
