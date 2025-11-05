import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  OsModalTemplateComponent,
  type ModalTemplateConfig,
} from '../../../../shared/ui-components/templates/os-modal-template/os-modal-template.component';

@Component({
  selector: 'os-goal-amount-modal',
  imports: [CommonModule, ReactiveFormsModule, OsModalTemplateComponent],
  template: `
    <os-modal-template
      [config]="modalConfig()"
      [disabled]="submitting()"
      [loading]="submitting()"
      [valid]="form.valid"
      (confirmed)="onSubmit()"
      (cancelled)="cancelled.emit()"
      (closed)="cancelled.emit()"
    >
      <form
        [formGroup]="form"
        class="os-goal-amount-modal__form"
        aria-label="Formulário de {{ mode() === 'add' ? 'adicionar' : 'remover' }} aporte"
      >
        <div
          class="os-goal-amount-modal__error"
          role="alert"
          aria-live="assertive"
          [attr.aria-hidden]="!error()"
        >
          {{ error() || '' }}
        </div>

        <div class="os-goal-amount-modal__field">
          <label for="amount">Valor</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            formControlName="amount"
            required
            [attr.aria-describedby]="error() ? 'amount-error' : null"
            [attr.aria-invalid]="form.get('amount')?.invalid && form.get('amount')?.touched"
          />
          @if (form.get('amount')?.invalid && form.get('amount')?.touched) {
          <span id="amount-error" class="os-goal-amount-modal__field-error">
            {{ getAmountError() }}
          </span>
          }
        </div>

        @if (mode() === 'remove') {
        <div class="os-goal-amount-modal__info">
          <p>
            <strong>Valor atual acumulado:</strong>
            {{ currentAmount() | currency : 'BRL' : 'symbol-narrow' : '1.2-2' : 'pt' }}
          </p>
          <p>
            <strong>Valor após remoção:</strong>
            {{ remainingAfter() | currency : 'BRL' : 'symbol-narrow' : '1.2-2' : 'pt' }}
          </p>
        </div>
        }
      </form>
    </os-modal-template>
  `,
  styleUrl: './goal-amount-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalAmountModalComponent {
  private readonly fb = inject(FormBuilder);

  readonly mode = input<'add' | 'remove'>('add');
  readonly goalId = input.required<string>();
  readonly currentAmount = input(0);
  readonly submitting = input(false);
  readonly error = input<string | null>(null);

  readonly save = output<{ goalId: string; amount: number }>();
  readonly cancelled = output<void>();

  readonly form: FormGroup = this.fb.group({
    amount: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0.01), this.amountValidator.bind(this)],
    }),
  });

  readonly modalConfig = computed<ModalTemplateConfig>(() => ({
    title: this.mode() === 'add' ? 'Adicionar Aporte' : 'Remover Aporte',
    subtitle:
      this.mode() === 'add'
        ? 'Informe o valor a ser adicionado à meta'
        : 'Informe o valor a ser removido da meta',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: this.mode() === 'add' ? 'Adicionar' : 'Remover',
    cancelButtonText: 'Cancelar',
  }));

  readonly remainingAfter = computed(() => {
    const amount = this.form.get('amount')?.value as number | null;
    if (!amount || amount <= 0) return this.currentAmount();
    return Math.max(this.currentAmount() - amount, 0);
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const amount = Number(this.form.get('amount')!.value);
    this.save.emit({ goalId: this.goalId(), amount });
  }

  getAmountError(): string {
    const control = this.form.get('amount');
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) return 'Valor é obrigatório';
    if (control.errors['min']) return 'Valor deve ser maior que zero';
    if (control.errors['invalidAmount']) return control.errors['invalidAmount'];
    return 'Valor inválido';
  }

  private amountValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value as number | null;
    if (!value || value <= 0) return null;

    if (this.mode() === 'remove') {
      const remaining = this.currentAmount() - value;
      if (remaining < 0) {
        return { invalidAmount: 'Não é possível remover valor que resulte em saldo negativo' };
      }
    }

    return null;
  }
}
