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
import { CreditCardState } from '@core/services/credit-card/credit-card-state/credit-card.state';
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
import { OsInputComponent } from '@shared/ui-components/atoms/os-input/os-input.component';
import { OsMoneyInputComponent } from '@shared/ui-components/atoms/os-money-input/os-money-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'os-credit-cards-create-page',
  imports: [
    ReactiveFormsModule,
    OsPageComponent,
    OsPageHeaderComponent,
    OsFormTemplateComponent,
    OsFormFieldComponent,
    OsInputComponent,
    OsMoneyInputComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Criar novo cartão de crédito">
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
            label="Nome do Cartão"
            [required]="true"
            [control]="nameControl()"
            [errorMessage]="getNameErrorMessage()"
          >
            <os-input
              slot="input"
              type="text"
              formControlName="name"
              placeholder="Ex: Cartão Nubank"
              [required]="true"
            />
          </os-form-field>

          <os-money-input
            label="Limite"
            formControlName="limit"
            [errorMessage]="getLimitErrorMessage()"
            placeholder="0,00"
            [allowNegative]="false"
            [required]="true"
          />

          <mat-form-field appearance="outline">
            <mat-label>Dia de Fechamento</mat-label>
            <input
              matInput
              type="number"
              formControlName="closingDay"
              placeholder="1-31"
              min="1"
              max="31"
              required
            />
            @if (getClosingDayErrorMessage()) {
            <mat-error>{{ getClosingDayErrorMessage() }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Dia de Vencimento</mat-label>
            <input
              matInput
              type="number"
              formControlName="dueDay"
              placeholder="1-31"
              min="1"
              max="31"
              required
            />
            @if (getDueDayErrorMessage()) {
            <mat-error>{{ getDueDayErrorMessage() }}</mat-error>
            }
          </mat-form-field>
        </div>
        }
      </os-form-template>
    </os-page>
  `,
  styleUrl: './credit-cards-create.page.scss',
})
export class CreditCardsCreatePage implements OnInit {
  private readonly creditCardState = inject(CreditCardState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly loading = computed(() => this.creditCardState.loading());

  private readonly _form = signal<FormGroup | null>(null);
  readonly form = this._form.asReadonly();

  private readonly _validationTrigger = signal(0);

  readonly pageTitle = computed(() => 'Criar Cartão de Crédito');

  readonly pageSubtitle = computed(() => 'Preencha os dados para criar um novo cartão de crédito');

  readonly breadcrumbs = computed((): BreadcrumbItem[] => {
    return [
      { label: 'Cartões de Crédito', route: '/credit-cards' },
      { label: 'Novo', route: undefined },
    ];
  });

  readonly nameControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('name') as FormControl | null;
  });

  readonly limitControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('limit') as FormControl | null;
  });

  readonly closingDayControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('closingDay') as FormControl | null;
  });

  readonly dueDayControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('dueDay') as FormControl | null;
  });

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
    if (control.hasError('required')) return 'Nome do cartão é obrigatório';
    if (control.hasError('minlength')) return 'Nome deve ter pelo menos 3 caracteres';
    if (control.hasError('maxlength')) return 'Nome deve ter no máximo 100 caracteres';
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

  readonly getClosingDayErrorMessage = computed(() => {
    this._validationTrigger();
    const control = this.closingDayControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Dia de fechamento é obrigatório';
    if (control.hasError('min')) return 'Dia de fechamento deve ser entre 1 e 31';
    if (control.hasError('max')) return 'Dia de fechamento deve ser entre 1 e 31';
    return '';
  });

  readonly getDueDayErrorMessage = computed(() => {
    this._validationTrigger();
    const control = this.dueDayControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Dia de vencimento é obrigatório';
    if (control.hasError('min')) return 'Dia de vencimento deve ser entre 1 e 31';
    if (control.hasError('max')) return 'Dia de vencimento deve ser entre 1 e 31';
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
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      limit: new FormControl(0, [Validators.required, Validators.min(0.01)]),
      closingDay: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(31),
      ]),
      dueDay: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(31),
      ]),
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
    const limitInCents = Math.round((formValue.limit || 0) * 100);

    this.creditCardState.createCreditCard({
      name: formValue.name,
      limit: limitInCents,
      closingDay: formValue.closingDay,
      dueDay: formValue.dueDay,
      budgetId: budgetId,
    });

    this.notificationService.showSuccess('Cartão de crédito criado com sucesso!');
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
    this.router.navigate(['/credit-cards'], { replaceUrl: true });
  }
}
