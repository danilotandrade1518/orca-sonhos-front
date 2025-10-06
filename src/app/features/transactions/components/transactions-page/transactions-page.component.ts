import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'os-transactions-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="transactions-page">
      <header class="page-header">
        <h1>Transações</h1>
        <p>Gerencie suas transações financeiras</p>
      </header>

      <div class="page-content">
        <p>Em breve: Lista de transações e formulário de criação</p>
      </div>
    </div>
  `,
  styles: [
    `
      .transactions-page {
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

      .page-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    `,
  ],
})
export class TransactionsPageComponent {}
