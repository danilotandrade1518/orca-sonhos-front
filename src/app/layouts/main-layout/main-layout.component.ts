import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';

@Component({
  selector: 'os-main-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="main-layout">
      <header class="main-layout__header">
        <div class="header__logo">
          <h1>Orça Sonhos</h1>
        </div>

        <nav class="header__nav">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/budgets" routerLinkActive="active">Orçamentos</a>
          <a routerLink="/transactions" routerLinkActive="active">Transações</a>
          <a routerLink="/goals" routerLinkActive="active">Metas</a>
          <a routerLink="/accounts" routerLinkActive="active">Contas</a>
          <a routerLink="/credit-cards" routerLinkActive="active">Cartões</a>
          <a routerLink="/reports" routerLinkActive="active">Relatórios</a>
        </nav>

        <div class="header__user">
          @if (user(); as currentUser) {
          <span>{{ currentUser.email }}</span>
          <button type="button" (click)="logout()">Sair</button>
          }
        </div>
      </header>

      <main class="main-layout__content">
        <router-outlet />
      </main>

      <footer class="main-layout__footer">
        <p>&copy; 2025 Orça Sonhos - Transforme seus sonhos em realidade</p>
      </footer>
    </div>
  `,
  styles: [
    `
      .main-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .main-layout__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background-color: #1976d2;
        color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .header__logo h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
      }

      .header__nav {
        display: flex;
        gap: 1.5rem;
      }

      .header__nav a {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .header__nav a:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .header__nav a.active {
        background-color: rgba(255, 255, 255, 0.2);
        font-weight: 600;
      }

      .header__user {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .header__user button {
        background: none;
        border: 1px solid white;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .header__user button:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .main-layout__content {
        flex: 1;
        padding: 2rem;
        background-color: #f5f5f5;
      }

      .main-layout__footer {
        padding: 1rem 2rem;
        text-align: center;
        background-color: #333;
        color: white;
      }

      .main-layout__footer p {
        margin: 0;
        font-size: 0.875rem;
      }
    `,
  ],
})
export class MainLayoutComponent {
  private readonly authService = inject(AuthService);

  readonly user = this.authService.currentUser;

  logout(): void {
    this.authService.logout();
  }
}
