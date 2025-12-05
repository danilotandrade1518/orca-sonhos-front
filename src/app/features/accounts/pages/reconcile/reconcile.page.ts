import {
  Component,
  computed,
  inject,
  ChangeDetectionStrategy,
  signal,
  effect,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountState } from '@core/services/account/account-state/account.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { AuthService } from '@core/services/auth/auth.service';
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import {
  OsPageHeaderComponent,
  type BreadcrumbItem,
} from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import {
  ReconcileFormComponent,
  type ReconcileFormData,
} from '@shared/ui-components/molecules/reconcile-form/reconcile-form.component';

@Component({
  selector: 'os-reconcile-page',
  imports: [
    CommonModule,
    OsPageComponent,
    OsPageHeaderComponent,
    ReconcileFormComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Reconciliar conta">
      <os-page-header
        [title]="pageTitle()"
        [subtitle]="pageSubtitle()"
        [breadcrumbs]="breadcrumbs()"
        (breadcrumbClick)="onBreadcrumbClick($event)"
      />

      <div class="os-reconcile-page__content">
        @if (account(); as accountData) {
        <os-reconcile-form
          [account]="accountData"
          [disabled]="isProcessing()"
          (reconcileSubmit)="onReconcileSubmit($event)"
          (cancelled)="onCancel()"
        />
        } @else {
        <div class="os-reconcile-page__error">
          <p>Conta não encontrada.</p>
        </div>
        }
      </div>
    </os-page>
  `,
  styleUrl: './reconcile.page.scss',
})
export class ReconcilePage implements OnInit {
  private readonly accountState = inject(AccountState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly accountId = signal<string | null>(null);
  private readonly reconcileInitiated = signal(false);
  private readonly previousLoading = signal(false);

  readonly selectedBudgetId = this.budgetSelection.selectedBudgetId;
  readonly isProcessing = computed(() => this.accountState.loading());

  readonly account = computed(() => {
    const id = this.accountId();
    if (!id) return null;

    const accounts = this.accountState.accounts();
    return accounts.find((a) => a.id === id) || null;
  });

  readonly pageTitle = computed(() => 'Reconciliar Conta');
  readonly pageSubtitle = computed(() =>
    'Informe o valor final esperado para o saldo da conta'
  );

  readonly breadcrumbs = computed((): BreadcrumbItem[] => {
    const account = this.account();
    return [
      { label: 'Contas', route: '/accounts' },
      ...(account
        ? [{ label: account.name, route: `/accounts/${account.id}` }]
        : []),
      { label: 'Reconciliar', route: undefined },
    ];
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.navigateBack();
      return;
    }

    this.accountId.set(id);

    if (this.accountState.accounts().length === 0) {
      this.accountState.loadAccounts();
    }
  }

  constructor() {
    effect(() => {
      const loading = this.isProcessing();
      const previousLoadingValue = this.previousLoading();
      const reconcileInitiatedValue = this.reconcileInitiated();

      if (reconcileInitiatedValue && previousLoadingValue && !loading) {
        const error = this.accountState.error();
        if (error) {
          this.notificationService.showError(error, 'Erro ao reconciliar');
        } else {
          this.notificationService.showSuccess('Saldo reconciliado com sucesso!');
          this.reconcileInitiated.set(false);
          this.navigateBack();
        }
      }

      this.previousLoading.set(loading);
    });
  }

  onReconcileSubmit(data: ReconcileFormData): void {
    const user = this.authService.currentUser();
    const budgetId = this.selectedBudgetId();
    if (!user || !budgetId) {
      this.notificationService.showError(
        'Usuário ou orçamento não selecionado',
        'Erro'
      );
      return;
    }

    this.accountState.clearError();
    this.reconcileInitiated.set(true);
    this.accountState.reconcileAccount({
      userId: user.id,
      budgetId,
      accountId: data.accountId,
      realBalance: data.realBalance,
    });
  }

  onCancel(): void {
    this.accountState.clearError();
    this.reconcileInitiated.set(false);
    this.navigateBack();
  }

  onBreadcrumbClick(breadcrumb: BreadcrumbItem): void {
    if (breadcrumb.route) {
      this.router.navigate([breadcrumb.route]);
    }
  }

  private navigateBack(): void {
    const accountId = this.accountId();
    if (accountId) {
      this.router.navigate(['/accounts', accountId], { replaceUrl: true });
    } else {
      this.router.navigate(['/accounts'], { replaceUrl: true });
    }
  }
}

