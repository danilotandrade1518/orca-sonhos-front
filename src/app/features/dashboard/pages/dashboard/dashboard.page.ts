import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { DashboardWidgetsComponent } from '@features/dashboard/components/dashboard-widgets/dashboard-widgets.component';
import { DashboardDataService } from '@features/dashboard/services/dashboard-data.service';
import { WidgetConfiguration } from '@features/dashboard/types/dashboard.types';

@Component({
  standalone: true,
  imports: [CommonModule, DashboardWidgetsComponent],
  template: `
    <div class="dashboard-page">
      <!-- Page Header -->
      <div class="dashboard-page__header">
        <h1 class="dashboard-page__title">Dashboard</h1>
        <p class="dashboard-page__subtitle">Visão geral do seu orçamento e metas</p>
      </div>

      <!-- Main Content -->
      <main class="dashboard-page__main" role="main" aria-label="Dashboard principal">
        <div class="dashboard-page__container">
          <os-dashboard-widgets-container
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
  private readonly router = inject(Router);

  readonly isLoading = signal(false);

  readonly dashboardWidgets = computed((): WidgetConfiguration[] => [
    {
      id: 'goal-progress',
      type: 'goal-progress',
      title: 'Progresso das Metas',
      size: 'large',
      position: { row: 1, column: 1 },
      enabled: true,
    },
    {
      id: 'budget-summary',
      type: 'budget-summary',
      title: 'Resumo do Orçamento',
      size: 'large',
      position: { row: 2, column: 1 },
      enabled: true,
    },
    {
      id: 'transaction-list',
      type: 'transaction-list',
      title: 'Transações Recentes',
      size: 'large',
      position: { row: 3, column: 1 },
      enabled: true,
    },
    {
      id: 'account-balance',
      type: 'account-balance',
      title: 'Saldo das Contas',
      size: 'large',
      position: { row: 4, column: 1 },
      enabled: true,
    },
  ]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private async loadDashboardData(): Promise<void> {
    this.isLoading.set(true);

    try {
      await firstValueFrom(this.dashboardDataService.loadBudgets());

      const budgets = this.dashboardDataService.budgets();
      if (budgets.length > 0) {
        this.budgetSelectionService.setAvailableBudgets(budgets);
        this.budgetSelectionService.setSelectedBudget(budgets[0]);

        const budgetId = budgets[0].id;
        await Promise.all([
          firstValueFrom(this.dashboardDataService.loadBudgetOverview(budgetId)),
          firstValueFrom(this.dashboardDataService.loadGoals(budgetId)),
        ]);
        // O carregamento de contas é gerenciado automaticamente pelo componente filho
        // através do effect quando o budgetId é definido acima
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  onWidgetClick(widget: WidgetConfiguration): void {
    if (widget.type === 'goal-progress') {
      this.router.navigate(['/goals']);
    } else if (widget.type === 'budget-summary') {
      const selectedBudgetId = this.budgetSelectionService.selectedBudgetId();
      if (selectedBudgetId) {
        this.router.navigate(['/budgets', selectedBudgetId]);
      }
    } else if (widget.type === 'transaction-list') {
      const selectedBudgetId = this.budgetSelectionService.selectedBudgetId();
      if (selectedBudgetId) {
        this.router.navigate(['/transactions'], { queryParams: { budgetId: selectedBudgetId } });
      } else {
        this.router.navigate(['/transactions']);
      }
    } else if (widget.type === 'account-balance') {
      this.router.navigate(['/accounts']);
    }
  }

  onRetryRequested(): void {
    this.loadDashboardData();
  }
}
