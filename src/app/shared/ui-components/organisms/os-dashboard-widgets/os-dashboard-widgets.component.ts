import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, inject } from '@angular/core';

import {
  OsGoalProgressCardComponent,
  GoalProgressData,
} from '@shared/ui-components/molecules/os-goal-progress-card/os-goal-progress-card.component';

export type { GoalProgressData };
import { OsButtonComponent } from '@shared/ui-components/atoms/os-button/os-button.component';
import { OsIconComponent } from '@shared/ui-components/atoms/os-icon/os-icon.component';
import { OsProgressBarComponent } from '@shared/ui-components/atoms/os-progress-bar/os-progress-bar.component';
import { OsMoneyDisplayComponent } from '@shared/ui-components/molecules/os-money-display/os-money-display.component';
import { LocaleService } from '@shared/formatting';

export interface DashboardWidget {
  id: string;
  type:
    | 'goal-progress'
    | 'budget-summary'
    | 'transaction-list'
    | 'account-balance'
    | 'monthly-trends'
    | 'quick-actions';
  title: string;
  size: 'small' | 'medium' | 'large' | 'full-width';
  position: { row: number; column: number };
  enabled: boolean;
  data?: unknown;
}

export interface BudgetSummaryData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  savingsRate: number;
  budgetUtilization: number;
}

export interface TransactionData {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  type: 'income' | 'expense';
}

export interface AccountBalanceData {
  accountName: string;
  balance: number;
  type: 'checking' | 'savings' | 'investment';
  lastUpdated: Date;
}

export type DashboardState = 'loading' | 'error' | 'empty' | 'success';

@Component({
  selector: 'os-dashboard-widgets',
  standalone: true,
  imports: [
    CommonModule,
    OsGoalProgressCardComponent,
    OsButtonComponent,
    OsIconComponent,
    OsProgressBarComponent,
    OsMoneyDisplayComponent,
  ],
  template: `
    <div
      class="os-dashboard-widgets"
      [class]="containerClass()"
      role="main"
      aria-label="Dashboard widgets"
      aria-live="polite"
      [attr.aria-busy]="isLoading()"
    >
      @if (isLoading()) {
      <div class="os-dashboard-widgets__loading" role="status" aria-live="polite">
        <div class="os-dashboard-widgets__skeleton-grid" [class]="gridClass()">
          @for (widget of widgets(); track widget.id) {
          <div
            class="os-dashboard-widgets__skeleton-widget"
            [class]="getWidgetClass(widget)"
            aria-hidden="true"
          >
            <div class="os-dashboard-widgets__skeleton-header">
              <div class="os-dashboard-widgets__skeleton-title"></div>
            </div>
            <div class="os-dashboard-widgets__skeleton-content">
              <div class="os-dashboard-widgets__skeleton-line"></div>
              <div class="os-dashboard-widgets__skeleton-line"></div>
              <div
                class="os-dashboard-widgets__skeleton-line os-dashboard-widgets__skeleton-line--short"
              ></div>
            </div>
          </div>
          }
        </div>
      </div>
      } @else if (hasError()) {
      <div class="os-dashboard-widgets__error" role="alert" aria-live="assertive">
        <div class="os-dashboard-widgets__error-icon" aria-hidden="true">⚠️</div>
        <h3>Erro ao carregar dashboard</h3>
        <p>{{ errorMessage() }}</p>
        <os-button
          [variant]="'primary'"
          [size]="'medium'"
          [icon]="'refresh'"
          [ariaLabel]="'Tentar carregar dados novamente'"
          (buttonClick)="onRetry()"
        >
          Tentar Novamente
        </os-button>
      </div>
      } @else if (isEmpty()) {
      <div class="os-dashboard-widgets__empty" role="status">
        <div class="os-dashboard-widgets__empty-icon" aria-hidden="true">📊</div>
        <h3>Dashboard vazio</h3>
        <p>{{ emptyMessage() }}</p>
        @if (showCreateActions()) {
        <div class="os-dashboard-widgets__empty-actions">
          <os-button
            [variant]="'primary'"
            [size]="'medium'"
            [icon]="'add'"
            [ariaLabel]="'Criar primeiro orçamento'"
            (buttonClick)="onCreateBudget()"
          >
            Criar Orçamento
          </os-button>
          <os-button
            [variant]="'secondary'"
            [size]="'medium'"
            [icon]="'flag'"
            [ariaLabel]="'Criar primeira meta'"
            (buttonClick)="onCreateGoal()"
          >
            Criar Meta
          </os-button>
        </div>
        }
      </div>
      } @else {
      <div class="os-dashboard-widgets__grid" [class]="gridClass()">
        @for (widget of enabledWidgets(); track widget.id) {
        <div
          class="os-dashboard-widgets__widget"
          [class]="getWidgetClass(widget)"
          [attr.aria-label]="getWidgetAriaLabel(widget)"
          [attr.aria-describedby]="getWidgetDescriptionId(widget)"
          role="region"
          tabindex="0"
          (click)="onWidgetClick(widget)"
          (keydown)="onWidgetKeyDown($event, widget)"
        >
          <div class="os-dashboard-widgets__widget-header">
            <h4 class="os-dashboard-widgets__widget-title">{{ widget.title }}</h4>
          </div>

          <div class="os-dashboard-widgets__widget-content">
            @switch (widget.type) { @case ('goal-progress') {
            <os-goal-progress-card
              [goalData]="getGoalData(widget)"
              [variant]="'default'"
              [size]="getWidgetSize(widget)"
              [state]="getGoalState(widget)"
              [ariaLabel]="'Progresso da meta'"
            />
            } @case ('budget-summary') {
            <div class="os-dashboard-widgets__budget-summary">
              <div class="os-dashboard-widgets__metric">
                <span class="os-dashboard-widgets__metric-label">Saldo Total</span>
                <os-money-display
                  [value]="getBudgetSummary()?.totalBalance || 0"
                  [currency]="'BRL'"
                  [size]="'md'"
                  [ariaLabel]="
                    'Saldo total: ' + formatCurrency(getBudgetSummary()?.totalBalance || 0)
                  "
                  class="os-dashboard-widgets__metric-value"
                />
              </div>
              <div class="os-dashboard-widgets__metric">
                <span class="os-dashboard-widgets__metric-label">Receita Mensal</span>
                <os-money-display
                  [value]="getBudgetSummary()?.monthlyIncome || 0"
                  [currency]="'BRL'"
                  [size]="'md'"
                  [variant]="'positive'"
                  [ariaLabel]="
                    'Receita mensal: ' + formatCurrency(getBudgetSummary()?.monthlyIncome || 0)
                  "
                  class="os-dashboard-widgets__metric-value"
                />
              </div>
              <div class="os-dashboard-widgets__metric">
                <span class="os-dashboard-widgets__metric-label">Despesa Mensal</span>
                <os-money-display
                  [value]="getBudgetSummary()?.monthlyExpense || 0"
                  [currency]="'BRL'"
                  [size]="'md'"
                  [variant]="'negative'"
                  [ariaLabel]="
                    'Despesa mensal: ' + formatCurrency(getBudgetSummary()?.monthlyExpense || 0)
                  "
                  class="os-dashboard-widgets__metric-value"
                />
              </div>
              <div class="os-dashboard-widgets__progress">
                <span class="os-dashboard-widgets__progress-label">Utilização do Orçamento</span>
                <os-progress-bar
                  [value]="getBudgetSummary()?.budgetUtilization || 0"
                  [variant]="getBudgetProgressVariant()"
                  [ariaLabel]="
                    'Utilização do orçamento: ' + (getBudgetSummary()?.budgetUtilization || 0) + '%'
                  "
                />
              </div>
            </div>
            } @case ('transaction-list') {
            <div class="os-dashboard-widgets__transaction-list">
              @for (transaction of getRecentTransactions(); track transaction.id) {
              <div class="os-dashboard-widgets__transaction-item">
                <div class="os-dashboard-widgets__transaction-info">
                  <span class="os-dashboard-widgets__transaction-description">{{
                    transaction.description
                  }}</span>
                  <span class="os-dashboard-widgets__transaction-category">{{
                    transaction.category
                  }}</span>
                </div>
                <os-money-display
                  [value]="transaction.amount"
                  [currency]="'BRL'"
                  [size]="'sm'"
                  [variant]="transaction.type === 'income' ? 'positive' : 'negative'"
                  [class]="getTransactionAmountClass(transaction)"
                  class="os-dashboard-widgets__transaction-amount"
                />
              </div>
              }
            </div>
            } @case ('account-balance') {
            <div class="os-dashboard-widgets__account-balance">
              @for (account of getAccountBalances(widget); track account.accountName) {
              <div class="os-dashboard-widgets__account-item">
                <div class="os-dashboard-widgets__account-info">
                  <os-icon
                    [name]="getAccountIcon(account.type)"
                    size="sm"
                    variant="default"
                    aria-hidden="true"
                  />
                  <span class="os-dashboard-widgets__account-name">{{ account.accountName }}</span>
                </div>
                <os-money-display
                  [value]="account.balance"
                  [currency]="'BRL'"
                  [size]="'sm'"
                  class="os-dashboard-widgets__account-balance"
                />
              </div>
              }
            </div>
            } @case ('monthly-trends') {
            <div class="os-dashboard-widgets__monthly-trends">
              <p>Gráficos de tendências mensais serão exibidos aqui</p>
            </div>
            } @case ('quick-actions') {
            <div class="os-dashboard-widgets__quick-actions">
              <os-button
                [variant]="'primary'"
                [size]="'medium'"
                [icon]="'add'"
                [ariaLabel]="'Adicionar transação'"
                (buttonClick)="onAddTransaction()"
              >
                Adicionar Transação
              </os-button>
              <os-button
                [variant]="'secondary'"
                [size]="'medium'"
                [icon]="'flag'"
                [ariaLabel]="'Criar nova meta'"
                (buttonClick)="onCreateGoal()"
              >
                Criar Meta
              </os-button>
              <os-button
                [variant]="'tertiary'"
                [size]="'medium'"
                [icon]="'analytics'"
                [ariaLabel]="'Ver relatórios'"
                (buttonClick)="onViewReports()"
              >
                Relatórios
              </os-button>
            </div>
            } @default {
            <div class="os-dashboard-widgets__placeholder">
              <p>Widget não implementado: {{ widget.type }}</p>
            </div>
            } }
          </div>
        </div>
        }
      </div>
      }
    </div>
  `,
  styleUrls: ['./os-dashboard-widgets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OsDashboardWidgetsComponent {
  private readonly localeService = inject(LocaleService);

  readonly widgets = input<DashboardWidget[]>([]);
  readonly variant = input<'default' | 'compact' | 'extended'>('default');
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly state = input<DashboardState>('success');
  readonly showCreateActions = input<boolean>(true);
  readonly errorMessage = input<string>('Erro ao carregar dados do dashboard');
  readonly emptyMessage = input<string>('Nenhum dado disponível para exibir');

  readonly widgetClick = output<DashboardWidget>();
  readonly retryRequested = output<void>();
  readonly createBudgetRequested = output<void>();
  readonly createGoalRequested = output<void>();
  readonly addTransactionRequested = output<void>();
  readonly viewReportsRequested = output<void>();
  readonly goalCardClick = output<GoalProgressData>();
  readonly goalCardExpand = output<GoalProgressData>();

  readonly isLoading = computed(() => this.state() === 'loading');
  readonly hasError = computed(() => this.state() === 'error');
  readonly isEmpty = computed(() => this.state() === 'empty');

  readonly enabledWidgets = computed(() => this.widgets().filter((widget) => widget.enabled));

  readonly containerClass = computed(() => {
    const classes = ['os-dashboard-widgets'];

    if (this.variant() !== 'default') {
      classes.push(`os-dashboard-widgets--${this.variant()}`);
    }

    if (this.size() !== 'medium') {
      classes.push(`os-dashboard-widgets--${this.size()}`);
    }

    if (this.state() !== 'success') {
      classes.push(`os-dashboard-widgets--${this.state()}`);
    }

    return classes.join(' ');
  });

  readonly gridClass = computed(() => {
    const classes = ['os-dashboard-widgets__grid'];

    if (this.variant() !== 'default') {
      classes.push(`os-dashboard-widgets__grid--${this.variant()}`);
    }

    return classes.join(' ');
  });

  getWidgetClass(widget: DashboardWidget): string {
    const classes = ['os-dashboard-widgets__widget'];

    if (widget.size !== 'medium') {
      classes.push(`os-dashboard-widgets__widget--${widget.size}`);
    }

    classes.push(`os-dashboard-widgets__widget--${widget.type}`);

    return classes.join(' ');
  }

  getWidgetAriaLabel(widget: DashboardWidget): string {
    return `Widget: ${widget.title}`;
  }

  getWidgetDescriptionId(widget: DashboardWidget): string {
    return `widget-description-${widget.id}`;
  }

  getWidgetSize(widget: DashboardWidget): 'small' | 'medium' | 'large' {
    switch (widget.size) {
      case 'small':
        return 'small';
      case 'large':
      case 'full-width':
        return 'large';
      default:
        return 'medium';
    }
  }

  getGoalData(widget: DashboardWidget): GoalProgressData | null {
    return (widget.data as GoalProgressData) || null;
  }

  getGoalState(widget: DashboardWidget): 'default' | 'completed' | 'overdue' | 'loading' {
    const goalData = this.getGoalData(widget);
    if (!goalData) return 'loading';

    if (goalData.currentValue >= goalData.targetValue) return 'completed';
    if (goalData.deadline && new Date() > goalData.deadline) return 'overdue';
    return 'default';
  }

  getBudgetSummary(): BudgetSummaryData | null {
    return {
      totalBalance: 25000.5,
      monthlyIncome: 8000.0,
      monthlyExpense: 5500.0,
      savingsRate: 31.25,
      budgetUtilization: 68.75,
    };
  }

  getBudgetProgressVariant(): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' {
    const utilization = this.getBudgetSummary()?.budgetUtilization || 0;
    if (utilization >= 90) return 'danger';
    if (utilization >= 75) return 'warning';
    return 'primary';
  }

  getRecentTransactions(): TransactionData[] {
    return [
      {
        id: '1',
        description: 'Supermercado',
        amount: -150.0,
        category: 'Alimentação',
        date: new Date('2024-12-19'),
        type: 'expense',
      },
      {
        id: '2',
        description: 'Salário',
        amount: 8000.0,
        category: 'Rendimento',
        date: new Date('2024-12-15'),
        type: 'income',
      },
      {
        id: '3',
        description: 'Conta de Luz',
        amount: -120.5,
        category: 'Utilidades',
        date: new Date('2024-12-18'),
        type: 'expense',
      },
    ];
  }

  getAccountBalances(widget: DashboardWidget): AccountBalanceData[] {
    if (widget.data && Array.isArray(widget.data)) {
      return widget.data as AccountBalanceData[];
    }
    return [
      {
        accountName: 'Conta Corrente',
        balance: 15000.5,
        type: 'checking',
        lastUpdated: new Date('2024-12-19'),
      },
      {
        accountName: 'Poupança',
        balance: 10000.0,
        type: 'savings',
        lastUpdated: new Date('2024-12-19'),
      },
    ];
  }

  getTransactionAmountClass(transaction: TransactionData): string {
    return transaction.type === 'income'
      ? 'os-dashboard-widgets__transaction-amount--income'
      : 'os-dashboard-widgets__transaction-amount--expense';
  }

  getAccountIcon(type: string): string {
    switch (type) {
      case 'checking':
        return 'account_balance';
      case 'savings':
        return 'savings';
      case 'investment':
        return 'trending_up';
      default:
        return 'account_balance';
    }
  }

  formatCurrency(value: number): string {
    return this.localeService.formatCurrency(value, 'BRL');
  }

  onWidgetClick(widget: DashboardWidget): void {
    this.widgetClick.emit(widget);
  }

  onWidgetKeyDown(event: KeyboardEvent, widget: DashboardWidget): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onWidgetClick(widget);
    }
  }

  onRetry(): void {
    this.retryRequested.emit();
  }

  onCreateBudget(): void {
    this.createBudgetRequested.emit();
  }

  onCreateGoal(): void {
    this.createGoalRequested.emit();
  }

  onAddTransaction(): void {
    this.addTransactionRequested.emit();
  }

  onViewReports(): void {
    this.viewReportsRequested.emit();
  }

  onGoalCardClick(goalData: GoalProgressData): void {
    this.goalCardClick.emit(goalData);
  }

  onGoalCardExpand(goalData: GoalProgressData): void {
    this.goalCardExpand.emit(goalData);
  }
}
