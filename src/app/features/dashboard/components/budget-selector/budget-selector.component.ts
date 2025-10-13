import {
  Component,
  computed,
  inject,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  OsDropdownComponent,
  OsDropdownOption,
} from '../../../../shared/ui-components/molecules/os-dropdown/os-dropdown.component';
import { OsButtonComponent } from '../../../../shared/ui-components/atoms/os-button/os-button.component';
import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import { BudgetDto } from '../../../../../dtos/budget/budget-types';

@Component({
  selector: 'os-budget-selector',
  standalone: true,
  imports: [CommonModule, OsDropdownComponent, OsButtonComponent],
  template: `
    <div
      class="os-budget-selector"
      [class]="containerClass()"
      role="combobox"
      [attr.aria-expanded]="isDropdownOpen()"
      aria-haspopup="listbox"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-describedby]="hasError() ? 'budget-selector-error' : null"
      tabindex="0"
      (keydown)="onKeyDown($event)"
    >
      <os-dropdown
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

      @if (showCreateButton()) {
      <os-button
        [variant]="'primary'"
        [size]="size()"
        [disabled]="isLoading()"
        [loading]="isLoading()"
        [icon]="'add'"
        [ariaLabel]="'Criar novo orçamento'"
        (buttonClick)="onCreateBudget()"
        class="os-budget-selector__create-button"
      >
        Criar Novo
      </os-button>
      } @if (hasError()) {
      <div
        id="budget-selector-error"
        class="os-budget-selector__error"
        role="alert"
        aria-live="assertive"
      >
        {{ errorMessage() }}
      </div>
      }
    </div>
  `,
  styleUrls: ['./budget-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetSelectorComponent {
  private readonly budgetSelectionService = inject(BudgetSelectionService);

  // Inputs
  readonly variant = input<'default' | 'primary' | 'secondary' | 'accent'>('default');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly placeholder = input<string>('Selecionar orçamento');
  readonly showCreateButton = input<boolean>(true);
  readonly ariaLabel = input<string>('Seletor de orçamento');

  // Outputs
  readonly budgetSelected = output<BudgetDto>();
  readonly createBudgetRequested = output<void>();

  // Signals for internal state
  private readonly isDropdownOpenSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  // Computed properties
  readonly selectedBudgetId = computed(() => this.budgetSelectionService.selectedBudgetId());
  readonly availableBudgets = computed(() => this.budgetSelectionService.availableBudgets());
  readonly isLoading = computed(() => this.budgetSelectionService.isLoading());
  readonly hasAvailableBudgets = computed(() => this.budgetSelectionService.hasAvailableBudgets());
  readonly selectedBudget = computed(() => this.budgetSelectionService.selectedBudget());
  readonly isDropdownOpen = computed(() => this.isDropdownOpenSignal());
  readonly hasError = computed(() => !!this.errorSignal());
  readonly errorMessage = computed(() => this.errorSignal());

  readonly dropdownOptions = computed((): OsDropdownOption[] => {
    const budgets = this.availableBudgets();
    return budgets.map((budget) => ({
      value: budget.id,
      label: budget.name,
      disabled: false,
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

    if (this.isLoading()) {
      classes.push('os-budget-selector--loading');
    }

    if (!this.hasAvailableBudgets()) {
      classes.push('os-budget-selector--empty');
    }

    return classes.join(' ');
  });

  onBudgetSelect(value: string | number | boolean): void {
    if (typeof value === 'string') {
      const budget = this.availableBudgets().find((b) => b.id === value);
      if (budget) {
        this.budgetSelectionService.setSelectedBudget(budget);
        this.budgetSelected.emit(budget);
      }
    }
  }

  onOptionSelect(option: OsDropdownOption): void {
    if (typeof option.value === 'string') {
      const budget = this.availableBudgets().find((b) => b.id === option.value);
      if (budget) {
        this.budgetSelectionService.setSelectedBudget(budget);
        this.budgetSelected.emit(budget);
      }
    }
  }

  onCreateBudget(): void {
    this.createBudgetRequested.emit();
  }

  onDropdownToggle(event: Event): void {
    const isOpen = (event as CustomEvent).detail || false;
    this.isDropdownOpenSignal.set(isOpen);
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isDropdownOpen()) {
          this.isDropdownOpenSignal.set(true);
        }
        break;
      case 'Escape':
        if (this.isDropdownOpen()) {
          this.isDropdownOpenSignal.set(false);
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isDropdownOpen()) {
          this.isDropdownOpenSignal.set(true);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.isDropdownOpen()) {
          this.isDropdownOpenSignal.set(false);
        }
        break;
      case 'Tab':
        // Allow default tab behavior
        break;
      default:
        // Handle other keys if needed
        break;
    }
  }
}
