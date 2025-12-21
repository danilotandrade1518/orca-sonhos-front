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
  selector: 'os-credit-cards-edit-page',
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
    <os-page variant="default" size="medium" ariaLabel="Editar cartão de crédito">
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
  styleUrl: './credit-cards-edit.page.scss',
})
export class CreditCardsEditPage implements OnInit {
  private readonly creditCardState = inject(CreditCardState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = computed(() => this.creditCardState.loading());

  private readonly _form = signal<FormGroup | null>(null);
  readonly form = this._form.asReadonly();

  private readonly _formValidityTick = signal(0);

  readonly isFormInvalid = computed(() => {
    this._formValidityTick();
    const form = this._form();
    return form ? form.invalid : true;
  });

  readonly isSaveDisabled = computed(() => {
    return this.loading() || this.isFormInvalid();
  });

  private readonly _creditCardId = signal<string | null>(null);

  readonly creditCard = computed(() => {
    const id = this._creditCardId();
    if (!id) return null;

    const creditCards = this.creditCardState.creditCards();
    return creditCards.find((cc) => cc.id === id) || null;
  });

  readonly pageTitle = computed(() => {
    const creditCard = this.creditCard();
    return creditCard ? `Editar ${creditCard.name}` : 'Editar Cartão de Crédito';
  });

  readonly pageSubtitle = computed(() => 'Atualize as informações do cartão de crédito');

  readonly breadcrumbs = computed((): BreadcrumbItem[] => {
    const creditCard = this.creditCard();
    const base: BreadcrumbItem[] = [{ label: 'Cartões de Crédito', route: '/credit-cards' }];
    if (creditCard) {
      base.push({ label: creditCard.name, route: `/credit-cards/${creditCard.id}` });
    }
    base.push({ label: 'Editar', route: undefined });
    return base;
  });

  readonly nameControl = computed(() => {
    return this._form()?.get('name') as FormControl | null;
  });

  readonly limitControl = computed(() => {
    return this._form()?.get('limit') as FormControl | null;
  });

  readonly closingDayControl = computed(() => {
    return this._form()?.get('closingDay') as FormControl | null;
  });

  readonly dueDayControl = computed(() => {
    return this._form()?.get('dueDay') as FormControl | null;
  });

  readonly formConfig = computed(() => ({
    title: '',
    showHeader: false,
    showActions: true,
    showSaveButton: true,
    showCancelButton: true,
    saveButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
  }));

  readonly getNameErrorMessage = computed(() => {
    const control = this.nameControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Nome do cartão é obrigatório';
    if (control.hasError('minlength')) return 'Nome deve ter pelo menos 3 caracteres';
    if (control.hasError('maxlength')) return 'Nome deve ter no máximo 100 caracteres';
    return '';
  });

  readonly getLimitErrorMessage = computed(() => {
    const control = this.limitControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Limite é obrigatório';
    if (control.hasError('min')) return 'Limite deve ser maior que zero';
    return '';
  });

  readonly getClosingDayErrorMessage = computed(() => {
    const control = this.closingDayControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Dia de fechamento é obrigatório';
    if (control.hasError('min')) return 'Dia de fechamento deve ser entre 1 e 31';
    if (control.hasError('max')) return 'Dia de fechamento deve ser entre 1 e 31';
    return '';
  });

  readonly getDueDayErrorMessage = computed(() => {
    const control = this.dueDayControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Dia de vencimento é obrigatório';
    if (control.hasError('min')) return 'Dia de vencimento deve ser entre 1 e 31';
    if (control.hasError('max')) return 'Dia de vencimento deve ser entre 1 e 31';
    return '';
  });

  constructor() {
    effect((onCleanup) => {
      const form = this._form();
      if (!form) return;

      this._formValidityTick.update((v) => v + 1);
      const sub = form.statusChanges.subscribe(() => this._formValidityTick.update((v) => v + 1));
      onCleanup(() => sub.unsubscribe());
    });

    effect(() => {
      const creditCard = this.creditCard();
      const form = this._form();
      if (form && creditCard) {
        form.patchValue({
          name: creditCard.name,
          limit: creditCard.limit / 100,
          closingDay: creditCard.closingDay,
          dueDay: creditCard.dueDay,
        });
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
    const creditCardId = this.route.snapshot.paramMap.get('id');
    if (!creditCardId) {
      this.notificationService.showError('ID do cartão de crédito não encontrado');
      this.navigateBack();
      return;
    }

    this._creditCardId.set(creditCardId);

    if (this.creditCardState.creditCards().length === 0) {
      this.creditCardState.loadCreditCards();
    }

    const creditCard = this.creditCard();
    if (!creditCard) {
      this.notificationService.showError('Cartão de crédito não encontrado');
      this.navigateBack();
      return;
    }

    const form = new FormGroup({
      name: new FormControl(creditCard.name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      limit: new FormControl(creditCard.limit / 100, [Validators.required, Validators.min(0.01)]),
      closingDay: new FormControl<number>(creditCard.closingDay, [
        Validators.required,
        Validators.min(1),
        Validators.max(31),
      ]),
      dueDay: new FormControl<number>(creditCard.dueDay, [
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
      return;
    }

    const creditCardId = this._creditCardId();
    const user = this.authService.currentUser();
    const budgetId = this.budgetSelection.selectedBudgetId();
    if (!creditCardId || !user || !budgetId) {
      this.notificationService.showError('Dados insuficientes para atualizar o cartão de crédito');
      return;
    }

    const formValue = form.value;
    const limitInCents = Math.round((formValue.limit || 0) * 100);

    this.creditCardState.updateCreditCard({
      id: creditCardId,
      name: formValue.name,
      limit: limitInCents,
      closingDay: formValue.closingDay,
      dueDay: formValue.dueDay,
    });

    this.notificationService.showSuccess('Cartão de crédito atualizado com sucesso!');
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
    const creditCardId = this._creditCardId();
    if (creditCardId) {
      this.router.navigate(['/credit-cards', creditCardId], { replaceUrl: true });
    } else {
      this.router.navigate(['/credit-cards'], { replaceUrl: true });
    }
  }
}
