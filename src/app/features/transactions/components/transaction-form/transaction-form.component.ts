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
import { lastValueFrom } from 'rxjs';
import type {
  TransactionDto,
  TransactionType,
} from '../../../../../dtos/transaction/transaction-types';
import { TransactionsApiService } from '../../services/transactions-api.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { CreditCardState } from '@core/services/credit-card/credit-card-state/credit-card.state';
import { OsModalTemplateComponent } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import { OsFormTemplateComponent } from '@shared/ui-components/templates/os-form-template/os-form-template.component';
import { OsFormFieldComponent } from '@shared/ui-components/molecules/os-form-field/os-form-field.component';
import { OsDropdownComponent } from '@shared/ui-components/molecules/os-dropdown/os-dropdown.component';
import { OsDatePickerComponent } from '@shared/ui-components/molecules/os-date-picker/os-date-picker.component';
import type { OsDropdownOption } from '@shared/ui-components/molecules/os-dropdown/os-dropdown.component';

@Component({
  selector: 'os-transaction-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OsModalTemplateComponent,
    OsFormTemplateComponent,
    OsFormFieldComponent,
    OsDropdownComponent,
    OsDatePickerComponent,
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
          [disabled]="loading()"
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
          [disabled]="loading() || accountOptions().length === 0"
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
          [disabled]="loading() || categoryOptions().length === 0"
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
            [disabled]="loading()"
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
          [disabled]="loading() || creditCardOptions().length === 0"
          (valueChange)="onCreditCardChange($event)"
          size="medium"
          variant="default"
          placeholder="Selecione a forma de pagamento"
          ariaLabel="Forma de pagamento"
        />
      </os-form-template>
    </os-modal-template>
  `,
  styles: [
    `
      .transaction-form__type-field,
      .transaction-form__account-field,
      .transaction-form__category-field,
      .transaction-form__date-field,
      .transaction-form__payment-method-field {
        margin-bottom: 16px;
      }

      .transaction-form__helper-text {
        font-size: 12px;
        color: var(--os-color-text-secondary);
        margin-top: -8px;
        margin-bottom: 16px;
      }
    `,
  ],
})
export class TransactionFormComponent implements OnInit {
  private readonly api = inject(TransactionsApiService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly creditCardState = inject(CreditCardState);

  readonly transaction = input<TransactionDto | null>(null);
  readonly accountOptions = input<{ value: string; label: string }[]>([]);
  readonly categoryOptions = input<{ value: string; label: string }[]>([]);

  readonly saved = output<void>();
  readonly cancelled = output<void>();

  private readonly _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();

  private readonly _form = signal<FormGroup | null>(null);
  readonly form = this._form.asReadonly();

  readonly descriptionControl = computed(
    () => this._form()?.get('description') as FormControl | null
  );
  readonly amountControl = computed(() => this._form()?.get('amount') as FormControl | null);
  readonly typeControl = computed(() => this._form()?.get('type') as FormControl | null);
  readonly accountIdControl = computed(() => this._form()?.get('accountId') as FormControl | null);
  readonly categoryIdControl = computed(
    () => this._form()?.get('categoryId') as FormControl | null
  );
  readonly transactionDateControl = computed(
    () => this._form()?.get('transactionDate') as FormControl | null
  );
  readonly creditCardIdControl = computed(
    () => this._form()?.get('creditCardId') as FormControl | null
  );

  readonly transactionDateValue = computed(() => {
    const control = this.transactionDateControl();
    if (!control?.value) return null;
    const date = typeof control.value === 'string' ? new Date(control.value) : control.value;
    return date instanceof Date && !isNaN(date.getTime()) ? date : null;
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

  readonly typeOptions = computed<OsDropdownOption[]>(() => [
    { value: 'INCOME', label: 'Receita' },
    { value: 'EXPENSE', label: 'Despesa' },
    { value: 'TRANSFER', label: 'Transferência' },
  ]);

  readonly modalConfig = computed(() => ({
    title: this.mode() === 'create' ? 'Nova Transação' : 'Editar Transação',
    subtitle:
      this.mode() === 'create'
        ? 'Preencha os dados para criar uma nova transação'
        : 'Atualize as informações da transação',
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

  readonly mode = computed(() => (this.transaction() ? 'edit' : 'create'));

  readonly getDescriptionErrorMessage = computed(() => {
    const control = this.descriptionControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Descrição é obrigatória';
    if (control.hasError('minlength')) return 'Descrição deve ter pelo menos 3 caracteres';
    if (control.hasError('maxlength')) return 'Descrição deve ter no máximo 200 caracteres';
    return '';
  });

  readonly getAmountErrorMessage = computed(() => {
    const control = this.amountControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Valor é obrigatório';
    if (control.hasError('min')) return 'Valor deve ser maior que zero';
    return '';
  });

  readonly getTypeErrorMessage = computed(() => {
    const control = this.typeControl();
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'Tipo é obrigatório';
    return '';
  });

  readonly getAccountIdErrorMessage = computed(() => {
    const control = this.accountIdControl();
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'Conta é obrigatória';
    return '';
  });

  readonly getCategoryIdErrorMessage = computed(() => {
    const control = this.categoryIdControl();
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'Categoria é obrigatória';
    return '';
  });

  readonly getCreditCardIdErrorMessage = computed(() => {
    const control = this.creditCardIdControl();
    if (!control || !control.touched) return '';
    return '';
  });

  constructor() {
    effect(() => {
      const budgetId = this.budgetSelection.selectedBudgetId();
      if (budgetId) {
        this.creditCardState.loadCreditCards();
      }
    });

    effect(() => {
      const transaction = this.transaction();
      const form = this._form();
      if (form && transaction) {
        const transactionDate = transaction.transactionDate || transaction.date;
        form.patchValue({
          description: transaction.description,
          amount: transaction.amount,
          type: transaction.type || transaction.direction || 'EXPENSE',
          accountId: transaction.accountId || '',
          categoryId: transaction.categoryId || '',
          transactionDate: transactionDate ? new Date(transactionDate) : null,
          creditCardId: transaction.creditCardId || '',
        });
      }
    });
  }

  ngOnInit(): void {
    const initialTransaction = this.transaction();
    const form = new FormGroup({
      description: new FormControl(initialTransaction?.description || '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200),
      ]),
      amount: new FormControl<number | null>(initialTransaction?.amount || null, [
        Validators.required,
        Validators.min(0.01),
      ]),
      type: new FormControl<TransactionType>(
        (initialTransaction?.type || initialTransaction?.direction || 'EXPENSE') as TransactionType,
        [Validators.required]
      ),
      accountId: new FormControl<string>(initialTransaction?.accountId || '', [
        Validators.required,
      ]),
      categoryId: new FormControl<string>(initialTransaction?.categoryId || '', [
        Validators.required,
      ]),
      transactionDate: new FormControl<Date | null>(null),
      creditCardId: new FormControl<string>(initialTransaction?.creditCardId || ''),
    });

    if (initialTransaction?.transactionDate || initialTransaction?.date) {
      const date = new Date(initialTransaction.transactionDate || initialTransaction.date || '');
      if (!isNaN(date.getTime())) {
        form.patchValue({ transactionDate: date });
      }
    }

    this._form.set(form);
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

  async onSubmit(): Promise<void> {
    const form = this._form();
    if (!form || !form.valid) {
      form?.markAllAsTouched();
      return;
    }

    const user = this.authService.currentUser();
    if (!user) {
      this.notificationService.showError('Usuário não autenticado');
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
      const transactionDate = formValue.transactionDate
        ? new Date(formValue.transactionDate).toISOString()
        : undefined;

      if (this.mode() === 'create') {
        const result = await lastValueFrom(
          this.api.create({
            userId: user.id,
            description: formValue.description,
            amount: formValue.amount,
            type: formValue.type,
            accountId: formValue.accountId,
            categoryId: formValue.categoryId,
            budgetId,
            transactionDate,
            creditCardId: formValue.creditCardId || undefined,
          })
        );

        if (result) {
          this.notificationService.showSuccess('Transação criada com sucesso!');
          this.saved.emit();
          this.onCancel();
        }
      } else {
        const currentTransaction = this.transaction();
        if (!currentTransaction) return;

        const result = await lastValueFrom(
          this.api.update({
            userId: user.id,
            id: currentTransaction.id,
            description: formValue.description,
            amount: formValue.amount,
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
          this.saved.emit();
          this.onCancel();
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar transação';
      this.notificationService.showError(errorMessage);
    } finally {
      this._loading.set(false);
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
