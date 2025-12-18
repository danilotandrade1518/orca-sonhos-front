import {
  Component,
  computed,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  effect,
} from '@angular/core';

import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountState } from '@core/services/account/account-state/account.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import {
  OsPageHeaderComponent,
  type BreadcrumbItem,
} from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import { OsFormTemplateComponent } from '@shared/ui-components/templates/os-form-template/os-form-template.component';
import { OsFormFieldComponent } from '@shared/ui-components/molecules/os-form-field/os-form-field.component';
import {
  OsSelectComponent,
  type OsSelectOption,
} from '@shared/ui-components/atoms/os-select/os-select.component';
import { OsMoneyInputComponent } from '@shared/ui-components/atoms/os-money-input/os-money-input.component';
import type { AccountType } from '../../../../../dtos/account/account-types';

@Component({
  selector: 'os-accounts-create-page',
  imports: [
    ReactiveFormsModule,
    OsPageComponent,
    OsPageHeaderComponent,
    OsFormTemplateComponent,
    OsFormFieldComponent,
    OsSelectComponent,
    OsMoneyInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Criar nova conta">
      <os-page-header
        [title]="pageTitle()"
        [subtitle]="pageSubtitle()"
        [breadcrumbs]="breadcrumbs()"
        (breadcrumbClick)="onBreadcrumbClick($event)"
      />

      <os-form-template
        [config]="formConfig()"
        [form]="form()"
        [loading]="loading()"
        [disabled]="loading()"
        (save)="onSave()"
        (cancelClick)="onCancel()"
      >
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
            placeholder="Selecione o tipo"
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
    </os-page>
  `,
  styleUrl: './accounts-create.page.scss',
})
export class AccountsCreatePage implements OnInit {
  private readonly accountState = inject(AccountState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly loading = computed(() => this.accountState.loading());

  private readonly _form = signal<FormGroup | null>(null);
  readonly form = this._form.asReadonly();

  private readonly _validationTrigger = signal(0);

  readonly pageTitle = computed(() => 'Criar Conta');

  readonly pageSubtitle = computed(() => 'Preencha os dados para criar uma nova conta');

  readonly breadcrumbs = computed((): BreadcrumbItem[] => {
    return [
      { label: 'Contas', route: '/accounts' },
      { label: 'Nova', route: undefined },
    ];
  });

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

  readonly formConfig = computed(() => ({
    title: '',
    showHeader: false,
    showProgress: false,
    showActions: true,
    showSaveButton: true,
    showCancelButton: true,
    saveButtonText: 'Criar',
    cancelButtonText: 'Cancelar',
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

    this._form.set(form);
  }

  onSave(): void {
    const form = this._form();
    if (!form || form.invalid) {
      form?.markAllAsTouched();
      this._validationTrigger.update((v) => v + 1);
      return;
    }

    const user = this.authService.currentUser();
    const budgetId = this.budgetSelection.selectedBudgetId();
    if (!user || !budgetId) {
      this.notificationService.showError('Usuário ou orçamento não selecionado');
      return;
    }

    const formValue = form.value;
    const initialBalanceInCents = Math.round((formValue.initialBalance || 0) * 100);

    this.accountState.createAccount({
      userId: user.id,
      name: formValue.name,
      type: formValue.type as AccountType,
      budgetId: budgetId,
      initialBalance: initialBalanceInCents,
    });

    this.notificationService.showSuccess('Conta criada com sucesso!');
    this.navigateBack();
  }

  onCancel(): void {
    this.navigateBack();
  }

  onBreadcrumbClick(breadcrumb: BreadcrumbItem): void {
    if (breadcrumb.route) {
      this.router.navigate([breadcrumb.route]);
    }
  }

  private navigateBack(): void {
    this.router.navigate(['/accounts'], { replaceUrl: true });
  }
}
