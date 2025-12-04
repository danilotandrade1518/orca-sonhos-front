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
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EnvelopeState } from '@core/services/envelope/envelope-state/envelope.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { CategoriesApiService } from '@core/services/category/categories-api.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { OsModalTemplateComponent } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import { OsFormTemplateComponent } from '@shared/ui-components/templates/os-form-template/os-form-template.component';
import { OsFormFieldComponent } from '@shared/ui-components/molecules/os-form-field/os-form-field.component';
import {
  OsSelectComponent,
  type OsSelectOption,
} from '@shared/ui-components/atoms/os-select/os-select.component';
import { OsMoneyInputComponent } from '@shared/ui-components/atoms/os-money-input/os-money-input.component';
import type { EnvelopeDto } from '../../../../../dtos/envelope';
import type { CategoryDto } from '../../../../../dtos/category';

@Component({
  selector: 'os-envelope-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OsModalTemplateComponent,
    OsFormTemplateComponent,
    OsFormFieldComponent,
    OsSelectComponent,
    OsMoneyInputComponent,
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
            label="Nome do Envelope"
            [required]="true"
            [control]="nameControl()"
            [errorMessage]="getNameErrorMessage()"
          />

          <os-select
            label="Categoria"
            [options]="categoryOptions()"
            formControlName="categoryId"
            [required]="true"
            [errorMessage]="getCategoryErrorMessage()"
            [placeholder]="categoriesLoading() ? 'Carregando categorias...' : 'Selecione uma categoria'"
          />

          <os-money-input
            label="Limite Mensal"
            formControlName="limit"
            [errorMessage]="getLimitErrorMessage()"
            placeholder="0,00"
            [allowNegative]="false"
            [required]="true"
          />
        </div>
        }
      </os-form-template>
    </os-modal-template>
  `,
  styleUrl: './envelope-form.component.scss',
})
export class EnvelopeFormComponent implements OnInit {
  private readonly envelopeState = inject(EnvelopeState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly categoriesApi = inject(CategoriesApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly envelope = input<EnvelopeDto | null>(null);
  readonly mode = input<'create' | 'edit'>('create');

  readonly saved = output<void>();
  readonly cancelled = output<void>();

  readonly loading = computed(() => this.envelopeState.loading());
  readonly categoriesLoading = computed(() => this.categoriesApi.loading());

  private readonly _form = signal<FormGroup | null>(null);
  readonly form = this._form.asReadonly();

  private readonly _categories = signal<CategoryDto[]>([]);
  readonly categories = this._categories.asReadonly();

  private readonly _validationTrigger = signal(0);

  readonly nameControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('name') as FormControl | null;
  });

  readonly categoryControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('categoryId') as FormControl | null;
  });

  readonly limitControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('limit') as FormControl | null;
  });

  readonly categoryOptions = computed<OsSelectOption[]>(() => {
    return this._categories().map((category) => ({
      value: category.id,
      label: category.name,
      disabled: !category.active,
    }));
  });

  readonly modalConfig = computed(() => ({
    title: this.mode() === 'create' ? 'Criar Envelope' : 'Editar Envelope',
    subtitle:
      this.mode() === 'create'
        ? 'Defina um limite de gastos para uma categoria'
        : 'Atualize as informações do envelope',
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
    if (control.hasError('required')) return 'Nome do envelope é obrigatório';
    if (control.hasError('minlength')) return 'Nome deve ter pelo menos 3 caracteres';
    if (control.hasError('maxlength')) return 'Nome deve ter no máximo 100 caracteres';
    return '';
  });

  readonly getCategoryErrorMessage = computed(() => {
    this._validationTrigger();
    const control = this.categoryControl();
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'Categoria é obrigatória';
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

  constructor() {
    effect(() => {
      const envelope = this.envelope();
      const form = this._form();
      if (form && envelope) {
        form.patchValue({
          name: envelope.name,
          categoryId: envelope.categoryId,
          limit: envelope.limit / 100,
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
      categoryId: new FormControl<string | null>(null, [Validators.required]),
      limit: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    });

    const envelope = this.envelope();
    if (envelope) {
      form.patchValue({
        name: envelope.name,
        categoryId: envelope.categoryId,
        limit: envelope.limit / 100,
      });
    }

    this._form.set(form);

    this.loadCategories();
  }

  private loadCategories(): void {
    const budgetId = this.budgetSelection.selectedBudgetId();
    if (!budgetId) {
      this.notificationService.showError('Nenhum orçamento selecionado');
      return;
    }

    this.categoriesApi
      .listCategories(budgetId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => {
          this._categories.set(categories.filter((c) => c.active));
        },
        error: () => {
          this.notificationService.showError('Erro ao carregar categorias');
        },
      });
  }

  onSubmit(): void {
    const form = this._form();
    if (!form || form.invalid) {
      form?.markAllAsTouched();
      this._validationTrigger.update((v) => v + 1);
      return;
    }

    const budgetId = this.budgetSelection.selectedBudgetId();
    if (!budgetId) {
      this.notificationService.showError('Nenhum orçamento selecionado');
      return;
    }

    const formValue = form.value;
    const envelope = this.envelope();

    const limitInCents = Math.round((formValue.limit || 0) * 100);

    if (this.mode() === 'create') {
      this.envelopeState.createEnvelope({
        budgetId,
        categoryId: formValue.categoryId,
        name: formValue.name,
        limit: limitInCents,
      });

      this.notificationService.showSuccess('Envelope criado com sucesso!');
      this.saved.emit();
    } else if (envelope) {
      this.envelopeState.updateEnvelope({
        envelopeId: envelope.id,
        budgetId,
        name: formValue.name,
        limit: limitInCents,
      });

      this.notificationService.showSuccess('Envelope atualizado com sucesso!');
      this.saved.emit();
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}

