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

import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreditCardState } from '@core/services/credit-card/credit-card-state/credit-card.state';
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
import { OsDateInputComponent } from '@shared/ui-components/atoms/os-date-input/os-date-input.component';
import type { CreditCardBillDto } from '../../../../../dtos/credit-card';

@Component({
  selector: 'os-credit-card-bill-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    OsModalTemplateComponent,
    OsFormTemplateComponent,
    OsSelectComponent,
    OsMoneyInputComponent,
    OsDateInputComponent
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
      <os-form-template
        [config]="formConfig()"
        [isInvalid]="isFormInvalid()"
        [saveButtonDisabled]="isSaveDisabled()"
        [showHeader]="false"
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
    </os-modal-template>
  `,
  styleUrl: './credit-card-bill-form.component.scss',
})
export class CreditCardBillFormComponent implements OnInit {
  private readonly creditCardState = inject(CreditCardState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  readonly creditCardBill = input<CreditCardBillDto | null>(null);
  readonly mode = input<'create' | 'edit'>('create');

  readonly saved = output<void>();
  readonly cancelled = output<void>();

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

  readonly modalConfig = computed(() => ({
    title: this.mode() === 'create' ? 'Criar Fatura' : 'Editar Fatura',
    subtitle:
      this.mode() === 'create'
        ? 'Preencha os dados para criar uma nova fatura'
        : 'Atualize as informações da fatura',
    showActions: true,
    showCancelButton: true,
    showConfirmButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: this.mode() === 'create' ? 'Criar' : 'Salvar',
  }));

  readonly formConfig = computed(() => ({
    title: '',
    showHeader: false,
    showActions: false,
  }));

  readonly getCreditCardErrorMessage = computed(() => {
    const control = this.creditCardIdControl();
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'Cartão de crédito é obrigatório';
    return '';
  });

  readonly getClosingDateErrorMessage = computed(() => {
    const control = this.closingDateControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Data de fechamento é obrigatória';
    return '';
  });

  readonly getDueDateErrorMessage = computed(() => {
    const control = this.dueDateControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Data de vencimento é obrigatória';
    return '';
  });

  readonly getAmountErrorMessage = computed(() => {
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
      const creditCardBill = this.creditCardBill();
      const form = this._form();
      if (form && creditCardBill) {
        form.patchValue({
          creditCardId: creditCardBill.creditCardId,
          closingDate: creditCardBill.closingDate ? new Date(creditCardBill.closingDate) : null,
          dueDate: creditCardBill.dueDate ? new Date(creditCardBill.dueDate) : null,
          amount: creditCardBill.amount / 100,
        });
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
      creditCardId: new FormControl<string | null>(null, [Validators.required]),
      closingDate: new FormControl<Date | null>(null, [Validators.required]),
      dueDate: new FormControl<Date | null>(null, [Validators.required]),
      amount: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    });

    const creditCardBill = this.creditCardBill();
    if (creditCardBill) {
      form.patchValue({
        creditCardId: creditCardBill.creditCardId,
        closingDate: creditCardBill.closingDate ? new Date(creditCardBill.closingDate) : null,
        dueDate: creditCardBill.dueDate ? new Date(creditCardBill.dueDate) : null,
        amount: creditCardBill.amount / 100,
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
    const creditCardBill = this.creditCardBill();

    const amountInCents = Math.round((formValue.amount || 0) * 100);
    const closingDateISO =
      formValue.closingDate instanceof Date
        ? formValue.closingDate.toISOString()
        : formValue.closingDate;
    const dueDateISO =
      formValue.dueDate instanceof Date ? formValue.dueDate.toISOString() : formValue.dueDate;

    if (this.mode() === 'create') {
      this.creditCardState.createCreditCardBill({
        creditCardId: formValue.creditCardId,
        closingDate: closingDateISO,
        dueDate: dueDateISO,
        amount: amountInCents,
      });

      this.notificationService.showSuccess('Fatura criada com sucesso!');
      this.saved.emit();
    } else if (creditCardBill) {
      this.creditCardState.updateCreditCardBill({
        id: creditCardBill.id,
        closingDate: closingDateISO,
        dueDate: dueDateISO,
        amount: amountInCents,
      });

      this.notificationService.showSuccess('Fatura atualizada com sucesso!');
      this.saved.emit();
    }

    this.router.navigate(['/credit-cards'], { replaceUrl: true });
  }

  onCancel(): void {
    this.cancelled.emit();
    this.router.navigate(['/credit-cards'], { replaceUrl: true });
  }
}
