import {
  Component,
  computed,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  effect,
  DestroyRef,
} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CreditCardState } from '@core/services/credit-card/credit-card-state/credit-card.state';
import { AccountState } from '@core/services/account/account-state/account.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { CategoriesApiService } from '@core/services/category/categories-api.service';
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import {
  OsPageHeaderComponent,
  type BreadcrumbItem,
} from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import { OsFormTemplateComponent } from '@shared/ui-components/templates/os-form-template/os-form-template.component';
import {
  OsSelectComponent,
  type OsSelectOption,
} from '@shared/ui-components/atoms/os-select/os-select.component';
import { OsMoneyInputComponent } from '@shared/ui-components/atoms/os-money-input/os-money-input.component';
import type { CreditCardBillDto } from '../../../../../dtos/credit-card';
import type { CategoryDto } from '../../../../../dtos/category';

@Component({
  selector: 'os-pay-bill-page',
  imports: [
    ReactiveFormsModule,
    OsPageComponent,
    OsPageHeaderComponent,
    OsFormTemplateComponent,
    OsSelectComponent,
    OsMoneyInputComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Pagar fatura">
      <os-page-header
        title="Pagar Fatura"
        subtitle="Selecione a conta e categoria para realizar o pagamento"
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
    </os-page>
  `,
  styleUrl: './pay-bill.page.scss',
})
export class PayBillPage implements OnInit {
  private readonly creditCardState = inject(CreditCardState);
  private readonly accountState = inject(AccountState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly categoriesApi = inject(CategoriesApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = computed(() => this.creditCardState.loading() || this.accountState.loading());

  private readonly _form = signal<FormGroup | null>(null);
  readonly form = this._form.asReadonly();

  private readonly _creditCardBill = signal<CreditCardBillDto | null>(null);
  readonly creditCardBill = this._creditCardBill.asReadonly();

  private readonly _categories = signal<CategoryDto[]>([]);
  readonly categories = this._categories.asReadonly();

  private readonly _validationTrigger = signal(0);

  readonly breadcrumbs = computed((): BreadcrumbItem[] => {
    const base: BreadcrumbItem[] = [{ label: 'Cartões de Crédito', route: '/credit-cards' }];
    if (this._creditCardBill()) {
      base.push({ label: 'Pagar Fatura', route: undefined });
    }
    return base;
  });

  readonly accountOptions = computed<OsSelectOption[]>(() => {
    const accounts = this.accountState.accountsByBudgetId();
    return accounts.map((account) => ({
      value: account.id,
      label: account.name,
    }));
  });

  readonly categoryOptions = computed<OsSelectOption[]>(() => {
    return this._categories()
      .filter((category) => category.active)
      .map((category) => ({
        value: category.id,
        label: category.name,
      }));
  });

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

  readonly formConfig = computed(() => ({
    title: '',
    showHeader: false,
    showProgress: false,
    showActions: true,
    showSaveButton: true,
    showCancelButton: true,
    saveButtonText: 'Pagar',
    cancelButtonText: 'Cancelar',
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

    effect(() => {
      const bill = this._creditCardBill();
      const form = this._form();
      if (form && bill) {
        form.patchValue({
          amount: bill.amount / 100,
        });
        this._validationTrigger.update((v) => v + 1);
      }
    });
  }

  ngOnInit(): void {
    const billId = this.route.snapshot.paramMap.get('id');
    if (!billId) {
      this.notificationService.showError('ID da fatura não fornecido');
      this.navigateBack();
      return;
    }

    this.loadBill(billId);
    this.loadAccounts();
    this.loadCategories();

    const form = new FormGroup({
      accountId: new FormControl<string | null>(null, [Validators.required]),
      paymentCategoryId: new FormControl<string | null>(null, [Validators.required]),
      amount: new FormControl<number | null>(null, [Validators.required]),
    });

    this._form.set(form);
  }

  private loadBill(billId: string): void {
    const bills = this.creditCardState.bills();
    const bill = bills.find((b) => b.id === billId);

    if (bill) {
      this._creditCardBill.set(bill);
    } else {
      const budgetId = this.budgetSelection.selectedBudgetId();
      if (budgetId) {
        this.creditCardState.loadCreditCardBills(undefined, budgetId);
      }

      const allBills = this.creditCardState.bills();
      const foundBill = allBills.find((b) => b.id === billId);

      if (foundBill) {
        this._creditCardBill.set(foundBill);
      } else {
        this.notificationService.showError('Fatura não encontrada');
        this.navigateBack();
      }
    }
  }

  private loadAccounts(): void {
    this.accountState.loadAccounts();
  }

  private loadCategories(): void {
    const budgetId = this.budgetSelection.selectedBudgetId();
    if (!budgetId) {
      this.notificationService.showError('Nenhum orçamento selecionado');
      this.navigateBack();
      return;
    }

    this.categoriesApi
      .listCategories(budgetId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => {
          this._categories.set(categories);
        },
        error: () => {
          this.notificationService.showError('Erro ao carregar categorias');
        },
      });
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
    const bill = this._creditCardBill();

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
    this.router.navigate(['/credit-cards'], { replaceUrl: true });
  }
}
