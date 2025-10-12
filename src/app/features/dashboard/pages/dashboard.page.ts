import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { BudgetDto } from '@dtos/budget';
import { BudgetSelectorComponent } from '@features/dashboard/components/budget-selector/budget-selector.component';
import { DashboardWidgetsComponent } from '@features/dashboard/components/dashboard-widgets/dashboard-widgets.component';
import { DashboardDataService } from '@features/dashboard/services/dashboard-data.service';
import { WidgetConfiguration } from '@features/dashboard/types/dashboard.types';

@Component({
  standalone: true,
  imports: [CommonModule, BudgetSelectorComponent, DashboardWidgetsComponent],
  template: `
    <div class="dashboard-page">
      <!-- Header with Budget Selector -->
      <header class="dashboard-header">
        <div class="dashboard-header__container">
          <div class="dashboard-header__brand">
            <h1 class="dashboard-header__logo">OrçaSonhos</h1>
          </div>

          <div class="dashboard-header__actions">
            <os-budget-selector
              [variant]="'primary'"
              [size]="'medium'"
              [placeholder]="'Selecionar orçamento'"
              [showCreateButton]="true"
              [ariaLabel]="'Seletor de orçamento'"
              (budgetSelected)="onBudgetSelected($event)"
              (createBudgetRequested)="onCreateBudgetRequested()"
            />
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="dashboard-main">
        <div class="dashboard-main__container">
          <os-dashboard-widgets
            [widgets]="dashboardWidgets()"
            [variant]="'default'"
            [size]="'medium'"
            (widgetClick)="onWidgetClick($event)"
            (retryRequested)="onRetryRequested()"
          />
        </div>
      </main>
    </div>
  `,
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage implements OnInit {
  private readonly budgetSelectionService = inject(BudgetSelectionService);
  private readonly dashboardDataService = inject(DashboardDataService);

  // Signals
  readonly isLoading = signal(false);

  // Computed properties
  readonly dashboardWidgets = computed((): WidgetConfiguration[] => [
    {
      id: 'budget-summary',
      type: 'budget-summary',
      title: 'Resumo do Orçamento',
      size: 'medium',
      position: { row: 1, column: 1 },
      enabled: true,
    },
    {
      id: 'goal-progress',
      type: 'goal-progress',
      title: 'Progresso das Metas',
      size: 'small',
      position: { row: 1, column: 2 },
      enabled: true,
    },
    {
      id: 'transaction-list',
      type: 'transaction-list',
      title: 'Transações Recentes',
      size: 'large',
      position: { row: 2, column: 1 },
      enabled: true,
    },
    {
      id: 'account-balance',
      type: 'account-balance',
      title: 'Saldo das Contas',
      size: 'small',
      position: { row: 2, column: 2 },
      enabled: true,
    },
  ]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private async loadDashboardData(): Promise<void> {
    this.isLoading.set(true);

    try {
      // Carregar orçamentos disponíveis
      await this.dashboardDataService.loadBudgets().toPromise();

      // Se houver orçamentos, selecionar o primeiro
      const budgets = this.dashboardDataService.budgets();
      if (budgets.length > 0) {
        this.budgetSelectionService.setAvailableBudgets(budgets);
        this.budgetSelectionService.setSelectedBudget(budgets[0]);

        // Carregar visão geral do orçamento selecionado
        await this.dashboardDataService.loadBudgetOverview(budgets[0].id).toPromise();
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  onBudgetSelected(budget: BudgetDto): void {
    console.log('Orçamento selecionado:', budget);
    // O BudgetSelectionService já foi atualizado pelo componente
    // Recarregar dados do dashboard para o novo orçamento
    this.loadDashboardData();
  }

  onCreateBudgetRequested(): void {
    console.log('Criar novo orçamento solicitado');
    // Implementar navegação para criação de orçamento
  }

  onWidgetClick(event: { widget: WidgetConfiguration; data: unknown }): void {
    console.log('Widget clicado:', event);
  }

  onRetryRequested(): void {
    console.log('Tentar novamente solicitado');
    this.loadDashboardData();
  }
}
