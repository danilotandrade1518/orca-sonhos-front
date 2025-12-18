import {
  Component,
  computed,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  effect,
} from '@angular/core';

import { Router } from '@angular/router';
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
import type { CategoryType } from '../../../../../dtos/category/category-types';

@Component({
  selector: 'os-categories-create-page',
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
    <os-page variant="default" size="medium" ariaLabel="Criar nova categoria">
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
  styleUrl: './categories-create.page.scss',
})
export class CategoriesCreatePage implements OnInit {
  private readonly categoryState = inject(CategoryState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly loading = computed(() => this.categoryState.loading());

  private readonly _form = signal<FormGroup | null>(null);
  readonly form = this._form.asReadonly();

  private readonly _validationTrigger = signal(0);

  readonly pageTitle = computed(() => 'Criar Categoria');

  readonly pageSubtitle = computed(() => 'Preencha os dados para criar uma nova categoria');

  readonly breadcrumbs = computed((): BreadcrumbItem[] => {
    return [
      { label: 'Categorias', route: '/categories' },
      { label: 'Nova', route: undefined },
    ];
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
    saveButtonText: 'Criar',
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
    const form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      description: new FormControl('', [Validators.maxLength(500)]),
      type: new FormControl<CategoryType | null>(null, [Validators.required]),
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

    const user = this.authService.currentUser();
    const budgetId = this.budgetSelection.selectedBudgetId();
    if (!user || !budgetId) {
      this.notificationService.showError('Usuário ou orçamento não selecionado');
      return;
    }

    const formValue = form.value;
    this.categoryState.createCategory({
      userId: user.id,
      budgetId,
      name: formValue.name,
      type: formValue.type as CategoryType,
      kind: 'CUSTOM',
      description: formValue.description || undefined,
    });

    this.notificationService.showSuccess('Categoria criada com sucesso!');
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
