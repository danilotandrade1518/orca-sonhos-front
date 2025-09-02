import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

type BudgetOption = { id: string; name: string; period: string };
type Overview = {
  totalBalance: number;
  monthIncome: number;
  monthExpense: number;
  netMonth: number;
};

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardPage {
  // state
  readonly budgets = signal<BudgetOption[]>([
    { id: '2025-01', name: 'Janeiro', period: '2025-01' },
    { id: '2025-02', name: 'Fevereiro', period: '2025-02' },
    { id: '2025-03', name: 'Março', period: '2025-03' },
  ]);
  readonly selectedBudgetId = signal<string>('2025-03');
  readonly overview = signal<Overview>({
    totalBalance: 11111.0,
    monthIncome: 5000.0,
    monthExpense: 3500.0,
    netMonth: 1500.0,
  });
  readonly toast = signal<string | null>(null);
  readonly syncState = signal<'ok' | 'syncing' | 'error'>('ok');

  // derived
  readonly budgetsJson = computed(() => JSON.stringify(this.budgets()));
  readonly totalBalanceLabel = computed(() => this.formatBRL(this.overview().totalBalance));
  readonly incomeLabel = computed(() => this.formatBRL(this.overview().monthIncome));
  readonly expenseLabel = computed(() => this.formatBRL(this.overview().monthExpense));
  readonly netMonthLabel = computed(() => this.formatBRL(this.overview().netMonth));
  readonly netPositive = computed(() => this.overview().netMonth >= 0);
  readonly syncLabel = computed(() => {
    const s = this.syncState();
    if (s === 'syncing') return 'Sincronizando...';
    if (s === 'error') return 'Erro na sincronização';
    return 'Atualizado';
  });

  private formatBRL(value: number): string {
    try {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    } catch {
      // Fallback simples
      return `R$ ${value.toFixed(2)}`;
    }
  }
}
