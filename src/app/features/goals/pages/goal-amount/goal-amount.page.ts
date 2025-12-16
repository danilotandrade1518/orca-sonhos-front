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

import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { GoalsState } from '@features/goals/state/goals-state/goals.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { LocaleService } from '@shared/formatting/locale.service';
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import { OsPageHeaderComponent, type BreadcrumbItem } from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import { OsFormTemplateComponent } from '@shared/ui-components/templates/os-form-template/os-form-template.component';
import { OsMoneyInputComponent } from '@shared/ui-components/atoms/os-money-input/os-money-input.component';
import { OsAlertComponent } from '@shared/ui-components/molecules/os-alert/os-alert.component';
import { CurrencyPipe as OsCurrencyPipe } from '@shared/formatting';
import type { GoalDto } from '../../../../../dtos/goal';

@Component({
  selector: 'os-goal-amount-page',
  imports: [
    ReactiveFormsModule,
    OsPageComponent,
    OsPageHeaderComponent,
    OsFormTemplateComponent,
    OsMoneyInputComponent,
    OsAlertComponent,
    OsCurrencyPipe
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Formulário de aporte">
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
        @if (form() && goal()) {
        <div [formGroup]="form()!">
          @if (error()) {
          <os-alert
            type="error"
            [title]="'Erro'"
            [role]="'alert'"
            [ariaLive]="'assertive'"
            [showIcon]="true"
            [dismissible]="false"
          >
            {{ error() }}
          </os-alert>
          }

          <os-money-input
            label="Valor"
            formControlName="amount"
            [required]="true"
            [errorMessage]="getAmountErrorMessage()"
            placeholder="0,00"
            [allowNegative]="false"
          />

          @if (mode() === 'remove') {
          <div class="goal-amount-page__info">
            <p>
              <strong>Valor atual acumulado:</strong>
              {{ goal()!.accumulatedAmount / 100 | osCurrency : 'BRL' }}
            </p>
            <p>
              <strong>Valor após remoção:</strong>
              {{ remainingAfter() / 100 | osCurrency : 'BRL' }}
            </p>
          </div>
          }
        </div>
        }
      </os-form-template>
    </os-page>
  `,
  styleUrl: './goal-amount.page.scss',
})
export class GoalAmountPage implements OnInit {
  private readonly goalsState = inject(GoalsState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly notificationService = inject(NotificationService);
  private readonly localeService = inject(LocaleService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = computed(() => this.goalsState.isLoading());
  readonly error = computed(() => this.goalsState.error());

  private readonly _form = signal<FormGroup | null>(null);
  readonly form = this._form.asReadonly();

  private readonly _goal = signal<GoalDto | null>(null);
  readonly goal = this._goal.asReadonly();

  private readonly _validationTrigger = signal(0);

  readonly mode = computed<'add' | 'remove'>(() => {
    const path = this.route.snapshot.url;
    const lastSegment = path[path.length - 1]?.path;
    return lastSegment === 'remove-amount' ? 'remove' : 'add';
  });

  readonly pageTitle = computed(() => {
    return this.mode() === 'add' ? 'Adicionar Aporte' : 'Remover Aporte';
  });

  readonly pageSubtitle = computed(() => {
    return this.mode() === 'add'
      ? 'Informe o valor a ser adicionado à meta'
      : 'Informe o valor a ser removido da meta';
  });

  readonly breadcrumbs = computed((): BreadcrumbItem[] => {
    const base: BreadcrumbItem[] = [{ label: 'Metas', route: '/goals' }];
    if (this.goal()) {
      base.push({ label: this.goal()!.name, route: `/goals/${this.goal()!.id}` });
    }
    base.push({
      label: this.mode() === 'add' ? 'Adicionar Aporte' : 'Remover Aporte',
      route: undefined,
    });
    return base;
  });

  readonly amountControl = computed(() => {
    this._validationTrigger();
    return this._form()?.get('amount') as FormControl | null;
  });

  readonly remainingAfter = computed(() => {
    const amountReais = this._form()?.get('amount')?.value as number | null;
    const currentAmountCents = this.goal()?.accumulatedAmount ?? 0;
    if (!amountReais || amountReais <= 0) return currentAmountCents;
    const amountCents = Math.round(amountReais * 100);
    return Math.max(currentAmountCents - amountCents, 0);
  });

  readonly formConfig = computed(() => ({
    title: '',
    showHeader: false,
    showProgress: false,
    showActions: true,
    showSaveButton: true,
    showCancelButton: true,
    saveButtonText: this.mode() === 'add' ? 'Adicionar' : 'Remover',
    cancelButtonText: 'Cancelar',
  }));

  readonly getAmountErrorMessage = computed(() => {
    this._validationTrigger();
    const control = this.amountControl();
    if (!control || (!control.touched && !control.dirty)) return '';
    if (control.hasError('required')) return 'Valor é obrigatório';
    if (control.hasError('min')) return 'Valor deve ser maior que zero';
    if (control.hasError('invalidAmount')) {
      const error = control.errors?.['invalidAmount'];
      return typeof error === 'string' ? error : 'Valor inválido';
    }
    return 'Valor inválido';
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
    const goalId = this.route.snapshot.paramMap.get('id');
    if (!goalId) {
      this.notificationService.showError('Meta não encontrada');
      this.navigateBack();
      return;
    }

    const form = new FormGroup({
      amount: new FormControl<number | null>(null, {
        validators: [Validators.required, Validators.min(0.01), this.amountValidator.bind(this)],
      }),
    });

    this._form.set(form);

    const budgetId = this.budgetSelection.selectedBudgetId();
    if (!budgetId) {
      this.notificationService.showError('Nenhum orçamento selecionado');
      this.navigateBack();
      return;
    }

    if (this.goalsState.items().length === 0) {
      this.goalsState.load(budgetId);
    }

    this.loadGoal(goalId);
  }

  private loadGoal(goalId: string): void {
    const goals = this.goalsState.items();
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      this._goal.set(goal);
    } else {
      const budgetId = this.budgetSelection.selectedBudgetId();
      if (budgetId) {
        this.goalsState.load(budgetId);
        const checkGoal = () => {
          const updatedGoals = this.goalsState.items();
          const foundGoal = updatedGoals.find((g) => g.id === goalId);
          if (foundGoal) {
            this._goal.set(foundGoal);
          } else {
            this.notificationService.showError('Meta não encontrada');
            this.navigateBack();
          }
        };
        setTimeout(checkGoal, 500);
      } else {
        this.notificationService.showError('Meta não encontrada');
        this.navigateBack();
      }
    }
  }

  private amountValidator(control: AbstractControl): ValidationErrors | null {
    const valueReais = control.value as number | null;
    if (!valueReais || valueReais <= 0) return null;

    if (this.mode() === 'remove') {
      const currentAmountCents = this.goal()?.accumulatedAmount ?? 0;
      const valueCents = Math.round(valueReais * 100);
      const remaining = currentAmountCents - valueCents;
      if (remaining < 0) {
        return { invalidAmount: 'Não é possível remover valor que resulte em saldo negativo' };
      }
    }

    return null;
  }

  onSave(): void {
    const form = this._form();
    if (!form || form.invalid) {
      form?.markAllAsTouched();
      this._validationTrigger.update((v) => v + 1);
      return;
    }

    const goal = this.goal();
    if (!goal) {
      this.notificationService.showError('Meta não encontrada');
      return;
    }

    const amountReais = Number(form.get('amount')!.value);
    const amount = Math.round(amountReais * 100);
    const goalId = goal.id;

    if (this.mode() === 'add') {
      this.goalsState.addAmount({ id: goalId, amount });
    } else {
      this.goalsState.removeAmount({ id: goalId, amount });
    }

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
    const goal = this.goal();
    if (goal) {
      this.router.navigate(['/goals', goal.id], { replaceUrl: true });
    } else {
      this.router.navigate(['/goals'], { replaceUrl: true });
    }
  }
}
