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
  OsBudgetSelectorComponent,
  BudgetOption,
} from '../../../../shared/ui-components/molecules/os-budget-selector/os-budget-selector.component';
import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import { BudgetDto } from '../../../../../dtos/budget/budget-types';

@Component({
  selector: 'os-dashboard-budget-selector',
  standalone: true,
  imports: [CommonModule, OsBudgetSelectorComponent],
  template: `
    <os-budget-selector
      [budgets]="budgetOptions()"
      [selectedBudgetId]="selectedBudgetId()"
      [variant]="variant()"
      [size]="size()"
      [placeholder]="placeholder()"
      [showCreateButton]="showCreateButton()"
      [showShareButton]="showShareButton()"
      [showQuickActions]="showQuickActions()"
      [ariaLabel]="ariaLabel()"
      [emptyMessage]="emptyMessage()"
      [state]="selectorState()"
      (budgetSelected)="onBudgetSelected($event)"
      (createBudgetRequested)="onCreateBudgetRequested()"
      (shareBudgetRequested)="onShareBudgetRequested($event)"
      (budgetInfoRequested)="onBudgetInfoRequested($event)"
      class="os-budget-selector"
    />
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
  readonly showShareButton = input<boolean>(true);
  readonly showQuickActions = input<boolean>(true);
  readonly ariaLabel = input<string>('Seletor de orçamento');
  readonly emptyMessage = input<string>('Nenhum orçamento disponível');

  // Outputs
  readonly budgetSelected = output<BudgetDto>();
  readonly createBudgetRequested = output<void>();
  readonly shareBudgetRequested = output<BudgetDto>();
  readonly budgetInfoRequested = output<BudgetDto>();

  // Signals for internal state
  private readonly errorSignal = signal<string | null>(null);

  // Computed properties
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
    if (!this.hasAvailableBudgets()) return 'empty';
    return 'default';
  });

  onBudgetSelected(budgetOption: BudgetOption): void {
    const budget = this.availableBudgets().find((b) => b.id === budgetOption.id);
    if (budget) {
      this.budgetSelectionService.setSelectedBudget(budget);
      this.budgetSelected.emit(budget);
    }
  }

  onCreateBudgetRequested(): void {
    this.createBudgetRequested.emit();
  }

  onShareBudgetRequested(budgetOption: BudgetOption): void {
    const budget = this.availableBudgets().find((b) => b.id === budgetOption.id);
    if (budget) {
      this.shareBudgetRequested.emit(budget);
    }
  }

  onBudgetInfoRequested(budgetOption: BudgetOption): void {
    const budget = this.availableBudgets().find((b) => b.id === budgetOption.id);
    if (budget) {
      this.budgetInfoRequested.emit(budget);
    }
  }
}
