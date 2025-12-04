import {
  Component,
  computed,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  effect,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EnvelopeState } from '@core/services/envelope/envelope-state/envelope.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { CategoriesApiService } from '@core/services/category/categories-api.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import { OsPageHeaderComponent, type BreadcrumbItem } from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
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
  selector: 'os-envelope-form-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OsPageComponent,
    OsPageHeaderComponent,
    OsFormTemplateComponent,
    OsFormFieldComponent,
    OsSelectComponent,
    OsMoneyInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Formulário de envelope">
      <os-page-header
        [title]="pageTitle()"
        [subtitle]="pageSubtitle()"
        [breadcrumbs]="breadcrumbs()"
        (breadcrumbClick)="onBreadcrumbClick($event)"
      />

      <os-form-template
        [config]="formConfig()"
        [form]="form()"
        [loading]="loading()"
        [disabled]="loading()"
        (save)="onSave()"
        (cancelClick)="onCancel()"
      >
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
    </os-page>
  `,
  styleUrl: './envelope-form.page.scss',
})
export class EnvelopeFormPage implements OnInit {
  private readonly envelopeState = inject(EnvelopeState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly categoriesApi = inject(CategoriesApiService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = computed(() => this.envelopeState.loading());
  readonly categoriesLoading = computed(() => this.categoriesApi.loading());

  private readonly _form = signal<FormGroup | null>(null);
  readonly form = this._form.asReadonly();

  private readonly _categories = signal<CategoryDto[]>([]);
  readonly categories = this._categories.asReadonly();

  private readonly _envelope = signal<EnvelopeDto | null>(null);
  readonly envelope = this._envelope.asReadonly();

  private readonly _validationTrigger = signal(0);

  readonly mode = computed<'create' | 'edit'>(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? 'edit' : 'create';
  });

  readonly pageTitle = computed(() => {
    return this.mode() === 'create' ? 'Criar Envelope' : 'Editar Envelope';
  });

  readonly pageSubtitle = computed(() => {
    return this.mode() === 'create'
      ? 'Defina um limite de gastos para uma categoria'
      : 'Atualize as informações do envelope';
  });

  readonly breadcrumbs = computed((): BreadcrumbItem[] => {
    const base: BreadcrumbItem[] = [{ label: 'Envelopes', route: '/envelopes' }];
    if (this.mode() === 'edit' && this.envelope()) {
      base.push({ label: this.envelope()!.name, route: undefined });
    }
    base.push({ label: this.mode() === 'create' ? 'Novo' : 'Editar', route: undefined });
    return base;
  });

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

  readonly formConfig = computed(() => ({
    title: '',
    showHeader: false,
    showProgress: false,
    showActions: true,
    showSaveButton: true,
    showCancelButton: true,
    saveButtonText: this.mode() === 'create' ? 'Criar' : 'Salvar',
    cancelButtonText: 'Cancelar',
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
      limit: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    });

    const envelopeId = this.route.snapshot.paramMap.get('id');
    if (envelopeId) {
      this.loadEnvelope(envelopeId);
    }

    this._form.set(form);

    this.loadCategories();
  }

  private loadEnvelope(id: string): void {
    const envelopes = this.envelopeState.envelopesByBudgetId();
    const envelope = envelopes.find((e) => e.id === id);
    if (envelope) {
      this._envelope.set(envelope);
      const form = this._form();
      if (form) {
        form.patchValue({
          name: envelope.name,
          categoryId: envelope.categoryId,
          limit: envelope.limit / 100,
        });
      }
    } else {
      this.notificationService.showError('Envelope não encontrado');
      this.navigateBack();
    }
  }

  private loadCategories(): void {
    const budgetId = this.budgetSelection.selectedBudgetId();
    if (!budgetId) {
      this.notificationService.showError('Nenhum orçamento selecionado');
      this.navigateBack();
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

  onSave(): void {
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
      this.navigateBack();
    } else if (envelope) {
      this.envelopeState.updateEnvelope({
        envelopeId: envelope.id,
        budgetId,
        name: formValue.name,
        limit: limitInCents,
      });

      this.notificationService.showSuccess('Envelope atualizado com sucesso!');
      this.navigateBack();
    }
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
    this.router.navigate(['/envelopes'], { replaceUrl: true });
  }
}

