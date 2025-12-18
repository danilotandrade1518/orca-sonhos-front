import {
  Component,
  computed,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  effect,
} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryState } from '@core/services/category/category.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import {
  OsPageHeaderComponent,
  type BreadcrumbItem,
} from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import { OsFormTemplateComponent } from '@shared/ui-components/templates/os-form-template/os-form-template.component';
import { OsFormFieldComponent } from '@shared/ui-components/molecules/os-form-field/os-form-field.component';
import {
  OsSelectComponent,
  type OsSelectOption,
} from '@shared/ui-components/atoms/os-select/os-select.component';
import { OsInputComponent } from '@shared/ui-components/atoms/os-input/os-input.component';
import type { CategoryDto, CategoryType } from '../../../../../dtos/category/category-types';

@Component({
  selector: 'os-categories-edit-page',
  imports: [
    ReactiveFormsModule,
    OsPageComponent,
    OsPageHeaderComponent,
    OsFormTemplateComponent,
    OsFormFieldComponent,
    OsSelectComponent,
    OsInputComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Editar categoria">
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
            label="Nome da Categoria"
            [required]="true"
            [control]="nameControl()"
            [errorMessage]="getNameErrorMessage()"
          />

          <os-form-field
            label="Descrição"
            [control]="descriptionControl()"
            [errorMessage]="getDescriptionErrorMessage()"
          >
            <os-input formControlName="description" placeholder="Descrição opcional da categoria" />
          </os-form-field>

          <os-select
            label="Tipo"
            [options]="typeOptions()"
            formControlName="type"
            [required]="true"
            [errorMessage]="getTypeErrorMessage()"
            placeholder="Selecione o tipo"
          />
        </div>
        }
      </os-form-template>
    </os-page>
  `,
  styleUrl: './categories-edit.page.scss',
})
export class CategoriesEditPage implements OnInit {
  private readonly categoryState = inject(CategoryState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = computed(() => this.categoryState.loading());

  private readonly _form = signal<FormGroup | null>(null);
  readonly form = this._form.asReadonly();

  private readonly _validationTrigger = signal(0);
  private readonly _categoryId = signal<string | null>(null);

  readonly category = computed(() => {
    const id = this._categoryId();
    if (!id) return null;

    return this.categoryState.getCategoryById(id) || null;
  });

  readonly pageTitle = computed(() => {
    const category = this.category();
    return category ? `Editar ${category.name}` : 'Editar Categoria';
  });

  readonly pageSubtitle = computed(() => 'Atualize as informações da categoria');

  readonly breadcrumbs = computed((): BreadcrumbItem[] => {
    const category = this.category();
    const base: BreadcrumbItem[] = [{ label: 'Categorias', route: '/categories' }];
    if (category) {
      base.push({ label: category.name, route: undefined });
    }
    base.push({ label: 'Editar', route: undefined });
    return base;
  });

  readonly nameControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('name') as FormControl | null;
  });

  readonly descriptionControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('description') as FormControl | null;
  });

  readonly typeControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('type') as FormControl | null;
  });

  readonly typeOptions = computed<OsSelectOption[]>(() => [
    { value: 'EXPENSE', label: 'Despesa' },
    { value: 'INCOME', label: 'Receita' },
    { value: 'TRANSFER', label: 'Transferência' },
  ]);

  readonly formConfig = computed(() => ({
    title: '',
    showHeader: false,
    showProgress: false,
    showActions: true,
    showSaveButton: true,
    showCancelButton: true,
    saveButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
  }));

  readonly getNameErrorMessage = computed(() => {
    this._validationTrigger();
    const control = this.nameControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Nome da categoria é obrigatório';
    if (control.hasError('minlength')) return 'Nome deve ter pelo menos 2 caracteres';
    if (control.hasError('maxlength')) return 'Nome deve ter no máximo 100 caracteres';
    return '';
  });

  readonly getDescriptionErrorMessage = computed(() => {
    this._validationTrigger();
    const control = this.descriptionControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('maxlength')) return 'Descrição deve ter no máximo 500 caracteres';
    return '';
  });

  readonly getTypeErrorMessage = computed(() => {
    this._validationTrigger();
    const control = this.typeControl();
    if (!control || !control.touched) return '';
    if (control.hasError('required')) return 'Tipo da categoria é obrigatório';
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
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (!categoryId) {
      this.notificationService.showError('ID da categoria não encontrado');
      this.navigateBack();
      return;
    }

    this._categoryId.set(categoryId);

    const budgetId = this.budgetSelection.selectedBudgetId();
    if (!budgetId) {
      this.notificationService.showError('Nenhum orçamento selecionado');
      this.navigateBack();
      return;
    }

    if (this.categoryState.categoriesByBudgetId().length === 0) {
      this.categoryState.loadCategories(true);
    }

    const category = this.category();
    if (!category) {
      this.notificationService.showError('Categoria não encontrada');
      this.navigateBack();
      return;
    }

    const form = new FormGroup({
      name: new FormControl(category.name, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      description: new FormControl(category.description || '', [Validators.maxLength(500)]),
      type: new FormControl<CategoryType>(category.type, [Validators.required]),
    });

    this._form.set(form);
  }

  onSave(): void {
    const form = this._form();
    if (!form || form.invalid) {
      form?.markAllAsTouched();
      this._validationTrigger.update((v) => v + 1);
      return;
    }

    const categoryId = this._categoryId();
    const user = this.authService.currentUser();
    if (!categoryId || !user) {
      this.notificationService.showError('Dados insuficientes para atualizar a categoria');
      return;
    }

    const formValue = form.value;
    this.categoryState.updateCategory({
      id: categoryId,
      userId: user.id,
      name: formValue.name,
      type: formValue.type as CategoryType,
      description: formValue.description || undefined,
    });

    this.notificationService.showSuccess('Categoria atualizada com sucesso!');
    this.navigateBack();
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
    this.router.navigate(['/categories'], { replaceUrl: true });
  }
}
