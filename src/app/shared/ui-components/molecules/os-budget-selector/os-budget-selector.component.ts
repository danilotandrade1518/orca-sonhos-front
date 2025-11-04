import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

import {
  OsDropdownComponent,
  OsDropdownOption,
} from '@shared/ui-components/molecules/os-dropdown/os-dropdown.component';
import { OsIconComponent } from '@shared/ui-components/atoms/os-icon/os-icon.component';
import { OsSpinnerComponent } from '@shared/ui-components/atoms/os-spinner/os-spinner.component';

export interface BudgetOption {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  isShared: boolean;
  participants?: number;
  lastModified?: Date;
  balance?: number;
}

export type BudgetSelectorState = 'default' | 'loading' | 'error' | 'empty';

@Component({
  selector: 'os-budget-selector',
  standalone: true,
  imports: [CommonModule, OsDropdownComponent, OsIconComponent, OsSpinnerComponent],
  template: `
    <div
      class="os-budget-selector"
      [class]="containerClass()"
      role="combobox"
      [attr.aria-expanded]="isDropdownOpen()"
      aria-haspopup="listbox"
      aria-controls="budget-selector-dropdown"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-describedby]="hasError() ? 'budget-selector-error' : null"
      tabindex="0"
      (keydown)="onKeyDown($event)"
    >
      <!-- Main Selector (apenas o select de orçamentos) -->
      <div class="os-budget-selector__main">
        <os-dropdown
          id="budget-selector-dropdown"
          [options]="dropdownOptions()"
          [selectedValue]="selectedBudgetId()"
          [placeholder]="placeholder()"
          [variant]="variant()"
          [size]="size()"
          [disabled]="isLoading() || !hasAvailableBudgets()"
          [ariaLabel]="ariaLabel()"
          (valueChange)="onBudgetSelect($event)"
          (optionSelect)="onOptionSelect($event)"
          (dropdownToggle)="onDropdownToggle($event)"
          class="os-budget-selector__dropdown"
        />
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
      <div class="os-budget-selector__loading" aria-hidden="true">
        <os-spinner size="sm" variant="primary" />
      </div>
      }

      <!-- Error State -->
      @if (hasError()) {
      <div
        id="budget-selector-error"
        class="os-budget-selector__error"
        role="alert"
        aria-live="assertive"
      >
        <os-icon name="error" size="sm" variant="error" aria-hidden="true" />
        <span class="os-budget-selector__error-text">{{ errorMessage() }}</span>
      </div>
      }

      <!-- Sem estados de vazio/infos adicionais: manter o componente compacto na AppBar -->
    </div>
  `,
  styleUrls: ['./os-budget-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsBudgetSelectorComponent {
  readonly budgets = input<BudgetOption[]>([]);
  readonly selectedBudgetId = input<string | null>(null);
  readonly variant = input<'default' | 'primary' | 'secondary' | 'accent'>('default');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly placeholder = input<string>('Selecionar orçamento');
  readonly ariaLabel = input<string>('Seletor de orçamento melhorado');
  readonly state = input<BudgetSelectorState>('default');

  readonly budgetSelected = output<BudgetOption>();

  private readonly isDropdownOpenSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly isLoading = computed(() => this.state() === 'loading');
  readonly hasError = computed(() => this.state() === 'error' || !!this.errorSignal());
  readonly isDropdownOpen = computed(() => this.isDropdownOpenSignal());
  readonly errorMessage = computed(() => this.errorSignal());

  readonly hasAvailableBudgets = computed(() => this.budgets().length > 0);

  readonly dropdownOptions = computed((): OsDropdownOption[] => {
    return this.budgets().map((budget) => ({
      value: budget.id,
      label: budget.name,
      disabled: false,
      description: budget.description,
    }));
  });

  readonly containerClass = computed(() => {
    const classes = ['os-budget-selector'];

    if (this.variant() !== 'default') {
      classes.push(`os-budget-selector--${this.variant()}`);
    }

    if (this.size() !== 'medium') {
      classes.push(`os-budget-selector--${this.size()}`);
    }

    if (this.state() !== 'default') {
      classes.push(`os-budget-selector--${this.state()}`);
    }

    if (this.isLoading()) {
      classes.push('os-budget-selector--loading');
    }

    if (this.hasError()) {
      classes.push('os-budget-selector--error');
    }

    return classes.join(' ');
  });

  onBudgetSelect(budgetId: string | number | boolean): void {
    if (typeof budgetId === 'string') {
      const budget = this.budgets().find((b) => b.id === budgetId);
      if (budget) {
        this.budgetSelected.emit(budget);
      }
    }
  }

  onOptionSelect(option: OsDropdownOption): void {
    const budget = this.budgets().find((b) => b.id === option.value);
    if (budget) {
      this.budgetSelected.emit(budget);
    }
  }

  onDropdownToggle(isOpen: boolean | Event): void {
    if (typeof isOpen === 'boolean') {
      this.isDropdownOpenSignal.set(isOpen);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        if (!this.isDropdownOpen()) {
          event.preventDefault();
        }
        break;
      case 'Escape':
        if (this.isDropdownOpen()) {
          this.isDropdownOpenSignal.set(false);
        }
        break;
      case 'Enter':
      case ' ':
        break;
    }
  }
}
