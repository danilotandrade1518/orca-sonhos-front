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
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  type FormControlStatus,
} from '@angular/forms';
import { BudgetState } from '@core/services/budget/budget.state';
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
import type { BudgetType } from '../../../../../dtos/budget';

@Component({
  selector: 'os-budget-create-page',
  imports: [
    ReactiveFormsModule,
    OsPageComponent,
    OsPageHeaderComponent,
    OsFormTemplateComponent,
    OsFormFieldComponent,
    OsSelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Criar novo orçamento">
      <os-page-header
        [title]="pageTitle()"
        [subtitle]="pageSubtitle()"
        [breadcrumbs]="breadcrumbs()"
        (breadcrumbClick)="onBreadcrumbClick($event)"
      />

      <os-form-template
        [config]="formConfig()"
        [isInvalid]="isFormInvalid()"
        [saveButtonDisabled]="isSaveDisabled()"
        [loading]="loading()"
        [disabled]="loading()"
        (save)="onSave()"
        (cancelClick)="onCancel()"
      >
        @if (form()) {
        <form [formGroup]="form()!">
          <os-form-field
            label="Nome do Orçamento"
            [required]="true"
            formControlName="name"
            [control]="nameControl()"
            [errorMessage]="getNameErrorMessage()"
          />

          <os-select
            label="Tipo"
            [options]="typeOptions()"
            formControlName="type"
            [required]="true"
            [errorMessage]="getTypeErrorMessage()"
            placeholder="Selecione o tipo"
          />
        </form>
        }
      </os-form-template>
    </os-page>
  `,
  styleUrl: './budget-create.page.scss',
})
export class BudgetCreatePage implements OnInit {
  private readonly budgetState = inject(BudgetState);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly loading = computed(() => this.budgetState.loading());

  private readonly _form = signal<FormGroup | null>(null);
  readonly form = this._form.asReadonly();

  private readonly _formStatus = signal<FormControlStatus | null>(null);
  readonly formStatus = this._formStatus.asReadonly();

  readonly isFormInvalid = computed(() => this._formStatus() !== 'VALID');

  readonly isSaveDisabled = computed(() => {
    return this.loading() || this.isFormInvalid();
  });

  readonly pageTitle = computed(() => 'Criar Orçamento');

  readonly pageSubtitle = computed(() => 'Preencha os dados para criar um novo orçamento');

  readonly breadcrumbs = computed((): BreadcrumbItem[] => {
    return [
      { label: 'Orçamentos', route: '/budgets' },
      { label: 'Novo', route: undefined },
    ];
  });

  readonly nameControl = computed(() => {
    return this._form()?.get('name') as FormControl | null;
  });

  readonly typeControl = computed(() => {
    return this._form()?.get('type') as FormControl | null;
  });

  readonly typeOptions = computed<OsSelectOption[]>(() => [
    { value: 'PERSONAL', label: 'Pessoal' },
    { value: 'SHARED', label: 'Compartilhado' },
  ]);

  readonly formConfig = computed(() => ({
    title: '',
    showHeader: false,
    showActions: true,
    showSaveButton: true,
    showCancelButton: true,
    saveButtonText: 'Criar',
    cancelButtonText: 'Cancelar',
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
    effect((onCleanup) => {
      const form = this._form();

      if (!form) {
        this._formStatus.set(null);
        return;
      }

      this._formStatus.set(form.status);
      const sub = form.statusChanges.subscribe((status) => this._formStatus.set(status));
      onCleanup(() => sub.unsubscribe());
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
      type: new FormControl<BudgetType>('PERSONAL', [Validators.required]),
    });

    this._form.set(form);
  }

  onSave(): void {
    const form = this._form();
    if (!form || form.invalid) {
      form?.markAllAsTouched();
      return;
    }

    const user = this.authService.currentUser();
    if (!user) {
      this.notificationService.showError('Usuário não autenticado');
      return;
    }

    const formValue = form.value;
    this.budgetState.createBudget(formValue.name, formValue.type as 'PERSONAL' | 'SHARED', user.id);

    this.notificationService.showSuccess('Orçamento criado com sucesso!');
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
    this.router.navigate(['/budgets'], { replaceUrl: true });
  }
}
