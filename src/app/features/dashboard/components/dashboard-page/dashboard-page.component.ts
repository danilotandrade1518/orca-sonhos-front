import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'os-dashboard-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">
      <header class="page-header">
        <h1>Dashboard</h1>
        <p>Visão geral das suas finanças</p>
      </header>

      <div class="dashboard-content">
        <section class="dashboard-section">
          <h2>Resumo Financeiro</h2>
          <p>Em breve: Saldo atual, receitas e despesas do mês</p>
        </section>

        <section class="dashboard-section">
          <h2>Metas em Progresso</h2>
          <p>Em breve: Progresso das suas metas financeiras</p>
        </section>

        <section class="dashboard-section">
          <h2>Transações Recentes</h2>
          <p>Em breve: Últimas transações registradas</p>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-page {
        max-width: 1200px;
        margin: 0 auto;
      }

      .page-header {
        margin-bottom: 2rem;
      }

      .page-header h1 {
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
        color: #333;
      }

      .page-header p {
        margin: 0;
        color: #666;
      }

      .dashboard-content {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      }

      .dashboard-section {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .dashboard-section h2 {
        margin: 0 0 1rem 0;
        font-size: 1.25rem;
        color: #333;
      }

      .dashboard-section p {
        margin: 0;
        color: #666;
      }
    `,
  ],
})
export class DashboardPageComponent {}
