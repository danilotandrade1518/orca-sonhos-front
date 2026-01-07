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
import { CreditCardState } from '@core/services/credit-card/credit-card-state/credit-card.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
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
import { OsDateInputComponent } from '@shared/ui-components/atoms/os-date-input/os-date-input.component';

@Component({
  selector: 'os-credit-card-bills-create-page',
  imports: [
    ReactiveFormsModule,
    OsPageComponent,
    OsPageHeaderComponent,
    OsFormTemplateComponent,
    OsSelectComponent,
    OsMoneyInputComponent,
    OsDateInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Criar nova fatura">
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
        <div [formGroup]="form()!">
          <os-select
            label="Cartão de Crédito"
            [options]="creditCardOptions()"
            formControlName="creditCardId"
            [required]="true"
            [errorMessage]="getCreditCardErrorMessage()"
            placeholder="Selecione um cartão"
          />

          <os-date-input
            label="Data de Fechamento"
            formControlName="closingDate"
            [required]="true"
            [errorMessage]="getClosingDateErrorMessage()"
            placeholder="Selecione a data de fechamento"
          />

          <os-date-input
            label="Data de Vencimento"
            formControlName="dueDate"
            [required]="true"
            [errorMessage]="getDueDateErrorMessage()"
            placeholder="Selecione a data de vencimento"
          />

          <os-money-input
            label="Valor"
            formControlName="amount"
            [errorMessage]="getAmountErrorMessage()"
            placeholder="0,00"
            [allowNegative]="false"
            [required]="true"
          />
        </div>
        }
      </os-form-template>
    </os-page>
  `,
  styleUrl: './credit-card-bills-create.page.scss',
})
export class CreditCardBillsCreatePage implements OnInit {
  private readonly creditCardState = inject(CreditCardState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly loading = computed(() => this.creditCardState.loading());

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

  readonly pageTitle = computed(() => 'Criar Fatura');

  readonly pageSubtitle = computed(() => 'Preencha os dados para criar uma nova fatura');

  readonly breadcrumbs = computed((): BreadcrumbItem[] => {
    return [
      { label: 'Cartões de Crédito', route: '/credit-cards' },
      { label: 'Nova Fatura', route: undefined },
    ];
  });

  readonly creditCardOptions = computed<OsSelectOption[]>(() => {
    const creditCards = this.creditCardState.creditCardsByBudgetId();
    return creditCards.map((card) => ({
      value: card.id,
      label: card.name,
    }));
  });

  readonly creditCardIdControl = computed(() => {
    return this._form()?.get('creditCardId') as FormControl | null;
  });

  readonly closingDateControl = computed(() => {
    return this._form()?.get('closingDate') as FormControl | null;
  });

  readonly dueDateControl = computed(() => {
    return this._form()?.get('dueDate') as FormControl | null;
  });

  readonly amountControl = computed(() => {
    return this._form()?.get('amount') as FormControl | null;
  });

  readonly formConfig = computed(() => ({
    title: '',
    showHeader: false,
    showActions: true,
    showSaveButton: true,
    showCancelButton: true,
    saveButtonText: 'Criar',
    cancelButtonText: 'Cancelar',
  }));

  readonly getCreditCardErrorMessage = computed(() => {
    this._formValidityTick();
    const control = this.creditCardIdControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Cartão de crédito é obrigatório';
    return '';
  });

  readonly getClosingDateErrorMessage = computed(() => {
    this._formValidityTick();
    const control = this.closingDateControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Data de fechamento é obrigatória';
    const form = this._form();
    if (form?.hasError('invalidDateRange')) {
      return 'Data de fechamento deve ser anterior à data de vencimento';
    }
    return '';
  });

  readonly getDueDateErrorMessage = computed(() => {
    this._formValidityTick();
    const control = this.dueDateControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Data de vencimento é obrigatória';
    const form = this._form();
    if (form?.hasError('invalidDateRange')) {
      return 'Data de vencimento deve ser posterior à data de fechamento';
    }
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

  constructor() {
    effect((onCleanup) => {
      const form = this._form();
      if (!form) return;

      this._formValidityTick.update((v) => v + 1);
      const sub = form.statusChanges.subscribe(() => this._formValidityTick.update((v) => v + 1));
      onCleanup(() => sub.unsubscribe());
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
    
    effect(() => {
      const form = this._form();
      if (!form) return;

      const closingDate = form.get('closingDate')?.value;
      const dueDate = form.get('dueDate')?.value;

      if (closingDate && dueDate && closingDate instanceof Date && dueDate instanceof Date) {
        if (closingDate >= dueDate) {
          form.setErrors({ invalidDateRange: true });
        } else {
          const errors = form.errors;
          if (errors && 'invalidDateRange' in errors) {
            delete errors['invalidDateRange'];
            form.setErrors(Object.keys(errors).length > 0 ? errors : null);
          }
        }
      }
    });
  }

  ngOnInit(): void {
    const form = new FormGroup({
      creditCardId: new FormControl<string | null>(null, [Validators.required]),
      closingDate: new FormControl<Date | null>(null, [Validators.required]),
      dueDate: new FormControl<Date | null>(null, [Validators.required]),
      amount: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    });

    this._form.set(form);
  }

  onSave(): void {
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
    const amountInCents = Math.round((formValue.amount || 0) * 100);
    const closingDateISO =
      formValue.closingDate instanceof Date
        ? formValue.closingDate.toISOString()
        : formValue.closingDate;
    const dueDateISO =
      formValue.dueDate instanceof Date ? formValue.dueDate.toISOString() : formValue.dueDate;

    this.creditCardState.createCreditCardBill({
      creditCardId: formValue.creditCardId,
      closingDate: closingDateISO,
      dueDate: dueDateISO,
      amount: amountInCents,
    });

    this.notificationService.showSuccess('Fatura criada com sucesso!');
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
