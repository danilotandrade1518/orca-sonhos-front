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
import { BudgetDto, BudgetType } from '../../../../../dtos/budget';
import { BudgetState } from '@core/services/budget/budget.state';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { OsModalTemplateComponent } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import { OsFormTemplateComponent } from '@shared/ui-components/templates/os-form-template/os-form-template.component';
import { OsFormFieldComponent } from '@shared/ui-components/molecules/os-form-field/os-form-field.component';
import { OsDropdownComponent } from '@shared/ui-components/molecules/os-dropdown/os-dropdown.component';
import type { OsDropdownOption } from '@shared/ui-components/molecules/os-dropdown/os-dropdown.component';

@Component({
  selector: 'os-budget-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OsModalTemplateComponent,
    OsFormTemplateComponent,
    OsFormFieldComponent,
    OsDropdownComponent,
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
        <os-form-field
          label="Nome do Orçamento"
          [required]="true"
          [control]="nameControl()"
          [errorMessage]="getNameErrorMessage()"
        />

        <div class="budget-form__type-field">
          <os-form-field
            label="Tipo"
            [required]="true"
            [control]="typeControl()"
            [errorMessage]="getTypeErrorMessage()"
          />
        </div>
        <os-dropdown
          [options]="typeOptions()"
          [selectedValue]="typeControl()?.value ?? 'PERSONAL'"
          [disabled]="loading()"
          (valueChange)="onTypeChange($event)"
          size="medium"
          variant="default"
          placeholder="Selecione o tipo"
          ariaLabel="Tipo de orçamento"
        />
      </os-form-template>
    </os-modal-template>
  `,
  styleUrl: './budget-form.component.scss',
})
export class BudgetFormComponent implements OnInit {
  private readonly budgetState = inject(BudgetState);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  readonly budget = input<BudgetDto | null>(null);
  readonly mode = input<'create' | 'edit'>('create');

  readonly saved = output<void>();
  readonly cancelled = output<void>();

  readonly loading = computed(() => this.budgetState.loading());

  private readonly _form = signal<FormGroup | null>(null);
  readonly form = this._form.asReadonly();

  readonly nameControl = computed(() => this._form()?.get('name') as FormControl | null);
  readonly typeControl = computed(() => this._form()?.get('type') as FormControl | null);

  readonly typeOptions = computed<OsDropdownOption[]>(() => [
    { value: 'PERSONAL', label: 'Pessoal' },
    { value: 'SHARED', label: 'Compartilhado' },
  ]);

  readonly modalConfig = computed(() => ({
    title: this.mode() === 'create' ? 'Criar Orçamento' : 'Editar Orçamento',
    subtitle:
      this.mode() === 'create'
        ? 'Preencha os dados para criar um novo orçamento'
        : 'Atualize as informações do orçamento',
    showActions: true,
    showCancelButton: true,
    showConfirmButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: this.mode() === 'create' ? 'Criar' : 'Salvar',
    persona: 'ana' as const,
  }));

  readonly formConfig = computed(() => ({
    title: '',
    persona: 'ana' as const,
    showHeader: false,
    showProgress: false,
    showActions: false,
  }));

  readonly getNameErrorMessage = computed(() => {
    const control = this.nameControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Nome do orçamento é obrigatório';
    if (control.hasError('minlength')) return 'Nome deve ter pelo menos 3 caracteres';
    if (control.hasError('maxlength')) return 'Nome deve ter no máximo 100 caracteres';
    return '';
  });

  readonly getTypeErrorMessage = computed(() => {
    const control = this.typeControl();
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'Tipo do orçamento é obrigatório';
    return '';
  });

  constructor() {
    effect(() => {
      const budget = this.budget();
      const form = this._form();
      if (form && budget) {
        form.patchValue({
          name: budget.name,
          type: budget.type,
        });
      }
    });
  }

  ngOnInit(): void {
    const initialBudget = this.budget();
    const form = new FormGroup({
      name: new FormControl(initialBudget?.name || '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      type: new FormControl<BudgetType>((initialBudget?.type || 'PERSONAL') as BudgetType, [
        Validators.required,
      ]),
    });

    this._form.set(form);
  }

  onTypeChange(value: string | number | boolean): void {
    const control = this.typeControl();
    if (control) {
      control.setValue(value as BudgetType);
      control.markAsTouched();
    }
  }

  onSubmit(): void {
    const form = this._form();
    if (!form || !form.valid) {
      form?.markAllAsTouched();
      return;
    }

    const user = this.authService.currentUser();
    if (!user) {
      this.notificationService.showError('Usuário não autenticado');
      return;
    }

    const formValue = form.value;
    const currentBudget = this.budget();

    if (this.mode() === 'create') {
      this.budgetState.createBudget(formValue.name, formValue.type, user.id);
      this.notificationService.showSuccess('Orçamento criado com sucesso!');
      this.saved.emit();
      this.onCancel();
    } else if (currentBudget) {
      this.budgetState.updateBudget(user.id, currentBudget.id, formValue.name);
      this.notificationService.showSuccess('Orçamento atualizado com sucesso!');
      this.saved.emit();
      this.onCancel();
    }
  }

  onCancel(): void {
    this.cancelled.emit();
    this.router.navigate(['/budgets']);
  }
}
