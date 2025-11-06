import {
  Component,
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
  TransferFormComponent,
  type TransferFormData,
} from '@shared/ui-components/molecules/transfer-form/transfer-form.component';

@Component({
  selector: 'os-transfer-modal',
  standalone: true,
  imports: [CommonModule, OsModalTemplateComponent, TransferFormComponent],
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
      <os-transfer-form
        [accounts]="accounts()"
        [selectedBudgetId]="selectedBudgetId()"
        [disabled]="isProcessing()"
        (transferSubmit)="onTransferSubmit($event)"
        (cancelled)="onClose()"
      />
    </os-modal-template>
  `,
  styleUrl: './transfer-modal.component.scss',
})
export class TransferModalComponent {
  private readonly accountState = inject(AccountState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  readonly closed = output<void>();

  private readonly transferInitiated = signal(false);
  private readonly previousLoading = signal(false);

  readonly selectedBudgetId = this.budgetSelection.selectedBudgetId;
  readonly accounts = computed(() => this.accountState.accountsByBudgetId());
  readonly isProcessing = computed(() => this.accountState.loading());

  readonly modalConfig = computed(() => ({
    title: 'Transferir entre Contas',
    subtitle: 'Selecione as contas origem e destino e o valor a transferir',
    showCloseButton: true,
    showHeader: true,
    showFooter: false,
    showActions: false,
  }));

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
          this.notificationService.showSuccess('Transferência realizada com sucesso!');
          this.transferInitiated.set(false);
          this.onClose();
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

  onClose(): void {
    this.accountState.clearError();
    this.transferInitiated.set(false);
    this.closed.emit();
  }
}
