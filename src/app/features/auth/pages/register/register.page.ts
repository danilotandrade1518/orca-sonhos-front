import { Component, inject, signal, computed, ChangeDetectionStrategy, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../../core/services/auth/auth.service';
import { OsFormTemplateComponent, FormTemplateConfig } from '../../../../shared/ui-components/templates/os-form-template/os-form-template.component';
import { OsButtonComponent } from '../../../../shared/ui-components/atoms/os-button/os-button.component';
import { OsAlertComponent } from '../../../../shared/ui-components/molecules/os-alert/os-alert.component';

@Component({
  selector: 'os-register-page',
  imports: [
    CommonModule,
    RouterModule,
    OsFormTemplateComponent,
    OsButtonComponent,
    OsAlertComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-form-template
      [config]="formConfig()"
      [size]="'small'"
      [variant]="'compact'"
      [showHeader]="true"
      [showActions]="false"
      [disabled]="isLoading()"
      [loading]="isProcessingRedirect()"
    >
      @if (errorMessage()) {
      <os-alert
        type="error"
        [title]="'Erro ao autenticar'"
        [role]="'alert'"
        [ariaLive]="'assertive'"
        [showIcon]="true"
        [dismissible]="true"
        (dismiss)="clearError()"
      >
        {{ errorMessage() }}
      </os-alert>
      }

      <div class="register-page__content">
        <os-button
          variant="primary"
          size="large"
          [loading]="isLoading()"
          [disabled]="isLoading() || isProcessingRedirect()"
          (buttonClick)="onSignInWithGoogle()"
          [attr.aria-label]="'Entrar com Google'"
          [attr.aria-busy]="isLoading()"
          [class]="'register-page__google-button'"
        >
          <span class="register-page__google-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
              />
              <path
                fill="#FBBC05"
                d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.96H.957C.348 6.175 0 7.55 0 9s.348 2.825.957 4.04l3.007-2.333z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.96L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
              />
            </svg>
          </span>
          <span class="register-page__button-text">Entrar com Google</span>
        </os-button>

        <div class="register-page__login-link">
          <a routerLink="/login" [attr.aria-label]="'Já tem conta? Faça login'">
            Já tem conta? Faça login
          </a>
        </div>
      </div>
    </os-form-template>
  `,
  styleUrl: './register.page.scss',
})
export class RegisterPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly isProcessingRedirect = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly formConfig = computed<FormTemplateConfig>(() => ({
    title: 'Bem-vindo ao OrçaSonhos',
    subtitle: 'Transforme seus sonhos em metas alcançáveis',
    showBackButton: false,
    showSaveButton: false,
    showCancelButton: false,
    showProgress: false,
    showActions: false,
  }));

  constructor() {
    afterNextRender(() => {
      this.handleRedirectResult();
    });
  }

  async onSignInWithGoogle(): Promise<void> {
    try {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      await this.authService.signInWithGoogle();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao autenticar com Google. Tente novamente.';
      this.errorMessage.set(message);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async handleRedirectResult(): Promise<void> {
    try {
      this.isProcessingRedirect.set(true);
      const result = await this.authService.handleRedirectResult();

      if (!result) {
        this.isProcessingRedirect.set(false);
        return;
      }

      if (result.isFirstAccess) {
        await this.router.navigate(['/register/complete-profile']);
      } else {
        await this.router.navigate(['/dashboard']);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao processar autenticação. Tente novamente.';
      this.errorMessage.set(message);
      this.isProcessingRedirect.set(false);
    }
  }

  clearError(): void {
    this.errorMessage.set(null);
  }
}

