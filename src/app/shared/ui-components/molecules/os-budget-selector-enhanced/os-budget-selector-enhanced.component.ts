import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { OsButtonComponent } from '@shared/ui-components/atoms/os-button/os-button.component';
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
  selector: 'os-budget-selector-enhanced',
  standalone: true,
  imports: [
    CommonModule,
    OsButtonComponent,
    OsDropdownComponent,
    OsIconComponent,
    OsSpinnerComponent,
  ],
  template: `
    <div
      class="os-budget-selector-enhanced"
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
      <!-- Main Selector -->
      <div class="os-budget-selector-enhanced__main">
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
          class="os-budget-selector-enhanced__dropdown"
        />

        @if (showQuickActions() && !isMobile()) {
        <div class="os-budget-selector-enhanced__quick-actions">
          @if (showCreateButton()) {
          <os-button
            [variant]="'secondary'"
            [size]="size()"
            [disabled]="isLoading()"
            [icon]="'add'"
            [ariaLabel]="'Criar novo orçamento'"
            (buttonClick)="onCreateBudget()"
            class="os-budget-selector-enhanced__create-button"
          >
            Criar
          </os-button>
          } @if (showShareButton() && selectedBudget()) {
          <os-button
            [variant]="'tertiary'"
            [size]="size()"
            [disabled]="isLoading()"
            [icon]="'share'"
            [ariaLabel]="'Compartilhar orçamento'"
            (buttonClick)="onShareBudget()"
            class="os-budget-selector-enhanced__share-button"
          >
            Compartilhar
          </os-button>
          }
        </div>
        }
      </div>

      <!-- Mobile Actions -->
      @if (isMobile()) {
      <div class="os-budget-selector-enhanced__mobile-actions">
        @if (showCreateButton()) {
        <os-button
          [variant]="'primary'"
          [size]="size()"
          [disabled]="isLoading()"
          [icon]="'add'"
          [ariaLabel]="'Criar novo orçamento'"
          (buttonClick)="onCreateBudget()"
          class="os-budget-selector-enhanced__mobile-create"
        >
          Criar Novo
        </os-button>
        } @if (showShareButton() && selectedBudget()) {
        <os-button
          [variant]="'secondary'"
          [size]="size()"
          [disabled]="isLoading()"
          [icon]="'share'"
          [ariaLabel]="'Compartilhar orçamento'"
          (buttonClick)="onShareBudget()"
          class="os-budget-selector-enhanced__mobile-share"
        >
          Compartilhar
        </os-button>
        }
      </div>
      }

      <!-- Loading State -->
      @if (isLoading()) {
      <div class="os-budget-selector-enhanced__loading" aria-hidden="true">
        <os-spinner size="sm" variant="primary" />
      </div>
      }

      <!-- Error State -->
      @if (hasError()) {
      <div
        id="budget-selector-error"
        class="os-budget-selector-enhanced__error"
        role="alert"
        aria-live="assertive"
      >
        <os-icon name="error" size="sm" variant="error" aria-hidden="true" />
        <span class="os-budget-selector-enhanced__error-text">{{ errorMessage() }}</span>
      </div>
      }

      <!-- Empty State -->
      @if (isEmpty() && !isLoading()) {
      <div class="os-budget-selector-enhanced__empty" role="status">
        <os-icon name="info" size="md" variant="info" aria-hidden="true" />
        <span class="os-budget-selector-enhanced__empty-text">{{ emptyMessage() }}</span>
        @if (showCreateButton()) {
        <os-button
          [variant]="'primary'"
          [size]="'small'"
          [icon]="'add'"
          [ariaLabel]="'Criar primeiro orçamento'"
          (buttonClick)="onCreateBudget()"
          class="os-budget-selector-enhanced__empty-create"
        >
          Criar Primeiro Orçamento
        </os-button>
        }
      </div>
      }

      <!-- Budget Info (when selected) -->
      @if (selectedBudget() && !isLoading() && !hasError()) {
      <div class="os-budget-selector-enhanced__info">
        <div class="os-budget-selector-enhanced__info-item">
          <os-icon name="people" size="xs" variant="default" aria-hidden="true" />
          <span class="os-budget-selector-enhanced__info-text">
            {{ getParticipantsText() }}
          </span>
        </div>
        @if (selectedBudget()?.balance !== undefined) {
        <div class="os-budget-selector-enhanced__info-item">
          <os-icon name="wallet" size="xs" variant="default" aria-hidden="true" />
          <span class="os-budget-selector-enhanced__info-text">
            Saldo: {{ formatCurrency(selectedBudget()?.balance || 0) }}
          </span>
        </div>
        } @if (selectedBudget()?.lastModified) {
        <div class="os-budget-selector-enhanced__info-item">
          <os-icon name="time" size="xs" variant="default" aria-hidden="true" />
          <span class="os-budget-selector-enhanced__info-text">
            Atualizado: {{ formatDate(selectedBudget()?.lastModified) }}
          </span>
        </div>
        }
      </div>
      }
    </div>
  `,
  styleUrls: ['./os-budget-selector-enhanced.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsBudgetSelectorEnhancedComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);

  // Inputs
  readonly budgets = input<BudgetOption[]>([]);
  readonly selectedBudgetId = input<string | null>(null);
  readonly variant = input<'default' | 'primary' | 'secondary' | 'accent'>('default');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly placeholder = input<string>('Selecionar orçamento');
  readonly showCreateButton = input<boolean>(true);
  readonly showShareButton = input<boolean>(true);
  readonly showQuickActions = input<boolean>(true);
  readonly ariaLabel = input<string>('Seletor de orçamento melhorado');
  readonly emptyMessage = input<string>('Nenhum orçamento disponível');
  readonly state = input<BudgetSelectorState>('default');

  // Outputs
  readonly budgetSelected = output<BudgetOption>();
  readonly createBudgetRequested = output<void>();
  readonly shareBudgetRequested = output<BudgetOption>();
  readonly budgetInfoRequested = output<BudgetOption>();

  // Signals for internal state
  private readonly isDropdownOpenSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  // Computed properties
  readonly isLoading = computed(() => this.state() === 'loading');
  readonly hasError = computed(() => this.state() === 'error' || !!this.errorSignal());
  readonly isEmpty = computed(() => this.state() === 'empty' || this.budgets().length === 0);
  readonly isDropdownOpen = computed(() => this.isDropdownOpenSignal());
  readonly errorMessage = computed(() => this.errorSignal());

  readonly selectedBudget = computed((): BudgetOption | null => {
    const selectedId = this.selectedBudgetId();
    if (!selectedId) return null;
    return this.budgets().find((budget) => budget.id === selectedId) || null;
  });

  readonly hasAvailableBudgets = computed(() => this.budgets().length > 0);

  readonly isMobile = computed(() => {
    return this.breakpointObserver.isMatched(Breakpoints.Handset);
  });

  readonly dropdownOptions = computed((): OsDropdownOption[] => {
    return this.budgets().map((budget) => ({
      value: budget.id,
      label: budget.name,
      disabled: false,
      description: budget.description,
    }));
  });

  readonly containerClass = computed(() => {
    const classes = ['os-budget-selector-enhanced'];

    if (this.variant() !== 'default') {
      classes.push(`os-budget-selector-enhanced--${this.variant()}`);
    }

    if (this.size() !== 'medium') {
      classes.push(`os-budget-selector-enhanced--${this.size()}`);
    }

    if (this.state() !== 'default') {
      classes.push(`os-budget-selector-enhanced--${this.state()}`);
    }

    if (this.isMobile()) {
      classes.push('os-budget-selector-enhanced--mobile');
    }

    if (this.isLoading()) {
      classes.push('os-budget-selector-enhanced--loading');
    }

    if (this.hasError()) {
      classes.push('os-budget-selector-enhanced--error');
    }

    if (this.isEmpty()) {
      classes.push('os-budget-selector-enhanced--empty');
    }

    return classes.join(' ');
  });

  // Methods
  getParticipantsText(): string {
    const budget = this.selectedBudget();
    if (!budget) return '';

    if (budget.isShared && budget.participants) {
      return `${budget.participants} participante${budget.participants > 1 ? 's' : ''}`;
    }

    return budget.isShared ? 'Compartilhado' : 'Pessoal';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }

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

  onCreateBudget(): void {
    this.createBudgetRequested.emit();
  }

  onShareBudget(): void {
    const budget = this.selectedBudget();
    if (budget) {
      this.shareBudgetRequested.emit(budget);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        if (!this.isDropdownOpen()) {
          event.preventDefault();
          // Trigger dropdown open
        }
        break;
      case 'Escape':
        if (this.isDropdownOpen()) {
          this.isDropdownOpenSignal.set(false);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.isEmpty() && this.showCreateButton()) {
          this.onCreateBudget();
        }
        break;
    }
  }
}
