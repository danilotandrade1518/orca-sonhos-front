import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'os-auth-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="auth-layout">
      <div class="auth-layout__container">
        <header class="auth-layout__header">
          <h1 class="auth-layout__logo">Orça Sonhos</h1>
          <p class="auth-layout__tagline">Transforme seus sonhos em realidade</p>
        </header>

        <main class="auth-layout__content">
          <router-outlet />
        </main>

        <footer class="auth-layout__footer">
          <p>&copy; 2025 Orça Sonhos. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-layout {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
      }

      .auth-layout__container {
        width: 100%;
        max-width: 450px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        overflow: hidden;
      }

      .auth-layout__header {
        background-color: #1976d2;
        color: white;
        padding: 2rem;
        text-align: center;
      }

      .auth-layout__logo {
        margin: 0 0 0.5rem 0;
        font-size: 2rem;
        font-weight: 700;
      }

      .auth-layout__tagline {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.9;
      }

      .auth-layout__content {
        padding: 2rem;
      }

      .auth-layout__footer {
        padding: 1rem 2rem;
        text-align: center;
        background-color: #f5f5f5;
        border-top: 1px solid #e0e0e0;
      }

      .auth-layout__footer p {
        margin: 0;
        font-size: 0.75rem;
        color: #666;
      }
    `,
  ],
})
export class AuthLayoutComponent {}
