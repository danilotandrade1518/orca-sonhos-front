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
import { EnvelopeState } from '@core/services/envelope/envelope-state/envelope.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { OsModalTemplateComponent } from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import type { EnvelopeDto } from '../../../../../dtos/envelope';

@Component({
  selector: 'os-confirm-delete-envelope-modal',
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
        @if (envelope()) {
        <p class="os-confirm-delete-modal__message">
          Tem certeza que deseja excluir o envelope <strong>{{ envelope()!.name }}</strong>?
        </p>
        <div class="os-confirm-delete-modal__warning" role="alert">
          <p>
            Esta ação não pode ser desfeita. O envelope será removido permanentemente e não será
            mais possível controlar o limite de gastos para esta categoria.
          </p>
        </div>
        }
      </div>
    </os-modal-template>
  `,
  styleUrl: './confirm-delete-modal.component.scss',
})
export class ConfirmDeleteEnvelopeModalComponent {
  private readonly envelopeState = inject(EnvelopeState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly notificationService = inject(NotificationService);

  readonly envelope = input.required<EnvelopeDto>();
  readonly closed = output<void>();

  private readonly deleteInitiated = signal(false);
  private readonly previousLoading = signal(false);

  readonly selectedBudgetId = this.budgetSelection.selectedBudgetId;
  readonly isProcessing = computed(() => this.envelopeState.loading());

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
        const error = this.envelopeState.error();
        if (error) {
          this.notificationService.showError(error, 'Erro ao excluir');
        } else {
          this.notificationService.showSuccess('Envelope excluído com sucesso!');
          this.deleteInitiated.set(false);
          this.onClose();
        }
      }

      this.previousLoading.set(loading);
    });
  }

  onConfirm(): void {
    const envelope = this.envelope();
    const budgetId = this.selectedBudgetId();

    if (!envelope || !budgetId) {
      this.notificationService.showError('Dados inválidos para exclusão', 'Erro');
      return;
    }

    this.envelopeState.clearError();
    this.deleteInitiated.set(true);
    this.envelopeState.deleteEnvelope({
      envelopeId: envelope.id,
      budgetId,
    });
  }

  onClose(): void {
    this.envelopeState.clearError();
    this.closed.emit();
  }
}

