import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
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
import { LocaleService } from '@shared/formatting';
import type { OsSelectOption } from '../../../../shared/ui-components/atoms/os-select/os-select.component';

@Component({
  selector: 'os-goal-form',
  imports: [ReactiveFormsModule, OsFormTemplateComponent, OsSelectComponent],
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
          <div class="os-goal-form__field">
            <label for="name">
              Nome
              <span aria-label="obrigatório">*</span>
            </label>
            <input
              id="name"
              type="text"
              formControlName="name"
              required
              [attr.aria-required]="true"
              [attr.aria-invalid]="form.get('name')?.invalid && form.get('name')?.touched"
              [attr.aria-describedby]="form.get('name')?.invalid && form.get('name')?.touched ? 'name-error' : null"
            />
            @if (form.get('name')?.invalid && form.get('name')?.touched) {
              <span id="name-error" class="os-goal-form__error" role="alert">
                @if (form.get('name')?.hasError('required')) {
                  Nome é obrigatório
                } @else if (form.get('name')?.hasError('maxlength')) {
                  Nome deve ter no máximo 120 caracteres
                }
              </span>
            }
          </div>

          <div class="os-goal-form__field">
            <label for="totalAmount">
              Valor alvo
              <span aria-label="obrigatório">*</span>
            </label>
            <input
              id="totalAmount"
              type="number"
              step="0.01"
              min="0.01"
              formControlName="totalAmount"
              required
              [attr.aria-required]="true"
              [attr.aria-invalid]="form.get('totalAmount')?.invalid && form.get('totalAmount')?.touched"
              [attr.aria-describedby]="form.get('totalAmount')?.invalid && form.get('totalAmount')?.touched ? 'totalAmount-error' : null"
            />
            @if (form.get('totalAmount')?.invalid && form.get('totalAmount')?.touched) {
              <span id="totalAmount-error" class="os-goal-form__error" role="alert">
                @if (form.get('totalAmount')?.hasError('required')) {
                  Valor alvo é obrigatório
                } @else if (form.get('totalAmount')?.hasError('min')) {
                  Valor deve ser maior que zero
                }
              </span>
            }
          </div>

          <div class="os-goal-form__field">
            <label for="deadline">Data-alvo (opcional)</label>
            <input
              id="deadline"
              type="date"
              formControlName="deadline"
              [attr.aria-invalid]="form.get('deadline')?.invalid && form.get('deadline')?.touched"
              [attr.aria-describedby]="form.get('deadline')?.invalid && form.get('deadline')?.touched ? 'deadline-error' : null"
            />
            @if (form.get('deadline')?.invalid && form.get('deadline')?.touched) {
              <span id="deadline-error" class="os-goal-form__error" role="alert">
                Data não pode ser no passado
              </span>
            }
          </div>

          <div class="os-goal-form__field">
            <os-select
              label="Conta de origem"
              [options]="accountOptions()"
              [value]="form.get('sourceAccountId')?.value || ''"
              [helperText]="accountsHelper.error() || ''"
              [placeholder]="
                accountsHelper.isLoading() ? 'Carregando contas...' : 'Selecione uma conta'
              "
              formControlName="sourceAccountId"
              [attr.aria-required]="true"
            />
          </div>
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
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    totalAmount: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0.01)],
    }),
    deadline: new FormControl<string | null>(null, {
      validators: [GoalFormComponent.deadlineNotPastValidator],
    }),
    sourceAccountId: new FormControl<string>('', { nonNullable: true }),
  });

  readonly suggestedMonthlyHint = computed(() => {
    const total = this.form.get('totalAmount')?.value ?? 0;
    const deadline = this.form.get('deadline')?.value as string | null;
    if (!deadline || !total || total <= 0) return '—';
    const months = this.calculateMonthsRemaining(new Date(), new Date(deadline));
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
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const budgetId = this.budgetSelection.selectedBudgetId();
    if (!budgetId) return;

    const totalAmountReais = Number(this.form.get('totalAmount')!.value);
    const totalAmountCents = Math.round(totalAmountReais * 100);

    const dto: CreateGoalDto = {
      name: this.form.get('name')!.value,
      totalAmount: totalAmountCents,
      deadline: this.form.get('deadline')!.value || undefined,
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
    const value = control.value as string | null;
    if (!value) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(value);
    if (isNaN(date.getTime())) return { invalidDate: true };
    date.setHours(0, 0, 0, 0);
    return date < today ? { minDate: true } : null;
  }
}
