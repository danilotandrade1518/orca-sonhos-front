import {
  Component,
  input,
  output,
  computed,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountState } from '@core/services/account/account-state/account.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { OsModalTemplateComponent } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import { OsFormTemplateComponent } from '@shared/ui-components/templates/os-form-template/os-form-template.component';
import { OsFormFieldComponent } from '@shared/ui-components/molecules/os-form-field/os-form-field.component';
import {
  OsSelectComponent,
  type OsSelectOption,
} from '@shared/ui-components/atoms/os-select/os-select.component';
import { OsMoneyInputComponent } from '@shared/ui-components/atoms/os-money-input/os-money-input.component';
import type { AccountDto, AccountType } from '../../../../../dtos/account/account-types';

@Component({
  selector: 'os-account-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OsModalTemplateComponent,
    OsFormTemplateComponent,
    OsFormFieldComponent,
    OsSelectComponent,
    OsMoneyInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-modal-template
      [config]="modalConfig()"
      [variant]="'default'"
      [disabled]="loading()"
      [loading]="loading()"
      [valid]="form()?.valid ?? false"
      (confirmed)="onSubmit()"
      (cancelled)="onCancel()"
      (closed)="onCancel()"
    >
      <os-form-template [config]="formConfig()" [form]="form()" [showHeader]="false">
        @if (form()) {
        <div [formGroup]="form()!">
          <os-form-field
            label="Nome da Conta"
            [required]="true"
            [control]="nameControl()"
            [errorMessage]="getNameErrorMessage()"
          />

          <os-select
            label="Tipo de Conta"
            [options]="typeOptions()"
            formControlName="type"
            [required]="true"
            [errorMessage]="getTypeErrorMessage()"
          />

          <os-money-input
            label="Saldo Inicial"
            formControlName="initialBalance"
            [errorMessage]="getInitialBalanceErrorMessage()"
            placeholder="0,00"
            [allowNegative]="false"
          />
        </div>
        }
      </os-form-template>
    </os-modal-template>
  `,
  styleUrl: './account-form.component.scss',
})
export class AccountFormComponent implements OnInit {
  private readonly accountState = inject(AccountState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  readonly account = input<AccountDto | null>(null);
  readonly mode = input<'create' | 'edit'>('create');

  readonly saved = output<void>();
  readonly cancelled = output<void>();

  readonly loading = computed(() => this.accountState.loading());

  private readonly _form = signal<FormGroup | null>(null);
  readonly form = this._form.asReadonly();

  private readonly _validationTrigger = signal(0);

  readonly nameControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('name') as FormControl | null;
  });
  readonly typeControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('type') as FormControl | null;
  });
  readonly initialBalanceControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('initialBalance') as FormControl | null;
  });

  readonly typeOptions = computed<OsSelectOption[]>(() => [
    { value: 'CHECKING_ACCOUNT', label: 'Conta Corrente' },
    { value: 'SAVINGS_ACCOUNT', label: 'Conta Poupança' },
    { value: 'PHYSICAL_WALLET', label: 'Carteira Física' },
    { value: 'DIGITAL_WALLET', label: 'Carteira Digital' },
    { value: 'INVESTMENT_ACCOUNT', label: 'Conta Investimento' },
    { value: 'OTHER', label: 'Outros' },
  ]);

  readonly modalConfig = computed(() => ({
    title: this.mode() === 'create' ? 'Criar Conta' : 'Editar Conta',
    subtitle:
      this.mode() === 'create'
        ? 'Preencha os dados para criar uma nova conta'
        : 'Atualize as informações da conta',
    showActions: true,
    showCancelButton: true,
    showConfirmButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: this.mode() === 'create' ? 'Criar' : 'Salvar',
  }));

  readonly formConfig = computed(() => ({
    title: '',
    showHeader: false,
    showProgress: false,
    showActions: false,
  }));

  readonly getNameErrorMessage = computed(() => {
    this._validationTrigger();
    const control = this.nameControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Nome da conta é obrigatório';
    if (control.hasError('minlength')) return 'Nome deve ter pelo menos 3 caracteres';
    if (control.hasError('maxlength')) return 'Nome deve ter no máximo 100 caracteres';
    return '';
  });

  readonly getTypeErrorMessage = computed(() => {
    this._validationTrigger();
    const control = this.typeControl();
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'Tipo de conta é obrigatório';
    return '';
  });

  readonly getInitialBalanceErrorMessage = computed(() => {
    this._validationTrigger();
    const control = this.initialBalanceControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('min')) return 'Saldo inicial deve ser maior ou igual a zero';
    return '';
  });

  constructor() {
    effect(() => {
      const account = this.account();
      const form = this._form();
      if (form && account) {
        form.patchValue({
          name: account.name,
          type: account.type,
          initialBalance: account.balance || 0,
        });

        this._validationTrigger.update((v) => v + 1);
      }
    });

    effect(() => {
      const form = this._form();
      const isLoading = this.loading();
      if (form) {
        if (isLoading) {
          form.disable();
        } else {
          form.enable();
        }
      }
    });
  }

  ngOnInit(): void {
    const form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      type: new FormControl<AccountType | null>(null, [Validators.required]),
      initialBalance: new FormControl(0, [Validators.min(0)]),
    });

    const account = this.account();
    if (account) {
      form.patchValue({
        name: account.name,
        type: account.type,
        initialBalance: account.balance || 0,
      });
    }

    this._form.set(form);
  }

  onSubmit(): void {
    const form = this._form();
    if (!form || form.invalid) {
      form?.markAllAsTouched();
      return;
    }

    const user = this.authService.currentUser();
    const budgetId = this.budgetSelection.selectedBudgetId();
    if (!user || !budgetId) {
      this.notificationService.showError('Usuário ou orçamento não selecionado');
      return;
    }

    const formValue = form.value;
    const account = this.account();

    if (this.mode() === 'create') {
      this.accountState.createAccount({
        userId: user.id,
        name: formValue.name,
        type: formValue.type as AccountType,
        budgetId: budgetId,
        initialBalance: formValue.initialBalance || 0,
      });

      this.notificationService.showSuccess('Conta criada com sucesso!');
      this.saved.emit();
    } else if (account) {
      this.accountState.updateAccount({
        id: account.id,
        userId: user.id,
        name: formValue.name,
        type: formValue.type as AccountType,
      });

      this.notificationService.showSuccess('Conta atualizada com sucesso!');
      this.saved.emit();
    }

    this.router.navigate(['/accounts'], { replaceUrl: true });
  }

  onCancel(): void {
    this.cancelled.emit();
    this.router.navigate(['/accounts'], { replaceUrl: true });
  }
}
