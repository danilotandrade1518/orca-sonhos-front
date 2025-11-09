import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { OsFilterBarComponent } from '@shared/ui-components/molecules/os-filter-bar/os-filter-bar.component';
import { OsSelectComponent } from '@shared/ui-components/atoms/os-select/os-select.component';
import {
  OsBudgetSelectorComponent,
  type BudgetOption,
} from '@shared/ui-components/molecules/os-budget-selector/os-budget-selector.component';
import type { ReportFilters, ReportPeriod } from '../../types/reports.types';
import { ReportPeriod as ReportPeriodEnum } from '../../types/reports.types';

@Component({
  selector: 'os-report-filters',
  template: `
    <os-filter-bar
      [variant]="'compact'"
      [size]="'medium'"
      [hasActiveFilters]="hasActiveFilters()"
      [showActions]="false"
      [ariaLabel]="'Filtros de relatórios financeiros'"
    >
      <div class="os-report-filters__content">
        <div class="os-report-filters__item">
          <os-select
            [label]="'Período'"
            [options]="periodOptions()"
            [value]="selectedPeriod()"
            [size]="'medium'"
            [ariaLabel]="'Selecionar período do relatório'"
            (valueChange)="onPeriodChange($event)"
          />
        </div>

        @if (showBudgetSelector() && budgets().length > 1) {
        <div class="os-report-filters__item">
          <os-budget-selector
            [budgets]="budgets()"
            [selectedBudgetId]="selectedBudgetId()"
            [size]="'medium'"
            [ariaLabel]="'Selecionar orçamento para o relatório'"
            (budgetSelected)="onBudgetChange($event)"
          />
        </div>
        }
      </div>
    </os-filter-bar>
  `,
  styles: [
    `
      .os-report-filters__content {
        display: flex;
        flex-direction: row;
        gap: 16px;
        width: 100%;
        align-items: flex-start;
      }

      .os-report-filters__item {
        flex: 0 0 auto;
      }

      @media (max-width: 575px) {
        .os-report-filters__content {
          flex-direction: column;
          gap: 12px;
        }

        .os-report-filters__item {
          width: 100%;
        }
      }

      @media (min-width: 576px) and (max-width: 991px) {
        .os-report-filters__content {
          gap: 12px;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, OsFilterBarComponent, OsSelectComponent, OsBudgetSelectorComponent],
})
export class ReportFiltersComponent {
  initialFilters = input<Partial<ReportFilters>>({});
  budgets = input<BudgetOption[]>([]);
  selectedBudgetId = input<string | null>(null);
  showBudgetSelector = input(true);

  filtersChange = output<ReportFilters>();

  private readonly _period = signal<ReportPeriod>(ReportPeriodEnum.CURRENT_MONTH);
  private readonly _budgetId = signal<string | undefined>(undefined);

  readonly selectedPeriod = computed(() => this._period());

  readonly periodOptions = computed(() => {
    return [
      { value: ReportPeriodEnum.CURRENT_MONTH, label: 'Mês Atual' },
      { value: ReportPeriodEnum.LAST_MONTH, label: 'Mês Anterior' },
      { value: ReportPeriodEnum.LAST_3_MONTHS, label: 'Últimos 3 Meses' },
    ];
  });

  readonly hasActiveFilters = computed(() => {
    return this._period() !== ReportPeriodEnum.CURRENT_MONTH || !!this._budgetId();
  });

  constructor() {
    effect(() => {
      const initial = this.initialFilters();
      if (initial.period) {
        this._period.set(initial.period);
      }
      if (initial.budgetId !== undefined) {
        this._budgetId.set(initial.budgetId);
      }
    });

    effect(() => {
      const budgetId = this.selectedBudgetId();
      if (budgetId !== null && budgetId !== undefined) {
        this._budgetId.set(budgetId);
      }
    });

    effect(() => {
      const filters: ReportFilters = {
        period: this._period(),
        budgetId: this._budgetId(),
      };
      this.filtersChange.emit(filters);
    });
  }

  onPeriodChange(value: string | number): void {
    this._period.set(value as ReportPeriod);
  }

  onBudgetChange(budget: BudgetOption): void {
    this._budgetId.set(budget.id);
  }

  clearFilters(): void {
    this._period.set(ReportPeriodEnum.CURRENT_MONTH);
    this._budgetId.set(undefined);
  }
}
