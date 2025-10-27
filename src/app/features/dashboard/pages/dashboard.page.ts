import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { BudgetDto } from '@dtos/budget';
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

  // Signals
  readonly isLoading = signal(false);
  readonly currentPersona = signal<'ana' | 'carlos' | 'roberto-maria' | 'julia'>('ana');

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

  onWidgetClick(widget: WidgetConfiguration): void {
    console.log('Widget clicado:', widget);
  }

  onRetryRequested(): void {
    this.loadDashboardData();
  }

  // Persona management methods
  setPersona(persona: 'ana' | 'carlos' | 'roberto-maria' | 'julia'): void {
    this.currentPersona.set(persona);
  }

  getPersonaDescription(): string {
    const persona = this.currentPersona();
    const descriptions = {
      ana: 'Organizadora Familiar - Interface intuitiva para compartilhamento',
      carlos: 'Jovem Planejador - Onboarding educativo e simplicidade',
      'roberto-maria': 'Casal Experiente - Múltiplas metas e relatórios avançados',
      julia: 'Empreendedora Iniciante - Flexibilidade para renda variável',
    };
    return descriptions[persona];
  }
}
