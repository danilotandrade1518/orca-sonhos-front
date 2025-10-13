import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal, HostListener } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { BudgetDto } from '@dtos/budget';
import { BudgetSelectorComponent } from '@features/dashboard/components/budget-selector/budget-selector.component';
import { DashboardWidgetsComponent } from '@features/dashboard/components/dashboard-widgets/dashboard-widgets.component';
import { DashboardDataService } from '@features/dashboard/services/dashboard-data.service';
import { WidgetConfiguration } from '@features/dashboard/types/dashboard.types';
import {
  OsSidebarComponent,
  SidebarItem,
} from '@shared/ui-components/organisms/os-sidebar/os-sidebar.component';

@Component({
  standalone: true,
  imports: [CommonModule, BudgetSelectorComponent, DashboardWidgetsComponent, OsSidebarComponent],
  template: `
    <div class="dashboard-page">
      <!-- Skip Links for Accessibility -->
      <a href="#main-content" class="dashboard-skip-link">Pular para conteúdo principal</a>
      <a href="#budget-selector" class="dashboard-skip-link">Pular para seletor de orçamento</a>

      <!-- Sidebar -->
      <os-sidebar
        [items]="sidebarItems()"
        [variant]="'default'"
        [size]="'medium'"
        [collapsed]="sidebarCollapsed()"
        [title]="'OrçaSonhos'"
        [showHeader]="true"
        [showToggleButton]="true"
        [ariaLabel]="'Navegação principal'"
        (itemClick)="onSidebarItemClick($event)"
        (collapseChange)="onSidebarToggle($event)"
        class="dashboard-sidebar"
      />

      <!-- Main Content Area -->
      <div class="dashboard-content">
        <!-- Header with Budget Selector -->
        <header class="dashboard-header" role="banner">
          <div class="dashboard-header__container">
            <div class="dashboard-header__brand">
              <h1 class="dashboard-header__logo">OrçaSonhos</h1>
            </div>

            <div class="dashboard-header__actions">
              <os-budget-selector
                id="budget-selector"
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
        <main id="main-content" class="dashboard-main" role="main" aria-label="Dashboard principal">
          <div class="dashboard-main__container">
            <h2 class="dashboard-main__title" id="dashboard-title">Dashboard</h2>
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
    </div>
  `,
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage implements OnInit {
  private readonly budgetSelectionService = inject(BudgetSelectionService);
  private readonly dashboardDataService = inject(DashboardDataService);

  // Signals
  readonly isLoading = signal(false);
  readonly sidebarCollapsed = signal(false);

  // Computed properties
  readonly sidebarItems = computed((): SidebarItem[] => [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
    },
    {
      id: 'budgets',
      label: 'Orçamentos',
      icon: 'account_balance',
      route: '/budgets',
    },
    {
      id: 'goals',
      label: 'Metas',
      icon: 'flag',
      route: '/goals',
    },
    {
      id: 'transactions',
      label: 'Transações',
      icon: 'receipt',
      route: '/transactions',
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: 'analytics',
      route: '/reports',
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: 'settings',
      route: '/settings',
    },
  ]);

  readonly dashboardWidgets = computed((): WidgetConfiguration[] => [
    {
      id: 'budget-summary',
      type: 'budget-summary',
      title: 'Resumo do Orçamento',
      size: 'large',
      position: { row: 1, column: 1 },
      enabled: true,
    },
    {
      id: 'goal-progress',
      type: 'goal-progress',
      title: 'Progresso das Metas',
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
      // Carregar orçamentos disponíveis
      await firstValueFrom(this.dashboardDataService.loadBudgets());

      // Se houver orçamentos, selecionar o primeiro
      const budgets = this.dashboardDataService.budgets();
      if (budgets.length > 0) {
        this.budgetSelectionService.setAvailableBudgets(budgets);
        this.budgetSelectionService.setSelectedBudget(budgets[0]);

        // Carregar visão geral do orçamento selecionado
        await firstValueFrom(this.dashboardDataService.loadBudgetOverview(budgets[0].id));
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

  onSidebarItemClick(item: SidebarItem): void {
    console.log('Sidebar item clicked:', item);
    // Future: implement navigation logic
  }

  onSidebarToggle(collapsed: boolean): void {
    this.sidebarCollapsed.set(collapsed);
    console.log('Sidebar toggled:', collapsed);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Alt + B: Focus budget selector
    if (event.altKey && event.key === 'b') {
      event.preventDefault();
      const budgetSelector = document.getElementById('budget-selector');
      if (budgetSelector) {
        budgetSelector.focus();
      }
    }

    // /: Focus search (if implemented)
    if (event.key === '/' && !event.ctrlKey && !event.altKey && !event.metaKey) {
      event.preventDefault();
      // Future: implement search functionality
      console.log('Search shortcut triggered');
    }

    // Escape: Close any open modals/dropdowns
    if (event.key === 'Escape') {
      // Future: implement modal/dropdown closing
      console.log('Escape key pressed');
    }
  }
}
