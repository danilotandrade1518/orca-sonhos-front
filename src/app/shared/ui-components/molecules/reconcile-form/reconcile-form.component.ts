import {
  Component,
  input,
  output,
  computed,
  inject,
  ChangeDetectionStrategy,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { OsFormGroupComponent } from '../os-form-group/os-form-group.component';
import { OsSelectComponent } from '../../atoms/os-select/os-select.component';
import { OsMoneyInputComponent } from '../../atoms/os-money-input/os-money-input.component';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { LocaleService } from '@shared/formatting';
import type { AccountDto } from '../../../../../dtos/account';

export interface ReconcileFormData {
  accountId: string;
  realBalance: number;
}

@Component({
  selector: 'os-reconcile-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OsFormGroupComponent,
    OsSelectComponent,
    OsMoneyInputComponent,
    OsButtonComponent,
  ],
  template: `
    <form
      [formGroup]="form"
      class="os-reconcile-form"
      role="form"
      aria-label="Formulário de reconciliação de saldo"
      (ngSubmit)="onSubmit($event)"
    >
      <os-form-group [invalid]="form.invalid && form.touched">
        <div class="os-reconcile-form__fields">
          <os-select
            label="Conta"
            [options]="accountOptions()"
            formControlName="accountId"
            [required]="true"
          />

          <os-money-input
            label="Valor Final Esperado"
            formControlName="realBalance"
            [required]="true"
            [errorMessage]="getRealBalanceErrorMessage()"
            placeholder="0,00"
          />
        </div>

        <div class="os-reconcile-form__helper" role="note" aria-live="polite">
          <p>
            O sistema calculará automaticamente a diferença entre o saldo atual e o valor final
            esperado, e criará uma transação de ajuste correspondente.
          </p>
          @if (account()) {
          <p><strong>Saldo atual:</strong> {{ getFormattedBalance() }}</p>
          }
        </div>
      </os-form-group>

      <div class="os-reconcile-form__actions">
        <os-button type="submit" variant="primary" [disabled]="form.invalid || disabled()">
          Reconciliar
        </os-button>
        <os-button
          type="button"
          variant="secondary"
          [disabled]="disabled()"
          (buttonClick)="onCancel()"
        >
          Cancelar
        </os-button>
      </div>
    </form>
  `,
  styleUrl: './reconcile-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReconcileFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly localeService = inject(LocaleService);

  readonly account = input.required<AccountDto>();
  readonly disabled = input<boolean>(false);

  readonly reconcileSubmit = output<ReconcileFormData>();
  readonly cancelled = output<void>();

  readonly form: FormGroup = this.fb.group({
    accountId: [{ value: '', disabled: true }, [Validators.required]],
    realBalance: [0, [Validators.required, Validators.min(0)]],
  });

  readonly accountOptions = computed(() => {
    const account = this.account();
    if (!account) {
      return [];
    }
    return [
      {
        value: account.id,
        label: `${account.name} (${this.formatCurrency(account.balance / 100)})`,
      },
    ];
  });

  constructor() {
    effect(() => {
      const account = this.account();
      if (account) {
        this.form.patchValue({
          accountId: account.id,
        });
      }
    });

    effect(() => {
      const isDisabled = this.disabled();
      const realBalanceControl = this.form.get('realBalance');
      if (realBalanceControl) {
        if (isDisabled) {
          realBalanceControl.disable();
        } else {
          realBalanceControl.enable();
        }
      }
    });
  }

  getRealBalanceErrorMessage(): string {
    const control = this.form.get('realBalance');
    if (!control || !control.touched) return '';

    if (control.hasError('required')) {
      return 'Valor final esperado é obrigatório';
    }

    if (control.hasError('min')) {
      return 'Valor deve ser maior ou igual a zero';
    }

    return '';
  }

  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    this.reconcileSubmit.emit({
      accountId: formValue.accountId || this.account().id,
      realBalance: formValue.realBalance,
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  getFormattedBalance(): string {
    const account = this.account();
    if (!account) return '';
    return this.localeService.formatCurrency(account.balance / 100, 'BRL');
  }

  private formatCurrency(value: number): string {
    return this.localeService.formatCurrency(value, 'BRL');
  }
}
