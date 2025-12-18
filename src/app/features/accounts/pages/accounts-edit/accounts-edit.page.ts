import {
  Component,
  computed,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  effect,
} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
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
import type { AccountDto, AccountType } from '../../../../../dtos/account/account-types';

@Component({
  selector: 'os-accounts-edit-page',
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
    <os-page variant="default" size="medium" ariaLabel="Editar conta">
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
        </div>
        }
      </os-form-template>
    </os-page>
  `,
  styleUrl: './accounts-edit.page.scss',
})
export class AccountsEditPage implements OnInit {
  private readonly accountState = inject(AccountState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = computed(() => this.accountState.loading());

  private readonly _form = signal<FormGroup | null>(null);
  readonly form = this._form.asReadonly();

  private readonly _validationTrigger = signal(0);
  private readonly _accountId = signal<string | null>(null);

  readonly account = computed(() => {
    const id = this._accountId();
    if (!id) return null;

    const accounts = this.accountState.accounts();
    return accounts.find((a) => a.id === id) || null;
  });

  readonly pageTitle = computed(() => {
    const account = this.account();
    return account ? `Editar ${account.name}` : 'Editar Conta';
  });

  readonly pageSubtitle = computed(() => 'Atualize as informações da conta');

  readonly breadcrumbs = computed((): BreadcrumbItem[] => {
    const account = this.account();
    const base: BreadcrumbItem[] = [{ label: 'Contas', route: '/accounts' }];
    if (account) {
      base.push({ label: account.name, route: `/accounts/${account.id}` });
    }
    base.push({ label: 'Editar', route: undefined });
    return base;
  });

  readonly nameControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('name') as FormControl | null;
  });

  readonly typeControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('type') as FormControl | null;
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
    saveButtonText: 'Salvar',
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
    const accountId = this.route.snapshot.paramMap.get('id');
    if (!accountId) {
      this.notificationService.showError('ID da conta não encontrado');
      this.navigateBack();
      return;
    }

    this._accountId.set(accountId);

    if (this.accountState.accounts().length === 0) {
      this.accountState.loadAccounts();
    }

    const account = this.account();
    if (!account) {
      this.notificationService.showError('Conta não encontrada');
      this.navigateBack();
      return;
    }

    const form = new FormGroup({
      name: new FormControl(account.name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      type: new FormControl<AccountType>(account.type as AccountType, [Validators.required]),
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

    const accountId = this._accountId();
    const user = this.authService.currentUser();
    if (!accountId || !user) {
      this.notificationService.showError('Dados insuficientes para atualizar a conta');
      return;
    }

    const formValue = form.value;

    this.accountState.updateAccount({
      id: accountId,
      userId: user.id,
      name: formValue.name,
      type: formValue.type as AccountType,
    });

    this.notificationService.showSuccess('Conta atualizada com sucesso!');
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
    const accountId = this._accountId();
    if (accountId) {
      this.router.navigate(['/accounts', accountId], { replaceUrl: true });
    } else {
      this.router.navigate(['/accounts'], { replaceUrl: true });
    }
  }
}
