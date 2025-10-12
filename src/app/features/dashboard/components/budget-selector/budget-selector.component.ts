import { Component, computed, inject, ChangeDetectionStrategy, input, output } from '@angular/core';
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
    <div class="os-budget-selector" [class]="containerClass()">
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
        class="os-budget-selector__dropdown"
      />

      @if (showCreateButton()) {
      <os-button
        [variant]="'primary'"
        [size]="size()"
        [disabled]="isLoading()"
        [loading]="isLoading()"
        [icon]="'add'"
        (buttonClick)="onCreateBudget()"
        class="os-budget-selector__create-button"
      >
        Criar Novo
      </os-button>
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

  // Computed properties
  readonly selectedBudgetId = computed(() => this.budgetSelectionService.selectedBudgetId());
  readonly availableBudgets = computed(() => this.budgetSelectionService.availableBudgets());
  readonly isLoading = computed(() => this.budgetSelectionService.isLoading());
  readonly hasAvailableBudgets = computed(() => this.budgetSelectionService.hasAvailableBudgets());
  readonly selectedBudget = computed(() => this.budgetSelectionService.selectedBudget());

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
}
