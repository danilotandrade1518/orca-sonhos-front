import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../../../../core/services/auth/auth.service';
import { OsFormTemplateComponent, FormTemplateConfig } from '../../../../../shared/ui-components/templates/os-form-template/os-form-template.component';
import { OsFormFieldComponent } from '../../../../../shared/ui-components/molecules/os-form-field/os-form-field.component';
import { OsButtonComponent } from '../../../../../shared/ui-components/atoms/os-button/os-button.component';
import { OsAlertComponent } from '../../../../../shared/ui-components/molecules/os-alert/os-alert.component';

@Component({
  selector: 'os-complete-profile-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OsFormTemplateComponent,
    OsFormFieldComponent,
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
      [loading]="isLoading()"
      [form]="form"
    >
      @if (errorMessage()) {
      <os-alert
        type="error"
        [title]="'Erro ao atualizar perfil'"
        [role]="'alert'"
        [ariaLive]="'assertive'"
        [showIcon]="true"
        [dismissible]="true"
        (dismiss)="clearError()"
      >
        {{ errorMessage() }}
      </os-alert>
      }

      @if (successMessage()) {
      <os-alert
        type="success"
        [title]="'Perfil atualizado com sucesso!'"
        [role]="'status'"
        [ariaLive]="'polite'"
        [showIcon]="true"
        [dismissible]="false"
      >
        {{ successMessage() }}
      </os-alert>
      }

      <form [formGroup]="form" class="complete-profile-page__form" aria-label="Formulário de completar perfil">
        <os-form-field
          label="Nome completo"
          placeholder="Digite seu nome"
          [required]="true"
          [helperText]="'Mínimo 2 caracteres, máximo 100 caracteres'"
          [maxLength]="100"
          formControlName="name"
          [attr.aria-required]="true"
        />
      </form>

      <div class="complete-profile-page__actions">
        <os-button
          variant="primary"
          size="large"
          [loading]="isLoading()"
          [disabled]="isLoading() || form.invalid"
          (buttonClick)="onSubmit()"
          [attr.aria-label]="'Continuar'"
          [attr.aria-busy]="isLoading()"
        >
          Continuar
        </os-button>
      </div>
    </os-form-template>
  `,
  styleUrl: './complete-profile.page.scss',
})
export class CompleteProfilePage implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly form: FormGroup = this.fb.group({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    }),
  });

  readonly formConfig = computed<FormTemplateConfig>(() => ({
    title: 'Complete seu perfil',
    subtitle: 'Confirme seu nome para continuar',
    showBackButton: false,
    showSaveButton: false,
    showCancelButton: false,
    showProgress: false,
    showActions: false,
  }));

  ngOnInit(): void {
    const currentUser = this.authService.user();
    if (currentUser?.name) {
      this.form.patchValue({
        name: currentUser.name,
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      const name = this.form.get('name')?.value?.trim() || '';
      await this.authService.completeProfile(name);

      this.successMessage.set('Perfil atualizado com sucesso!');

      setTimeout(async () => {
        await this.router.navigate(['/dashboard']);
      }, 1500);
    } catch (error: unknown) {
      const message = error instanceof Error && error.message ? error.message : 'Erro ao atualizar perfil. Tente novamente.';
      if (message.includes('Erro ao atualizar perfil')) {
        this.errorMessage.set(message);
      } else {
        this.errorMessage.set(`Erro ao atualizar perfil: ${message}`);
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  clearError(): void {
    this.errorMessage.set(null);
  }
}
