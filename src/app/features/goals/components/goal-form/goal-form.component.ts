import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { OsFormTemplateComponent } from '../../../../shared/ui-components/templates/os-form-template/os-form-template.component';
import type { FormTemplateConfig } from '../../../../shared/ui-components/templates/os-form-template/os-form-template.component';
import type { CreateGoalDto } from '../../../../../dtos/goal/create-goal-request-dto';
import { BudgetSelectionService } from '../../../../core/services/budget-selection/budget-selection.service';
import { AccountsHelperService } from '../../services/accounts-helper/accounts-helper.service';
import { OsSelectComponent } from '../../../../shared/ui-components/atoms/os-select/os-select.component';
import { OsFormFieldComponent } from '../../../../shared/ui-components/molecules/os-form-field/os-form-field.component';
import { OsDatePickerComponent } from '../../../../shared/ui-components/molecules/os-date-picker/os-date-picker.component';
import { LocaleService } from '@shared/formatting';
import type { OsSelectOption } from '../../../../shared/ui-components/atoms/os-select/os-select.component';

@Component({
  selector: 'os-goal-form',
  imports: [
    ReactiveFormsModule,
    OsFormTemplateComponent,
    OsSelectComponent,
    OsFormFieldComponent,
    OsDatePickerComponent,
  ],
  template: `
    <os-form-template
      [config]="formConfig()"
      [disabled]="loading()"
      [isInvalid]="form.invalid"
      [saveButtonDisabled]="loading() || form.invalid"
      [loading]="loading()"
      (save)="onSubmit()"
      (cancelClick)="cancelled.emit()"
    >
      <form [formGroup]="form" class="os-goal-form" aria-label="Formulário de meta">
        <div class="os-goal-form__grid">
          <os-form-field
            label="Nome"
            type="text"
            [required]="true"
            [control]="nameControl()"
            [errorMessage]="getNameErrorMessage()"
            [maxLength]="50"
          />

          <os-form-field
            label="Valor alvo"
            type="number"
            [required]="true"
            [control]="totalAmountControl()"
            [errorMessage]="getTotalAmountErrorMessage()"
            placeholder="0.00"
          />

          <div class="os-goal-form__date-field">
            <os-date-picker
              label="Data-alvo (opcional)"
              formControlName="deadline"
              [minDate]="minDateValue()"
              placeholder="Selecionar data"
            />
            @if (getDeadlineErrorMessage()) {
              <span class="os-goal-form__error" role="alert">
                {{ getDeadlineErrorMessage() }}
              </span>
            }
          </div>

          <os-select
            label="Conta de origem"
            [options]="accountOptions()"
            [value]="form.get('sourceAccountId')?.value || ''"
            [helperText]="accountsHelper.error() || ''"
            [placeholder]="
              accountsHelper.isLoading() ? 'Carregando contas...' : 'Selecione uma conta'
            "
            formControlName="sourceAccountId"
            [required]="true"
          />
        </div>

        <p class="os-goal-form__hint" aria-live="polite" role="note">
          Aporte mensal sugerido: {{ suggestedMonthlyHint() }}
        </p>
      </form>
    </os-form-template>
  `,
  styleUrl: './goal-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly budgetSelection = inject(BudgetSelectionService);
  readonly accountsHelper = inject(AccountsHelperService);
  private readonly localeService = inject(LocaleService);

  readonly loading = input(false);
  readonly initialData = input<Partial<CreateGoalDto> | null>(null);
  readonly formTitle = input('Nova Meta');

  readonly save = output<CreateGoalDto>();
  readonly cancelled = output<void>();

  readonly formConfig = computed<FormTemplateConfig>(() => ({
    title: this.formTitle(),
    showSaveButton: true,
    showCancelButton: true,
    saveButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
    showActions: true,
  }));

  readonly form: FormGroup = this.fb.group({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
    }),
    totalAmount: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0.01)],
    }),
    deadline: new FormControl<Date | null>(null, {
      validators: [GoalFormComponent.deadlineNotPastValidator],
    }),
    sourceAccountId: new FormControl<string>('', { nonNullable: true }),
  });

  private readonly _formValidityTick = signal(0);

  readonly suggestedMonthlyHint = computed(() => {
    const total = this.form.get('totalAmount')?.value ?? 0;
    const deadline = this.form.get('deadline')?.value as Date | null;
    if (!deadline || !total || total <= 0) return '—';
    const months = this.calculateMonthsRemaining(new Date(), deadline);
    if (months <= 0) return '—';
    const current = 0;
    const remaining = Math.max(total - current, 0);
    const suggested = remaining / months;
    return this.localeService.formatCurrency(Math.round(suggested * 100) / 100, 'BRL');
  });

  readonly accountOptions = computed<OsSelectOption[]>(() => {
    return this.accountsHelper.accounts().map((account) => ({
      value: account.id,
      label: account.name,
      disabled: false,
    }));
  });

  readonly nameControl = computed(() => {
    return this.form.get('name') as FormControl | null;
  });

  readonly totalAmountControl = computed(() => {
    return this.form.get('totalAmount') as FormControl | null;
  });

  readonly deadlineControl = computed(() => {
    return this.form.get('deadline') as FormControl | null;
  });

  readonly getNameErrorMessage = computed(() => {
    this._formValidityTick();
    const control = this.nameControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Nome é obrigatório';
    if (control.hasError('minlength')) return 'Nome deve ter pelo menos 2 caracteres';
    if (control.hasError('maxlength')) return 'Nome deve ter no máximo 50 caracteres';
    return '';
  });

  readonly getTotalAmountErrorMessage = computed(() => {
    this._formValidityTick();
    const control = this.totalAmountControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Valor alvo é obrigatório';
    if (control.hasError('min')) return 'Valor deve ser maior que zero';
    return '';
  });

  readonly minDateValue = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  readonly getDeadlineErrorMessage = computed(() => {
    this._formValidityTick();
    const control = this.deadlineControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('minDate')) return 'Data não pode ser no passado';
    return '';
  });

  constructor() {
    effect(() => {
      const budgetId = this.budgetSelection.selectedBudgetId();
      if (budgetId) {
        this.accountsHelper.loadAccounts(budgetId).subscribe();
      }
    });

    effect(() => {
      const isLoading = this.loading() || this.accountsHelper.isLoading();
      const sourceAccountControl = this.form.get('sourceAccountId');
      if (sourceAccountControl) {
        if (isLoading) {
          sourceAccountControl.disable();
        } else {
          sourceAccountControl.enable();
        }
      }
    });

    effect((onCleanup) => {
      const form = this.form;
      if (!form) return;

      this._formValidityTick.update((v) => v + 1);

      const sub = form.statusChanges.subscribe(() => {
        this._formValidityTick.update((v) => v + 1);
      });

      onCleanup(() => sub.unsubscribe());
    });

    effect(() => {
      const initialData = this.initialData();
      if (initialData) {
        const nameControl = this.form.get('name');
        const totalAmountControl = this.form.get('totalAmount');
        const deadlineControl = this.form.get('deadline');
        const sourceAccountControl = this.form.get('sourceAccountId');

        if (nameControl && initialData.name) {
          nameControl.setValue(initialData.name);
        }
        if (totalAmountControl && initialData.totalAmount !== undefined) {
          totalAmountControl.setValue(initialData.totalAmount / 100);
        }
        if (deadlineControl && initialData.deadline) {
          const deadlineDate = new Date(initialData.deadline);
          if (!isNaN(deadlineDate.getTime())) {
            deadlineControl.setValue(deadlineDate);
          }
        }
        if (sourceAccountControl && initialData.sourceAccountId) {
          sourceAccountControl.setValue(initialData.sourceAccountId);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._formValidityTick.update((v) => v + 1);
      return;
    }
    const budgetId = this.budgetSelection.selectedBudgetId();
    if (!budgetId) return;

    const totalAmountReais = Number(this.form.get('totalAmount')!.value);
    const totalAmountCents = Math.round(totalAmountReais * 100);

    const deadlineValue = this.form.get('deadline')!.value as Date | null;
    const deadlineString = deadlineValue ? deadlineValue.toISOString().split('T')[0] : undefined;

    const dto: CreateGoalDto = {
      name: this.form.get('name')!.value,
      totalAmount: totalAmountCents,
      deadline: deadlineString,
      accumulatedAmount: 0,
      budgetId,
      sourceAccountId: this.form.get('sourceAccountId')!.value,
    };

    this.save.emit(dto);
  }

  private calculateMonthsRemaining(start: Date, end: Date): number {
    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();
    const dayDiff = end.getDate() - start.getDate();
    let months = yearDiff * 12 + monthDiff;
    if (dayDiff < 0) months -= 1;
    return Math.max(months, 0);
  }

  static deadlineNotPastValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as Date | string | null;
    if (!value) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return { invalidDate: true };
    date.setHours(0, 0, 0, 0);
    return date < today ? { minDate: true } : null;
  }
}
