import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      <p>Bem-vindo ao OrçaSonhos!</p>
      <p>Esta é a página principal do sistema.</p>
    </div>
  `,
  styles: [
    `
      .dashboard {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }

      h1 {
        color: #333;
        margin-bottom: 16px;
      }

      p {
        color: #666;
        line-height: 1.5;
      }
    `,
  ],
})
export class DashboardPage {}
