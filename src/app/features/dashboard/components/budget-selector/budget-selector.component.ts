import {
  Component,
  computed,
  inject,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
} from '@angular/core';

import {
  OsBudgetSelectorComponent,
  BudgetOption,
} from '../../../../shared/ui-components/molecules/os-budget-selector/os-budget-selector.component';
import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import { BudgetDto } from '../../../../../dtos/budget/budget-types';

@Component({
  selector: 'os-dashboard-budget-selector',
  standalone: true,
  imports: [OsBudgetSelectorComponent],
  template: `
    <os-budget-selector
      [budgets]="budgetOptions()"
      [selectedBudgetId]="selectedBudgetId()"
      [variant]="variant()"
      [size]="size()"
      [placeholder]="placeholder()"
      [ariaLabel]="ariaLabel()"
      [state]="selectorState()"
      (budgetSelected)="onBudgetSelected($event)"
    />
  `,
  styleUrls: ['./budget-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetSelectorComponent {
  private readonly budgetSelectionService = inject(BudgetSelectionService);
  
  readonly variant = input<'default' | 'primary' | 'secondary' | 'accent'>('default');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly placeholder = input<string>('Selecionar orçamento');
  readonly ariaLabel = input<string>('Seletor de orçamento');
  
  readonly budgetSelected = output<BudgetDto>();
  
  private readonly errorSignal = signal<string | null>(null);
  
  readonly selectedBudgetId = computed(() => this.budgetSelectionService.selectedBudgetId());
  readonly availableBudgets = computed(() => this.budgetSelectionService.availableBudgets());
  readonly isLoading = computed(() => this.budgetSelectionService.isLoading());
  readonly hasAvailableBudgets = computed(() => this.budgetSelectionService.hasAvailableBudgets());
  readonly selectedBudget = computed(() => this.budgetSelectionService.selectedBudget());
  readonly hasError = computed(() => !!this.errorSignal());
  readonly errorMessage = computed(() => this.errorSignal());

  readonly budgetOptions = computed((): BudgetOption[] => {
    const budgets = this.availableBudgets();
    return budgets.map((budget) => ({
      id: budget.id,
      name: budget.name,
      description: '',
      isActive: true,
      isShared: budget.type === 'SHARED',
      participants: budget.participantsCount,
      lastModified: undefined,
      balance: undefined,
    }));
  });

  readonly selectorState = computed(() => {
    if (this.isLoading()) return 'loading';
    if (this.hasError()) return 'error';
    return 'default';
  });

  onBudgetSelected(budgetOption: BudgetOption): void {
    const budget = this.availableBudgets().find((b) => b.id === budgetOption.id);
    if (budget) {
      this.budgetSelectionService.setSelectedBudget(budget);
      this.budgetSelected.emit(budget);
    }
  }
  
}
