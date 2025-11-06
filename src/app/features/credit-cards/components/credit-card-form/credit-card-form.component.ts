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
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { OsModalTemplateComponent } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import { OsFormTemplateComponent } from '@shared/ui-components/templates/os-form-template/os-form-template.component';
import { OsFormFieldComponent } from '@shared/ui-components/molecules/os-form-field/os-form-field.component';
import { OsInputComponent } from '@shared/ui-components/atoms/os-input/os-input.component';
import { OsMoneyInputComponent } from '@shared/ui-components/atoms/os-money-input/os-money-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import type { CreditCardDto } from '../../../../../dtos/credit-card';

@Component({
  selector: 'os-credit-card-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OsModalTemplateComponent,
    OsFormTemplateComponent,
    OsFormFieldComponent,
    OsInputComponent,
    OsMoneyInputComponent,
    MatFormFieldModule,
    MatInputModule,
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
            label="Nome do Cartão"
            [required]="true"
            [control]="nameControl()"
            [errorMessage]="getNameErrorMessage()"
          >
            <os-input
              slot="input"
              type="text"
              formControlName="name"
              placeholder="Ex: Cartão Nubank"
              [required]="true"
            />
          </os-form-field>

          <os-money-input
            label="Limite"
            formControlName="limit"
            [errorMessage]="getLimitErrorMessage()"
            placeholder="0,00"
            [allowNegative]="false"
            [required]="true"
          />

          <mat-form-field appearance="outline">
            <mat-label>Dia de Fechamento</mat-label>
            <input
              matInput
              type="number"
              formControlName="closingDay"
              placeholder="1-31"
              min="1"
              max="31"
              required
            />
            @if (getClosingDayErrorMessage()) {
            <mat-error>{{ getClosingDayErrorMessage() }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Dia de Vencimento</mat-label>
            <input
              matInput
              type="number"
              formControlName="dueDay"
              placeholder="1-31"
              min="1"
              max="31"
              required
            />
            @if (getDueDayErrorMessage()) {
            <mat-error>{{ getDueDayErrorMessage() }}</mat-error>
            }
          </mat-form-field>
        </div>
        }
      </os-form-template>
    </os-modal-template>
  `,
  styleUrl: './credit-card-form.component.scss',
})
export class CreditCardFormComponent implements OnInit {
  private readonly creditCardState = inject(CreditCardState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  readonly creditCard = input<CreditCardDto | null>(null);
  readonly mode = input<'create' | 'edit'>('create');

  readonly saved = output<void>();
  readonly cancelled = output<void>();

  readonly loading = computed(() => this.creditCardState.loading());

  private readonly _form = signal<FormGroup | null>(null);
  readonly form = this._form.asReadonly();

  private readonly _validationTrigger = signal(0);

  readonly nameControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('name') as FormControl | null;
  });
  readonly limitControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('limit') as FormControl | null;
  });
  readonly closingDayControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('closingDay') as FormControl | null;
  });
  readonly dueDayControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('dueDay') as FormControl | null;
  });

  readonly modalConfig = computed(() => ({
    title: this.mode() === 'create' ? 'Criar Cartão de Crédito' : 'Editar Cartão de Crédito',
    subtitle:
      this.mode() === 'create'
        ? 'Preencha os dados para criar um novo cartão de crédito'
        : 'Atualize as informações do cartão de crédito',
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
    if (control.hasError('required')) return 'Nome do cartão é obrigatório';
    if (control.hasError('minlength')) return 'Nome deve ter pelo menos 3 caracteres';
    if (control.hasError('maxlength')) return 'Nome deve ter no máximo 100 caracteres';
    return '';
  });

  readonly getLimitErrorMessage = computed(() => {
    this._validationTrigger();
    const control = this.limitControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Limite é obrigatório';
    if (control.hasError('min')) return 'Limite deve ser maior que zero';
    return '';
  });

  readonly getClosingDayErrorMessage = computed(() => {
    this._validationTrigger();
    const control = this.closingDayControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Dia de fechamento é obrigatório';
    if (control.hasError('min')) return 'Dia de fechamento deve ser entre 1 e 31';
    if (control.hasError('max')) return 'Dia de fechamento deve ser entre 1 e 31';
    return '';
  });

  readonly getDueDayErrorMessage = computed(() => {
    this._validationTrigger();
    const control = this.dueDayControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Dia de vencimento é obrigatório';
    if (control.hasError('min')) return 'Dia de vencimento deve ser entre 1 e 31';
    if (control.hasError('max')) return 'Dia de vencimento deve ser entre 1 e 31';
    return '';
  });

  constructor() {
    effect(() => {
      const creditCard = this.creditCard();
      const form = this._form();
      if (form && creditCard) {
        form.patchValue({
          name: creditCard.name,
          limit: creditCard.limit / 100,
          closingDay: creditCard.closingDay,
          dueDay: creditCard.dueDay,
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
      limit: new FormControl(0, [Validators.required, Validators.min(0.01)]),
      closingDay: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(31),
      ]),
      dueDay: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(31),
      ]),
    });

    const creditCard = this.creditCard();
    if (creditCard) {
      form.patchValue({
        name: creditCard.name,
        limit: creditCard.limit / 100,
        closingDay: creditCard.closingDay,
        dueDay: creditCard.dueDay,
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
    const creditCard = this.creditCard();

    const limitInCents = Math.round((formValue.limit || 0) * 100);

    if (this.mode() === 'create') {
      this.creditCardState.createCreditCard({
        name: formValue.name,
        limit: limitInCents,
        closingDay: formValue.closingDay,
        dueDay: formValue.dueDay,
        budgetId: budgetId,
      });

      this.notificationService.showSuccess('Cartão de crédito criado com sucesso!');
      this.saved.emit();
    } else if (creditCard) {
      this.creditCardState.updateCreditCard({
        id: creditCard.id,
        name: formValue.name,
        limit: limitInCents,
        closingDay: formValue.closingDay,
        dueDay: formValue.dueDay,
      });

      this.notificationService.showSuccess('Cartão de crédito atualizado com sucesso!');
      this.saved.emit();
    }

    this.router.navigate(['/credit-cards'], { replaceUrl: true });
  }

  onCancel(): void {
    this.cancelled.emit();
    this.router.navigate(['/credit-cards'], { replaceUrl: true });
  }
}

