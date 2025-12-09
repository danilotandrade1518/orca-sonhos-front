import {
  Component,
  input,
  output,
  computed,
  inject,
  ChangeDetectionStrategy,
  effect,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { OsFormGroupComponent } from '../os-form-group/os-form-group.component';
import { OsSelectComponent, type OsSelectOption } from '../../atoms/os-select/os-select.component';
import { OsMoneyInputComponent } from '../../atoms/os-money-input/os-money-input.component';
import { OsButtonComponent } from '../../atoms/os-button/os-button.component';
import { LocaleService } from '@shared/formatting';
import type { AccountDto } from '../../../../../dtos/account';

export interface TransferFormData {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
}

@Component({
  selector: 'os-transfer-form',
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
      class="os-transfer-form"
      role="form"
      aria-label="Formulário de transferência entre contas"
      (ngSubmit)="onSubmit($event)"
    >
      <os-form-group [invalid]="form.invalid && form.touched">
        <div class="os-transfer-form__fields">
          <os-select
            label="Conta Origem"
            [options]="fromAccountOptions()"
            formControlName="fromAccountId"
            [required]="true"
            [errorMessage]="getFromAccountErrorMessage()"
            [helperText]="getFromAccountHelperText()"
          />

          <os-select
            label="Conta Destino"
            [options]="toAccountOptions()"
            formControlName="toAccountId"
            [required]="true"
            [errorMessage]="getToAccountErrorMessage()"
          />

          <os-money-input
            label="Valor"
            formControlName="amount"
            [required]="true"
            [errorMessage]="getAmountErrorMessage()"
            placeholder="0,00"
          />
        </div>
      </os-form-group>

      <div class="os-transfer-form__actions">
        <os-button type="submit" variant="primary" [disabled]="form.invalid || disabled()">
          Transferir
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
  styleUrl: './transfer-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly localeService = inject(LocaleService);
  
  private readonly fromAccountIdSig = signal<string | null>(null);

  readonly accounts = input.required<AccountDto[]>();
  readonly selectedBudgetId = input<string | null>(null);
  readonly disabled = input<boolean>(false);

  readonly transferSubmit = output<TransferFormData>();
  readonly cancelled = output<void>();

  private sameBudgetValidator = (control: AbstractControl): ValidationErrors | null => {
    const fromAccountId = control.get('fromAccountId')?.value;
    const toAccountId = control.get('toAccountId')?.value;

    if (!fromAccountId || !toAccountId) {
      return null;
    }

    const fromAccount = this.accounts().find((a) => a.id === fromAccountId);
    const toAccount = this.accounts().find((a) => a.id === toAccountId);

    if (!fromAccount || !toAccount) {
      return null;
    }

    const budgetId = this.selectedBudgetId();
    if (!budgetId) {
      return { sameBudget: true };
    }

    return null;
  };

  private differentAccountsValidator = (control: AbstractControl): ValidationErrors | null => {
    const fromAccountId = control.get('fromAccountId')?.value;
    const toAccountId = control.get('toAccountId')?.value;

    if (!fromAccountId || !toAccountId) {
      return null;
    }

    if (fromAccountId === toAccountId) {
      return { sameAccount: true };
    }

    return null;
  };

  private sufficientBalanceValidator = (control: AbstractControl): ValidationErrors | null => {
    const fromAccountId = control.get('fromAccountId')?.value;
    const amount = control.get('amount')?.value;

    if (!fromAccountId || !amount || amount <= 0) {
      return null;
    }

    const fromAccount = this.accounts().find((a) => a.id === fromAccountId);
    if (!fromAccount) {
      return null;
    }
    
    const amountInCents = Math.round(amount * 100);
    if (fromAccount.balance < amountInCents) {
      return { insufficientBalance: true };
    }

    return null;
  };

  readonly form: FormGroup = this.fb.group(
    {
      fromAccountId: ['', [Validators.required]],
      toAccountId: ['', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
    },
    {
      validators: [
        this.sameBudgetValidator,
        this.differentAccountsValidator,
        this.sufficientBalanceValidator,
      ],
    }
  );

  readonly fromAccountOptions = computed<OsSelectOption[]>(() => {
    return this.accounts().map((account) => ({
      value: account.id,
      label: `${account.name} (Saldo: ${this.formatCurrency(account.balance / 100)})`,
      disabled: account.balance <= 0,
    }));
  });

  readonly toAccountOptions = computed<OsSelectOption[]>(() => {
    const fromAccountId = this.fromAccountIdSig();
    return this.accounts()
      .filter((account) => account.id !== fromAccountId)
      .map((account) => ({
        value: account.id,
        label: account.name,
      }));
  });

  getFromAccountErrorMessage(): string {
    const control = this.form.get('fromAccountId');
    if (!control || !control.touched) return '';

    if (control.hasError('required')) {
      return 'Conta origem é obrigatória';
    }

    if (this.form.hasError('sameBudget')) {
      return 'Contas devem pertencer ao mesmo orçamento';
    }

    return '';
  }

  getFromAccountHelperText(): string {
    const control = this.form.get('fromAccountId');
    if (!control || !control.value) return '';

    const account = this.accounts().find((a) => a.id === control.value);
    if (account && account.balance <= 0) {
      return 'Esta conta não possui saldo disponível';
    }

    return account ? `Saldo disponível: ${this.formatCurrency(account.balance / 100)}` : '';
  }

  getToAccountErrorMessage(): string {
    const control = this.form.get('toAccountId');
    if (!control || !control.touched) return '';

    if (control.hasError('required')) {
      return 'Conta destino é obrigatória';
    }

    if (this.form.hasError('sameAccount')) {
      return 'Conta destino deve ser diferente da conta origem';
    }

    if (this.form.hasError('sameBudget')) {
      return 'Contas devem pertencer ao mesmo orçamento';
    }

    return '';
  }

  getAmountErrorMessage(): string {
    const control = this.form.get('amount');
    if (!control || !control.touched) return '';

    if (control.hasError('required')) {
      return 'Valor é obrigatório';
    }

    if (control.hasError('min')) {
      return 'Valor deve ser maior que zero';
    }

    if (this.form.hasError('insufficientBalance')) {
      return 'Saldo insuficiente na conta origem';
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
    const amountInCents = Math.round(formValue.amount * 100);
    this.transferSubmit.emit({
      fromAccountId: formValue.fromAccountId,
      toAccountId: formValue.toAccountId,
      amount: amountInCents,
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  constructor() {
    effect((onCleanup) => {
      const fromAccountId = this.form.get('fromAccountId')?.value;
      
      this.fromAccountIdSig.set(fromAccountId ?? null);

      const sub = this.form.get('fromAccountId')?.valueChanges.subscribe((value) => {
        this.fromAccountIdSig.set(value ?? null);
      });

      if (sub) {
        onCleanup(() => sub.unsubscribe());
      }

      if (fromAccountId) {
        this.form.get('toAccountId')?.updateValueAndValidity();
        this.form.get('amount')?.updateValueAndValidity();
      }
    });

    effect(() => {
      const isDisabled = this.disabled();
      if (isDisabled) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    });
  }

  private formatCurrency(value: number): string {
    return this.localeService.formatCurrency(value, 'BRL');
  }
}
