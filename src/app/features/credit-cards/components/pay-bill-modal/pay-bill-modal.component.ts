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
import { CreditCardState } from '@core/services/credit-card/credit-card-state/credit-card.state';
import { AccountState } from '@core/services/account/account-state/account.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { OsModalTemplateComponent } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import { OsFormTemplateComponent } from '@shared/ui-components/templates/os-form-template/os-form-template.component';
import {
  OsSelectComponent,
  type OsSelectOption,
} from '@shared/ui-components/atoms/os-select/os-select.component';
import { OsMoneyInputComponent } from '@shared/ui-components/atoms/os-money-input/os-money-input.component';
import type { CreditCardBillDto } from '../../../../../dtos/credit-card';

@Component({
  selector: 'os-pay-bill-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OsModalTemplateComponent,
    OsFormTemplateComponent,
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
        @if (form() && creditCardBill()) {
        <div [formGroup]="form()!">
          <os-select
            label="Conta de Pagamento"
            [options]="accountOptions()"
            formControlName="accountId"
            [required]="true"
            [errorMessage]="getAccountErrorMessage()"
            placeholder="Selecione a conta"
          />

          <os-select
            label="Categoria de Pagamento"
            [options]="categoryOptions()"
            formControlName="paymentCategoryId"
            [required]="true"
            [errorMessage]="getCategoryErrorMessage()"
            placeholder="Selecione a categoria"
          />

          <os-money-input
            label="Valor"
            formControlName="amount"
            [readonly]="true"
            [errorMessage]="getAmountErrorMessage()"
            placeholder="0,00"
            [allowNegative]="false"
          />
        </div>
        }
      </os-form-template>
    </os-modal-template>
  `,
  styleUrl: './pay-bill-modal.component.scss',
})
export class PayBillModalComponent implements OnInit {
  private readonly creditCardState = inject(CreditCardState);
  private readonly accountState = inject(AccountState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  readonly creditCardBill = input.required<CreditCardBillDto>();

  readonly closed = output<void>();

  readonly loading = computed(() => this.creditCardState.loading());

  private readonly _form = signal<FormGroup | null>(null);
  readonly form = this._form.asReadonly();

  private readonly _validationTrigger = signal(0);

  readonly accountOptions = computed<OsSelectOption[]>(() => {
    const accounts = this.accountState.accountsByBudgetId();
    return accounts.map((account) => ({
      value: account.id,
      label: account.name,
    }));
  });

  readonly categoryOptions = computed<OsSelectOption[]>(() => [
    { value: 'category-utilities', label: 'Contas' },
    { value: 'category-groceries', label: 'Supermercado' },
    { value: 'category-transport', label: 'Transporte' },
    { value: 'category-health', label: 'Saúde' },
    { value: 'category-education', label: 'Educação' },
    { value: 'category-entertainment', label: 'Entretenimento' },
    { value: 'category-clothing', label: 'Roupas' },
    { value: 'category-home', label: 'Casa' },
  ]);

  readonly accountIdControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('accountId') as FormControl | null;
  });

  readonly paymentCategoryIdControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('paymentCategoryId') as FormControl | null;
  });

  readonly amountControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('amount') as FormControl | null;
  });

  readonly modalConfig = computed(() => ({
    title: 'Pagar Fatura',
    subtitle: 'Selecione a conta e categoria para realizar o pagamento',
    showActions: true,
    showCancelButton: true,
    showConfirmButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Pagar',
  }));

  readonly formConfig = computed(() => ({
    title: '',
    showHeader: false,
    showProgress: false,
    showActions: false,
  }));

  readonly getAccountErrorMessage = computed(() => {
    this._validationTrigger();
    const control = this.accountIdControl();
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'Conta de pagamento é obrigatória';
    return '';
  });

  readonly getCategoryErrorMessage = computed(() => {
    this._validationTrigger();
    const control = this.paymentCategoryIdControl();
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'Categoria de pagamento é obrigatória';
    return '';
  });

  readonly getAmountErrorMessage = computed(() => {
    this._validationTrigger();
    const control = this.amountControl();
    if (!control || (!control.touched && !control.dirty)) return '';
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
    const bill = this.creditCardBill();
    if (!bill) {
      return;
    }

    this.accountState.loadAccounts();

    const form = new FormGroup({
      accountId: new FormControl<string | null>(null, [Validators.required]),
      paymentCategoryId: new FormControl<string | null>(null, [Validators.required]),
      amount: new FormControl(bill.amount / 100, [Validators.required]),
    });

    this._form.set(form);
  }

  onSubmit(): void {
    const form = this._form();
    if (!form || form.invalid) {
      form?.markAllAsTouched();
      this._validationTrigger.update((v) => v + 1);
      return;
    }

    const user = this.authService.currentUser();
    const budgetId = this.budgetSelection.selectedBudgetId();
    const bill = this.creditCardBill();

    if (!user || !budgetId || !bill) {
      this.notificationService.showError('Usuário, orçamento ou fatura não encontrado');
      return;
    }

    const formValue = form.value;

    this.creditCardState.payCreditCardBill({
      creditCardBillId: bill.id,
      accountId: formValue.accountId,
      userId: user.id,
      budgetId: budgetId,
      amount: bill.amount,
      paymentCategoryId: formValue.paymentCategoryId,
    });

    this.notificationService.showSuccess('Fatura paga com sucesso!');
    this.closed.emit();
    this.router.navigate(['/credit-cards'], { replaceUrl: true });
  }

  onCancel(): void {
    this.closed.emit();
    this.router.navigate(['/credit-cards'], { replaceUrl: true });
  }
}
