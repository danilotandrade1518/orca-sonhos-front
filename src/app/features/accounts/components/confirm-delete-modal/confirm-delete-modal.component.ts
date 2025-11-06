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
import type { AccountDto } from '../../../../../dtos/account';

@Component({
  selector: 'os-confirm-delete-modal',
  standalone: true,
  imports: [CommonModule, OsModalTemplateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-modal-template
      [config]="modalConfig()"
      [variant]="'compact'"
      [size]="'small'"
      [disabled]="isProcessing()"
      [loading]="isProcessing()"
      [valid]="true"
      (confirmed)="onConfirm()"
      (cancelled)="onClose()"
      (closed)="onClose()"
      (backdropClick)="onClose()"
      (escapeKey)="onClose()"
    >
      <div class="os-confirm-delete-modal__content">
        @if (account()) {
        <p class="os-confirm-delete-modal__message">
          Tem certeza que deseja excluir a conta <strong>{{ account()!.name }}</strong>?
        </p>
        <div class="os-confirm-delete-modal__warning" role="alert">
          <p>
            Esta ação não pode ser desfeita. Se a conta possuir transações vinculadas, a exclusão
            será bloqueada.
          </p>
        </div>
        }
      </div>
    </os-modal-template>
  `,
  styleUrl: './confirm-delete-modal.component.scss',
})
export class ConfirmDeleteModalComponent {
  private readonly accountState = inject(AccountState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  readonly account = input.required<AccountDto>();
  readonly closed = output<void>();

  private readonly deleteInitiated = signal(false);
  private readonly previousLoading = signal(false);

  readonly selectedBudgetId = this.budgetSelection.selectedBudgetId;
  readonly isProcessing = computed(() => this.accountState.loading());

  readonly modalConfig = computed(() => ({
    title: 'Confirmar Exclusão',
    subtitle: 'Esta ação não pode ser desfeita',
    showCloseButton: true,
    showHeader: true,
    showFooter: true,
    showActions: true,
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: 'Excluir',
    cancelButtonText: 'Cancelar',
  }));

  constructor() {
    effect(() => {
      const loading = this.isProcessing();
      const previousLoadingValue = this.previousLoading();
      const deleteInitiatedValue = this.deleteInitiated();

      if (deleteInitiatedValue && previousLoadingValue && !loading) {
        const error = this.accountState.error();
        if (error) {
          this.notificationService.showError(
            error.includes('transações vinculadas')
              ? 'Não é possível excluir a conta. Ela possui transações vinculadas e não pode ser excluída.'
              : error,
            'Erro ao excluir'
          );
        } else {
          this.notificationService.showSuccess('Conta excluída com sucesso!');
          this.deleteInitiated.set(false);
          this.onClose();
        }
      }

      this.previousLoading.set(loading);
    });
  }

  onConfirm(): void {
    const account = this.account();
    const user = this.authService.currentUser();

    if (!account || !user) {
      this.notificationService.showError('Dados inválidos para exclusão', 'Erro');
      return;
    }

    this.accountState.clearError();
    this.deleteInitiated.set(true);
    this.accountState.deleteAccount({
      userId: user.id,
      accountId: account.id,
    });
  }

  onClose(): void {
    this.accountState.clearError();
    this.deleteInitiated.set(false);
    this.closed.emit();
  }
}
