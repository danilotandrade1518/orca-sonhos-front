import {
  Component,
  input,
  output,
  computed,
  inject,
  effect,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountState } from '@core/services/account/account-state/account.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { AuthService } from '@core/services/auth/auth.service';
import { OsModalTemplateComponent } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import {
  ReconcileFormComponent,
  type ReconcileFormData,
} from '@shared/ui-components/molecules/reconcile-form/reconcile-form.component';
import type { AccountDto } from '../../../../../dtos/account';

@Component({
  selector: 'os-reconcile-modal',
  standalone: true,
  imports: [CommonModule, OsModalTemplateComponent, ReconcileFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-modal-template
      [config]="modalConfig()"
      [variant]="'default'"
      [size]="'medium'"
      [disabled]="isProcessing()"
      [loading]="isProcessing()"
      (closed)="onClose()"
      (cancelled)="onClose()"
      (backdropClick)="onClose()"
      (escapeKey)="onClose()"
    >
      <os-reconcile-form
        [account]="account()"
        [disabled]="isProcessing()"
        (reconcileSubmit)="onReconcileSubmit($event)"
        (cancelled)="onClose()"
      />
    </os-modal-template>
  `,
  styleUrl: './reconcile-modal.component.scss',
})
export class ReconcileModalComponent {
  private readonly accountState = inject(AccountState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  readonly account = input.required<AccountDto>();
  readonly closed = output<void>();

  private readonly reconcileInitiated = signal(false);
  private readonly previousLoading = signal(false);

  readonly selectedBudgetId = this.budgetSelection.selectedBudgetId;
  readonly isProcessing = computed(() => this.accountState.loading());

  readonly modalConfig = computed(() => ({
    title: 'Reconciliar Conta',
    subtitle: 'Informe o valor final esperado para o saldo da conta',
    showCloseButton: true,
    showHeader: true,
    showFooter: false,
    showActions: false,
  }));

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
          this.onClose();
        }
      }

      this.previousLoading.set(loading);
    });
  }

  onReconcileSubmit(data: ReconcileFormData): void {
    const user = this.authService.currentUser();
    const budgetId = this.selectedBudgetId();
    if (!user || !budgetId) {
      this.notificationService.showError('Usuário ou orçamento não selecionado', 'Erro');
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

  onClose(): void {
    this.accountState.clearError();
    this.reconcileInitiated.set(false);
    this.closed.emit();
  }
}
