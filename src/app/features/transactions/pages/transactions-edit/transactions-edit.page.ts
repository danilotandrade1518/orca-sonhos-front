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
import { lastValueFrom } from 'rxjs';
import { TransactionsApiService } from '../../services/transactions-api.service';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { AccountState } from '@core/services/account/account-state/account.state';
import { CreditCardState } from '@core/services/credit-card/credit-card-state/credit-card.state';
import { CategoryState } from '@core/services/category/category.state';
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import {
  OsPageHeaderComponent,
  type BreadcrumbItem,
} from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import { OsFormTemplateComponent } from '@shared/ui-components/templates/os-form-template/os-form-template.component';
import { OsFormFieldComponent } from '@shared/ui-components/molecules/os-form-field/os-form-field.component';
import { OsDropdownComponent } from '@shared/ui-components/molecules/os-dropdown/os-dropdown.component';
import { OsDatePickerComponent } from '@shared/ui-components/molecules/os-date-picker/os-date-picker.component';
import type { OsDropdownOption } from '@shared/ui-components/molecules/os-dropdown/os-dropdown.component';
import type {
  TransactionDto,
  TransactionType,
} from '../../../../../dtos/transaction/transaction-types';

@Component({
  selector: 'os-transactions-edit-page',
  imports: [
    ReactiveFormsModule,
    OsPageComponent,
    OsPageHeaderComponent,
    OsFormTemplateComponent,
    OsFormFieldComponent,
    OsDropdownComponent,
    OsDatePickerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Editar transação">
      <os-page-header
        [title]="pageTitle()"
        [subtitle]="pageSubtitle()"
        [breadcrumbs]="breadcrumbs()"
        (breadcrumbClick)="onBreadcrumbClick($event)"
      />

      <os-form-template
        [config]="formConfig()"
        [isInvalid]="isFormInvalid()"
        [saveButtonDisabled]="isSaveDisabled()"
        [loading]="loading()"
        [disabled]="loading()"
        (save)="onSave()"
        (cancelClick)="onCancel()"
      >
        @if (form()) {
        <div [formGroup]="form()!" class="transaction-form__fields">
          <os-form-field
            label="Descrição"
            [required]="true"
            [control]="descriptionControl()"
            [errorMessage]="getDescriptionErrorMessage()"
            placeholder="Ex: Compra no supermercado"
          />

          <os-form-field
            label="Valor"
            [required]="true"
            type="number"
            [control]="amountControl()"
            [errorMessage]="getAmountErrorMessage()"
            placeholder="0,00"
            [prefixIcon]="'attach_money'"
          />

          <div class="transaction-form__type-field">
            <os-form-field
              label="Tipo"
              [required]="true"
              [control]="typeControl()"
              [errorMessage]="getTypeErrorMessage()"
            />
          </div>
          <os-dropdown
            [options]="typeOptions()"
            [selectedValue]="typeControl()?.value ?? 'EXPENSE'"
            (valueChange)="onTypeChange($event)"
            size="medium"
            variant="default"
            placeholder="Selecione o tipo"
            ariaLabel="Tipo de transação"
          />

          <div class="transaction-form__account-field">
            <os-form-field
              label="Conta"
              [required]="true"
              [control]="accountIdControl()"
              [errorMessage]="getAccountIdErrorMessage()"
            />
          </div>
          <os-dropdown
            [options]="accountOptions()"
            [selectedValue]="accountIdControl()?.value ?? ''"
            [disabled]="accountOptions().length === 0"
            (valueChange)="onAccountChange($event)"
            size="medium"
            variant="default"
            placeholder="Selecione a conta"
            ariaLabel="Conta"
          />
          @if (accountOptions().length === 0) {
          <p class="transaction-form__helper-text">
            Nenhuma conta disponível. Configure contas primeiro.
          </p>
          }

          <div class="transaction-form__category-field">
            <os-form-field
              label="Categoria"
              [required]="true"
              [control]="categoryIdControl()"
              [errorMessage]="getCategoryIdErrorMessage()"
            />
          </div>
          <os-dropdown
            [options]="categoryOptions()"
            [selectedValue]="categoryIdControl()?.value ?? ''"
            [disabled]="categoryOptions().length === 0"
            (valueChange)="onCategoryChange($event)"
            size="medium"
            variant="default"
            placeholder="Selecione a categoria"
            ariaLabel="Categoria"
          />
          @if (categoryOptions().length === 0) {
          <p class="transaction-form__helper-text">
            Nenhuma categoria disponível. Configure categorias primeiro.
          </p>
          }

          <div class="transaction-form__date-field">
            <os-date-picker
              [label]="'Data da Transação'"
              [placeholder]="'Selecione a data'"
              [value]="transactionDateValue()"
              [required]="false"
              (valueChange)="onDateChange($event)"
            />
          </div>

          <div class="transaction-form__payment-method-field">
            <os-form-field
              label="Forma de Pagamento"
              [required]="false"
              [control]="creditCardIdControl()"
              [errorMessage]="getCreditCardIdErrorMessage()"
            />
          </div>
          <os-dropdown
            [options]="creditCardOptions()"
            [selectedValue]="creditCardIdControl()?.value ?? ''"
            [disabled]="creditCardOptions().length === 0"
            (valueChange)="onCreditCardChange($event)"
            size="medium"
            variant="default"
            placeholder="Selecione a forma de pagamento"
            ariaLabel="Forma de pagamento"
          />
        </div>
        }
      </os-form-template>
    </os-page>
  `,
  styles: [
    `
      .transaction-form__fields {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .transaction-form__type-field,
      .transaction-form__account-field,
      .transaction-form__category-field,
      .transaction-form__date-field,
      .transaction-form__payment-method-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .transaction-form__helper-text {
        font-size: 12px;
        color: var(--os-color-text-secondary);
        margin-top: -8px;
        margin-bottom: 0;
      }
    `,
  ],
})
export class TransactionsEditPage implements OnInit {
  private readonly api = inject(TransactionsApiService);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly accountState = inject(AccountState);
  private readonly creditCardState = inject(CreditCardState);
  private readonly categoryState = inject(CategoryState);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();

  private readonly _form = signal<FormGroup | null>(null);
  readonly form = this._form.asReadonly();

  private readonly _formValidityTick = signal(0);

  readonly isFormInvalid = computed(() => {
    this._formValidityTick();
    const form = this._form();
    return form ? form.invalid : true;
  });

  readonly isSaveDisabled = computed(() => {
    return this.loading() || this.isFormInvalid();
  });

  private readonly _transactionId = signal<string | null>(null);
  private readonly _transaction = signal<TransactionDto | null>(null);

  readonly transaction = this._transaction.asReadonly();

  readonly pageTitle = computed(() => {
    const transaction = this._transaction();
    return transaction ? `Editar ${transaction.description}` : 'Editar Transação';
  });

  readonly pageSubtitle = computed(() => 'Atualize as informações da transação');

  readonly breadcrumbs = computed((): BreadcrumbItem[] => {
    const transaction = this._transaction();
    const base: BreadcrumbItem[] = [{ label: 'Transações', route: '/transactions' }];
    if (transaction) {
      base.push({
        label: transaction.description,
        route: `/transactions`,
      });
    }
    base.push({ label: 'Editar', route: undefined });
    return base;
  });

  readonly descriptionControl = computed(() => {
    return this._form()?.get('description') as FormControl | null;
  });

  readonly amountControl = computed(() => {
    return this._form()?.get('amount') as FormControl | null;
  });

  readonly typeControl = computed(() => {
    return this._form()?.get('type') as FormControl | null;
  });

  readonly accountIdControl = computed(() => {
    return this._form()?.get('accountId') as FormControl | null;
  });

  readonly categoryIdControl = computed(() => {
    return this._form()?.get('categoryId') as FormControl | null;
  });

  readonly transactionDateControl = computed(() => {
    return this._form()?.get('transactionDate') as FormControl | null;
  });

  readonly creditCardIdControl = computed(() => {
    return this._form()?.get('creditCardId') as FormControl | null;
  });

  readonly transactionDateValue = computed(() => {
    const control = this.transactionDateControl();
    if (!control?.value) return null;
    const date = typeof control.value === 'string' ? new Date(control.value) : control.value;
    return date instanceof Date && !isNaN(date.getTime()) ? date : null;
  });

  readonly accountOptions = computed<OsDropdownOption[]>(() => {
    const accounts = this.accountState.accountsByBudgetId();
    return accounts.map((account) => ({
      value: account.id,
      label: account.name,
    }));
  });

  readonly creditCardOptions = computed<OsDropdownOption[]>(() => {
    const creditCards = this.creditCardState.creditCardsByBudgetId();
    return [
      { value: '', label: 'Nenhum (Dinheiro/Transferência)' },
      ...creditCards.map((card) => ({
        value: card.id,
        label: card.name,
      })),
    ];
  });

  readonly categoryOptions = computed<OsDropdownOption[]>(() => {
    const transactionType = this.typeControl()?.value as TransactionType | null;
    const activeCategories = this.categoryState.activeCategories();

    if (!transactionType) {
      return activeCategories.map((category) => ({
        value: category.id,
        label: category.name,
      }));
    }

    const typeMap: Record<TransactionType, string> = {
      INCOME: 'INCOME',
      EXPENSE: 'EXPENSE',
      TRANSFER: 'TRANSFER',
    };

    const categoryType = typeMap[transactionType];

    return activeCategories
      .filter((category) => category.type === categoryType)
      .map((category) => ({
        value: category.id,
        label: category.name,
      }));
  });

  readonly typeOptions = computed<OsDropdownOption[]>(() => [
    { value: 'INCOME', label: 'Receita' },
    { value: 'EXPENSE', label: 'Despesa' },
    { value: 'TRANSFER', label: 'Transferência' },
  ]);

  readonly formConfig = computed(() => ({
    title: '',
    showHeader: false,
    showActions: true,
    showSaveButton: true,
    showCancelButton: true,
    saveButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
  }));

  readonly getDescriptionErrorMessage = computed(() => {
    this._formValidityTick();
    const control = this.descriptionControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Descrição é obrigatória';
    if (control.hasError('minlength')) return 'Descrição deve ter pelo menos 3 caracteres';
    if (control.hasError('maxlength')) return 'Descrição deve ter no máximo 200 caracteres';
    return '';
  });

  readonly getAmountErrorMessage = computed(() => {
    this._formValidityTick();
    const control = this.amountControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Valor é obrigatório';
    if (control.hasError('min')) return 'Valor deve ser maior que zero';
    return '';
  });

  readonly getTypeErrorMessage = computed(() => {
    this._formValidityTick();
    const control = this.typeControl();
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'Tipo é obrigatório';
    return '';
  });

  readonly getAccountIdErrorMessage = computed(() => {
    this._formValidityTick();
    const control = this.accountIdControl();
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'Conta é obrigatória';
    return '';
  });

  readonly getCategoryIdErrorMessage = computed(() => {
    this._formValidityTick();
    const control = this.categoryIdControl();
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'Categoria é obrigatória';
    return '';
  });

  readonly getCreditCardIdErrorMessage = computed(() => {
    this._formValidityTick();
    const control = this.creditCardIdControl();
    if (!control || !control.touched) return '';
    return '';
  });

  constructor() {
    effect((onCleanup) => {
      const form = this._form();
      if (!form) return;

      this._formValidityTick.update((v) => v + 1);
      const sub = form.statusChanges.subscribe(() => this._formValidityTick.update((v) => v + 1));
      onCleanup(() => sub.unsubscribe());
    });

    effect(() => {
      const budgetId = this.budgetSelection.selectedBudgetId();
      if (budgetId) {
        this.creditCardState.loadCreditCards();
        this.categoryState.loadCategories();
        this.accountState.loadAccounts();
      }
    });

    effect(() => {
      const transaction = this._transaction();
      const form = this._form();
      if (form && transaction) {
        const transactionDate = transaction.transactionDate || transaction.date;
        form.patchValue({
          description: transaction.description,
          amount: transaction.amount / 100,
          type: (transaction.type || transaction.direction || 'EXPENSE') as TransactionType,
          accountId: transaction.accountId || '',
          categoryId: transaction.categoryId || '',
          transactionDate: transactionDate ? new Date(transactionDate) : null,
          creditCardId: transaction.creditCardId || '',
        });
      }
    });

    effect(() => {
      const form = this._form();
      const isLoading = this._loading();
      if (form) {
        if (isLoading) {
          form.disable();
        } else {
          form.enable();
        }
      }
    });
  }

  async ngOnInit(): Promise<void> {
    const transactionId = this.route.snapshot.paramMap.get('id');
    if (!transactionId) {
      this.notificationService.showError('ID da transação não encontrado');
      this.navigateBack();
      return;
    }

    this._transactionId.set(transactionId);

    const budgetId = this.budgetSelection.selectedBudgetId();
    if (!budgetId) {
      this.notificationService.showError('Selecione um orçamento primeiro');
      this.navigateBack();
      return;
    }

    this._loading.set(true);
    try {
      const res = await lastValueFrom(
        this.api.list({
          budgetId,
          page: 1,
          pageSize: 1000,
        })
      );

      const transaction = res.data.data.find((t) => t.id === transactionId);
      if (!transaction) {
        this.notificationService.showError('Transação não encontrada');
        this.navigateBack();
        return;
      }

      this._transaction.set(transaction);

      const transactionDate = transaction.transactionDate || transaction.date;
      const form = new FormGroup({
        description: new FormControl(transaction.description, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
        ]),
        amount: new FormControl<number>(transaction.amount / 100, [
          Validators.required,
          Validators.min(0.01),
        ]),
        type: new FormControl<TransactionType>(
          (transaction.type || transaction.direction || 'EXPENSE') as TransactionType,
          [Validators.required]
        ),
        accountId: new FormControl<string>(transaction.accountId || '', [Validators.required]),
        categoryId: new FormControl<string>(transaction.categoryId || '', [Validators.required]),
        transactionDate: new FormControl<Date | null>(
          transactionDate ? new Date(transactionDate) : null
        ),
        creditCardId: new FormControl<string>(transaction.creditCardId || ''),
      });

      this._form.set(form);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar transação';
      this.notificationService.showError(errorMessage);
      this.navigateBack();
    } finally {
      this._loading.set(false);
    }
  }

  onTypeChange(value: string | number | boolean): void {
    const control = this.typeControl();
    if (control) {
      control.setValue(value as TransactionType);
      control.markAsTouched();
    }
  }

  onAccountChange(value: string | number | boolean): void {
    const control = this.accountIdControl();
    if (control) {
      control.setValue(String(value));
      control.markAsTouched();
    }
  }

  onCategoryChange(value: string | number | boolean): void {
    const control = this.categoryIdControl();
    if (control) {
      control.setValue(String(value));
      control.markAsTouched();
    }
  }

  onDateChange(date: Date | null): void {
    const control = this.transactionDateControl();
    if (control) {
      control.setValue(date);
      control.markAsTouched();
    }
  }

  onCreditCardChange(value: string | number | boolean): void {
    const control = this.creditCardIdControl();
    if (control) {
      control.setValue(String(value));
      control.markAsTouched();
    }
  }

  async onSave(): Promise<void> {
    const form = this._form();
    if (!form || form.invalid) {
      form?.markAllAsTouched();
      return;
    }

    const transactionId = this._transactionId();
    const user = this.authService.currentUser();
    if (!transactionId || !user) {
      this.notificationService.showError('Dados insuficientes para atualizar a transação');
      return;
    }

    const budgetId = this.budgetSelection.selectedBudgetId();
    if (!budgetId) {
      this.notificationService.showError('Selecione um orçamento primeiro');
      return;
    }

    this._loading.set(true);
    try {
      const formValue = form.value;
      const amountInCents = Math.round((formValue.amount || 0) * 100);
      const transactionDate = formValue.transactionDate
        ? new Date(formValue.transactionDate).toISOString()
        : undefined;

      const result = await lastValueFrom(
        this.api.update({
          userId: user.id,
          id: transactionId,
          description: formValue.description,
          amount: amountInCents,
          type: formValue.type,
          accountId: formValue.accountId,
          categoryId: formValue.categoryId,
          budgetId,
          transactionDate,
          creditCardId: formValue.creditCardId || undefined,
        })
      );

      if (result?.data?.success) {
        this.notificationService.showSuccess('Transação atualizada com sucesso!');
        this.navigateBack();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar transação';
      this.notificationService.showError(errorMessage);
    } finally {
      this._loading.set(false);
    }
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
    this.router.navigate(['/transactions'], { replaceUrl: true });
  }
}
