import {
  Component,
  computed,
  inject,
  ChangeDetectionStrategy,
  signal,
  effect,
} from '@angular/core';

import { Router } from '@angular/router';
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
  TransferFormComponent,
  type TransferFormData,
} from '@shared/ui-components/molecules/transfer-form/transfer-form.component';

@Component({
  selector: 'os-transfer-page',
  imports: [
    OsPageComponent,
    OsPageHeaderComponent,
    TransferFormComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Transferência entre contas">
      <os-page-header
        [title]="pageTitle()"
        [subtitle]="pageSubtitle()"
        [breadcrumbs]="breadcrumbs()"
        (breadcrumbClick)="onBreadcrumbClick($event)"
      />

      <div class="os-transfer-page__content">
        <os-transfer-form
          [accounts]="accounts()"
          [selectedBudgetId]="selectedBudgetId()"
          [disabled]="isProcessing()"
          (transferSubmit)="onTransferSubmit($event)"
          (cancelled)="onCancel()"
        />
      </div>
    </os-page>
  `,
  styleUrl: './transfer.page.scss',
})
export class TransferPage {
  private readonly accountState = inject(AccountState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly transferInitiated = signal(false);
  private readonly previousLoading = signal(false);

  readonly selectedBudgetId = this.budgetSelection.selectedBudgetId;
  readonly accounts = computed(() => this.accountState.accountsByBudgetId());
  readonly isProcessing = computed(() => this.accountState.loading());

  readonly pageTitle = computed(() => 'Transferir entre Contas');
  readonly pageSubtitle = computed(() =>
    'Selecione as contas origem e destino e o valor a transferir'
  );

  readonly breadcrumbs = computed((): BreadcrumbItem[] => {
    return [
      { label: 'Contas', route: '/accounts' },
      { label: 'Transferir', route: undefined },
    ];
  });

  constructor() {
    effect(() => {
      const loading = this.isProcessing();
      const previousLoadingValue = this.previousLoading();
      const transferInitiatedValue = this.transferInitiated();

      if (transferInitiatedValue && previousLoadingValue && !loading) {
        const error = this.accountState.error();
        if (error) {
          this.notificationService.showError(error, 'Erro ao transferir');
        } else {
          this.notificationService.showSuccess(
            'Transferência realizada com sucesso!'
          );
          this.transferInitiated.set(false);
          this.navigateBack();
        }
      }

      this.previousLoading.set(loading);
    });
  }

  onTransferSubmit(data: TransferFormData): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.notificationService.showError('Usuário não autenticado', 'Erro');
      return;
    }

    this.accountState.clearError();
    this.transferInitiated.set(true);
    this.accountState.transferBetweenAccounts({
      userId: user.id,
      fromAccountId: data.fromAccountId,
      toAccountId: data.toAccountId,
      amount: data.amount,
    });
  }

  onCancel(): void {
    this.accountState.clearError();
    this.transferInitiated.set(false);
    this.navigateBack();
  }

  onBreadcrumbClick(breadcrumb: BreadcrumbItem): void {
    if (breadcrumb.route) {
      this.router.navigate([breadcrumb.route]);
    }
  }

  private navigateBack(): void {
    this.router.navigate(['/accounts'], { replaceUrl: true });
  }
}
