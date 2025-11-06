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
import { CreditCardState } from '@core/services/credit-card/credit-card-state/credit-card.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { AuthService } from '@core/services/auth/auth.service';
import { OsModalTemplateComponent } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import type { CreditCardDto } from '../../../../../dtos/credit-card';

@Component({
  selector: 'os-confirm-delete-credit-card-modal',
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
        @if (creditCard()) {
        <p class="os-confirm-delete-modal__message">
          Tem certeza que deseja excluir o cartão <strong>{{ creditCard()!.name }}</strong>?
        </p>
        <div class="os-confirm-delete-modal__warning" role="alert">
          <p>
            Esta ação não pode ser desfeita. Se o cartão possuir faturas vinculadas, a exclusão
            será bloqueada.
          </p>
        </div>
        }
      </div>
    </os-modal-template>
  `,
  styleUrl: './confirm-delete-modal.component.scss',
})
export class ConfirmDeleteCreditCardModalComponent {
  private readonly creditCardState = inject(CreditCardState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  readonly creditCard = input.required<CreditCardDto>();
  readonly closed = output<void>();

  private readonly deleteInitiated = signal(false);
  private readonly previousLoading = signal(false);

  readonly selectedBudgetId = this.budgetSelection.selectedBudgetId;
  readonly isProcessing = computed(() => this.creditCardState.loading());

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
        const error = this.creditCardState.error();
        if (error) {
          this.notificationService.showError(
            error.includes('faturas vinculadas')
              ? 'Não é possível excluir o cartão. Ele possui faturas vinculadas e não pode ser excluído.'
              : error,
            'Erro ao excluir'
          );
        } else {
          this.notificationService.showSuccess('Cartão de crédito excluído com sucesso!');
          this.deleteInitiated.set(false);
          this.onClose();
        }
      }

      this.previousLoading.set(loading);
    });
  }

  onConfirm(): void {
    const creditCard = this.creditCard();
    const user = this.authService.currentUser();

    if (!creditCard || !user) {
      this.notificationService.showError('Dados inválidos para exclusão', 'Erro');
      return;
    }

    this.creditCardState.clearError();
    this.deleteInitiated.set(true);
    this.creditCardState.deleteCreditCard({
      id: creditCard.id,
    });
  }

  onClose(): void {
    this.creditCardState.clearError();
    this.deleteInitiated.set(false);
    this.closed.emit();
  }
}
