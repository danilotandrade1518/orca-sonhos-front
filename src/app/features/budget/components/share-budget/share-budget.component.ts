import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  effect,
  ChangeDetectionStrategy,
  OnInit,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharingState } from '@core/services/sharing/sharing.state';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import {
  OsModalTemplateComponent,
  type ModalTemplateConfig,
} from '@shared/ui-components/templates/os-modal-template/os-modal-template.component';
import { UserInviteComponent } from '../user-invite/user-invite.component';
import { CollaborationDashboardComponent } from '../collaboration-dashboard/collaboration-dashboard.component';

@Component({
  selector: 'os-share-budget',
  standalone: true,
  imports: [
    CommonModule,
    OsModalTemplateComponent,
    UserInviteComponent,
    CollaborationDashboardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
    <os-modal-template
      [config]="modalConfig()"
      [variant]="'default'"
      [size]="modalSize()"
      [disabled]="loading()"
      [loading]="loading()"
      [valid]="true"
      (confirmed)="onAddParticipant()"
      (cancelled)="onCancel()"
      (closed)="onCancel()"
      (backdropClick)="onCancel()"
      (escapeKey)="onCancel()"
    >
      <div class="share-budget__content">
        <div class="share-budget__search-section">
          <os-user-invite [disabled]="loading()" (userSelected)="onSelectedUserChange($event)" />
        </div>

        <div class="share-budget__participants-section">
          <os-collaboration-dashboard
            [budgetId]="budgetId()"
            [creatorId]="creatorId()"
            (participantRemoved)="onParticipantRemoved($event)"
          />
        </div>
      </div>
    </os-modal-template>
    }
  `,
  styleUrl: './share-budget.component.scss',
})
export class ShareBudgetComponent implements OnInit {
  private readonly sharingState = inject(SharingState);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly elementRef = inject(ElementRef);

  readonly budgetId = input.required<string>();
  readonly budgetName = input<string>('');
  readonly creatorId = input<string | null>(null);
  readonly isOpen = input<boolean>(false);

  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly participantAdded = output<string>();
  readonly participantRemoved = output<string>();

  private readonly _selectedUserId = signal<string | null>(null);
  private readonly _addingParticipantId = signal<string | null>(null);
  readonly selectedUserId = this._selectedUserId.asReadonly();

  readonly loading = computed(() => this.sharingState.loading());
  readonly error = computed(() => this.sharingState.error());

  readonly modalSize = computed<'small' | 'medium' | 'large'>(() => {
    return 'medium';
  });

  readonly modalConfig = computed<ModalTemplateConfig>(() => ({
    title: 'Gerenciar Participantes',
    subtitle: this.budgetName() || 'Adicione participantes ao orçamento',
    showActions: true,
    showCancelButton: true,
    showConfirmButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Adicionar',
  }));

  constructor() {
    effect(() => {
      const isOpen = this.isOpen();
      if (isOpen) {
        this.sharingState.loadParticipants(this.budgetId());
        this.opened.emit();
        setTimeout(() => {
          this.focusSearchInput();
        }, 100);
      } else {
        this._selectedUserId.set(null);
        this.sharingState.clearError();
      }
    });

    effect(() => {
      const isLoading = this.loading();
      const error = this.error();
      const addingParticipantId = this._addingParticipantId();
      const participants = this.sharingState.participants();

      if (!isLoading && addingParticipantId && !error) {
        const wasAdded = participants.some((p) => p.id === addingParticipantId);

        if (wasAdded) {
          this.notificationService.showSuccess('Participante adicionado com sucesso!');
          this.participantAdded.emit(addingParticipantId);
          this._selectedUserId.set(null);
          this._addingParticipantId.set(null);
        }
      } else if (!isLoading && error && addingParticipantId) {
        this.notificationService.showError(error);
        this._addingParticipantId.set(null);
      }
    });
  }

  ngOnInit(): void {
    if (this.isOpen()) {
      this.sharingState.loadParticipants(this.budgetId());
    }
  }

  onSelectedUserChange(userId: string | null): void {
    this._selectedUserId.set(userId);
  }

  onAddParticipant(): void {
    const userId = this._selectedUserId();
    if (!userId) {
      this.notificationService.showError('Selecione um usuário para adicionar');
      return;
    }

    const participants = this.sharingState.participants();
    const isAlreadyParticipant = participants.some((p) => p.id === userId);

    if (isAlreadyParticipant) {
      this.notificationService.showError('Este usuário já é participante do orçamento');
      return;
    }

    this._addingParticipantId.set(userId);
    const budgetId = this.budgetId();
    this.sharingState.addParticipant(budgetId, userId);
  }

  onParticipantRemoved(participantId: string): void {
    this.participantRemoved.emit(participantId);
    this.notificationService.showSuccess('Participante removido com sucesso!');
  }

  onCancel(): void {
    this.closed.emit();
  }

  private focusSearchInput(): void {
    const searchInput = this.elementRef.nativeElement.querySelector(
      'os-user-invite os-search-box input'
    );
    if (searchInput) {
      searchInput.focus();
    }
  }
}
