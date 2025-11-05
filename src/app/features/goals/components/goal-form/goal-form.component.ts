import { CommonModule } from '@angular/common';
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
import type { OsSelectOption } from '../../../../shared/ui-components/atoms/os-select/os-select.component';

@Component({
  selector: 'os-goal-form',
  imports: [CommonModule, ReactiveFormsModule, OsFormTemplateComponent, OsSelectComponent],
  template: `
    <os-form-template
      [config]="formConfig()"
      [disabled]="loading() || form.invalid"
      [loading]="loading()"
      [form]="form"
      (save)="onSubmit()"
      (cancelClick)="cancelled.emit()"
    >
      <form [formGroup]="form" class="os-goal-form" aria-label="Formulário de meta">
        <div class="os-goal-form__grid">
          <div class="os-goal-form__field">
            <label for="name">Nome</label>
            <input id="name" type="text" formControlName="name" required />
          </div>

          <div class="os-goal-form__field">
            <label for="totalAmount">Valor alvo</label>
            <input
              id="totalAmount"
              type="number"
              step="0.01"
              min="0.01"
              formControlName="totalAmount"
              required
            />
          </div>

          <div class="os-goal-form__field">
            <label for="deadline">Data-alvo (opcional)</label>
            <input id="deadline" type="date" formControlName="deadline" />
          </div>

          <div class="os-goal-form__field">
            <os-select
              label="Conta de origem"
              [options]="accountOptions()"
              [value]="form.get('sourceAccountId')?.value || ''"
              [disabled]="loading() || accountsHelper.isLoading()"
              [helperText]="accountsHelper.error() || ''"
              [placeholder]="
                accountsHelper.isLoading() ? 'Carregando contas...' : 'Selecione uma conta'
              "
              formControlName="sourceAccountId"
            />
          </div>
        </div>

        <p class="os-goal-form__hint" aria-live="polite">
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
    showProgress: false,
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
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
      Math.round(suggested * 100) / 100
    );
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
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const budgetId = this.budgetSelection.selectedBudgetId();
    if (!budgetId) return;

    const dto: CreateGoalDto = {
      name: this.form.get('name')!.value,
      totalAmount: Number(this.form.get('totalAmount')!.value),
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
