import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'os-onboarding-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="onboarding-page">
      <header class="page-header">
        <h1>Bem-vindo ao Orça Sonhos!</h1>
        <p>Vamos configurar sua conta</p>
      </header>

      <div class="page-content">
        <p>Em breve: Fluxo de onboarding para novos usuários</p>
      </div>
    </div>
  `,
  styles: [
    `
      .onboarding-page {
        max-width: 800px;
        margin: 0 auto;
      }

      .page-header {
        margin-bottom: 2rem;
        text-align: center;
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
export class OnboardingPageComponent {}
