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
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import type { CreditCardBillDto } from '../../../../../dtos/credit-card';

@Component({
  selector: 'os-reopen-bill-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OsModalTemplateComponent,
    OsFormTemplateComponent,
    OsFormFieldComponent,
    MatInputModule,
    MatFormFieldModule,
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
          <mat-form-field appearance="outline">
            <mat-label>Justificativa</mat-label>
            <textarea
              matInput
              formControlName="justification"
              placeholder="Descreva o motivo da reabertura da fatura"
              [required]="true"
              rows="4"
            ></textarea>
            @if (getJustificationErrorMessage()) {
            <mat-error>{{ getJustificationErrorMessage() }}</mat-error>
            }
          </mat-form-field>
        </div>
        }
      </os-form-template>
    </os-modal-template>
  `,
  styleUrl: './reopen-bill-modal.component.scss',
})
export class ReopenBillModalComponent implements OnInit {
  private readonly creditCardState = inject(CreditCardState);
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

  readonly justificationControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('justification') as FormControl | null;
  });

  readonly modalConfig = computed(() => ({
    title: 'Reabrir Fatura',
    subtitle: 'Informe o motivo da reabertura da fatura',
    showActions: true,
    showCancelButton: true,
    showConfirmButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Reabrir',
  }));

  readonly formConfig = computed(() => ({
    title: '',
    showHeader: false,
    showProgress: false,
    showActions: false,
  }));

  readonly getJustificationErrorMessage = computed(() => {
    this._validationTrigger();
    const control = this.justificationControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Justificativa é obrigatória';
    if (control.hasError('minlength')) return 'Justificativa deve ter pelo menos 10 caracteres';
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
      justification: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500),
      ]),
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

    this.creditCardState.reopenCreditCardBill({
      creditCardBillId: bill.id,
      userId: user.id,
      budgetId: budgetId,
      justification: formValue.justification,
    });

    this.notificationService.showSuccess('Fatura reaberta com sucesso!');
    this.closed.emit();
    this.router.navigate(['/credit-cards'], { replaceUrl: true });
  }

  onCancel(): void {
    this.closed.emit();
    this.router.navigate(['/credit-cards'], { replaceUrl: true });
  }
}

