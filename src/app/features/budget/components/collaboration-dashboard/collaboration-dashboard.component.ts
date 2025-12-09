import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  effect,
  ChangeDetectionStrategy,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { BudgetParticipantDto } from '../../../../../dtos/budget';
import { SharingState } from '@core/services/sharing/sharing.state';
import { AuthService } from '@core/services/auth/auth.service';
import { OsCardComponent } from '@shared/ui-components/molecules/os-card/os-card.component';
import { OsButtonComponent } from '@shared/ui-components/atoms/os-button/os-button.component';
import { OsBadgeComponent } from '@shared/ui-components/atoms/os-badge/os-badge.component';

@Component({
  selector: 'os-collaboration-dashboard',
  standalone: true,
  imports: [CommonModule, OsCardComponent, OsButtonComponent, OsBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="collaboration-dashboard" [class]="containerClass()">
      <div class="collaboration-dashboard__header">
        <h3 class="collaboration-dashboard__title">Participantes</h3>
        @if (participantsCount() > 0) {
        <os-badge
          [variant]="'info'"
          [size]="'sm'"
          [text]="participantsCount().toString()"
          [position]="'inline'"
          [ariaLabel]="participantsCount() + ' participantes'"
        />
        }
      </div>

      @if (loading()) {
      <div class="collaboration-dashboard__loading" role="status" [attr.aria-live]="'polite'">
        <p class="collaboration-dashboard__loading-text">Carregando participantes...</p>
      </div>
      } @else if (error()) {
      <div class="collaboration-dashboard__error" role="alert" [attr.aria-live]="'assertive'">
        <p class="collaboration-dashboard__error-text">{{ error() }}</p>
      </div>
      } @else if (participants().length === 0) {
      <div class="collaboration-dashboard__empty" role="status">
        <p class="collaboration-dashboard__empty-text">Nenhum participante adicionado ainda</p>
      </div>
      } @else {
      <div
        class="collaboration-dashboard__grid"
        role="list"
        [attr.aria-label]="'Lista de participantes do orçamento'"
      >
        @for (participant of participants(); track participant.id) {
        <os-card
          class="collaboration-dashboard__participant-card"
          [variant]="'default'"
          [size]="'medium'"
          [clickable]="false"
          [actions]="!isCreator(participant.id)"
          [ariaLabel]="getParticipantAriaLabel(participant)"
          role="listitem"
        >
          <div class="collaboration-dashboard__participant-content">
            <div class="collaboration-dashboard__participant-avatar">
              <span class="collaboration-dashboard__participant-initial">{{
                getInitial(participant.name)
              }}</span>
            </div>

            <div class="collaboration-dashboard__participant-info">
              <div class="collaboration-dashboard__participant-name-row">
                <span class="collaboration-dashboard__participant-name">{{
                  participant.name
                }}</span>
                @if (isCreator(participant.id)) {
                <os-badge
                  [variant]="'info'"
                  [size]="'sm'"
                  [text]="'Criador'"
                  [position]="'inline'"
                  [ariaLabel]="'Criador do orçamento'"
                />
                }
              </div>
              <span class="collaboration-dashboard__participant-email">{{
                participant.email
              }}</span>
            </div>
          </div>

          @if (!isCreator(participant.id)) {
          <div class="collaboration-dashboard__participant-actions" slot="actions">
            <os-button
              variant="danger"
              size="small"
              [icon]="'remove'"
              [loading]="removingParticipantId() === participant.id"
              [disabled]="
                removingParticipantId() !== null && removingParticipantId() !== participant.id
              "
              [attr.aria-label]="'Remover ' + participant.name + ' do orçamento'"
              (click)="onRemoveParticipant(participant.id)"
            >
              Remover
            </os-button>
          </div>
          }
        </os-card>
        }
      </div>
      }
    </div>
  `,
  styleUrl: './collaboration-dashboard.component.scss',
})
export class CollaborationDashboardComponent {
  private readonly sharingState = inject(SharingState);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly budgetId = input.required<string>();
  readonly creatorId = input<string | null>(null);

  readonly participantRemoved = output<string>();

  readonly participants = computed(() => this.sharingState.participants());
  readonly loading = computed(() => this.sharingState.loading());
  readonly error = computed(() => this.sharingState.error());
  readonly participantsCount = computed(() => this.participants().length);

  private readonly _removingParticipantId = signal<string | null>(null);
  readonly removingParticipantId = this._removingParticipantId.asReadonly();

  readonly containerClass = computed(() => {
    return [
      'collaboration-dashboard',
      this.loading() ? 'collaboration-dashboard--loading' : '',
      this.error() ? 'collaboration-dashboard--error' : '',
      this.participants().length === 0 ? 'collaboration-dashboard--empty' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });
  
  isCreator(participantId: string): boolean {
    const creatorId = this.creatorId();
    if (creatorId) {
      return participantId === creatorId;
    }

    const currentUser = this.authService.currentUser();
    if (currentUser) {
      return participantId === currentUser.id;
    }

    return false;
  }
  
  getInitial(name: string): string {
    if (!name || name.trim().length === 0) return '?';
    const parts = name.trim().split(' ').filter((part) => part.length > 0);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  
  getParticipantAriaLabel(participant: BudgetParticipantDto): string {
    const creatorText = this.isCreator(participant.id) ? ' (Criador)' : '';
    return `${participant.name}${creatorText} - ${participant.email}`;
  }

  constructor() {
    effect(
      () => {
        const isLoading = this.loading();
        if (!isLoading && this._removingParticipantId() !== null) {
          const removedId = this._removingParticipantId();
          this._removingParticipantId.set(null);
          if (removedId) {
            this.participantRemoved.emit(removedId);
          }
        }
      }
    );
  }
  
  onRemoveParticipant(participantId: string): void {
    if (this.isCreator(participantId)) {
      return;
    }

    const creatorId = this.creatorId();
    this._removingParticipantId.set(participantId);
    const budgetId = this.budgetId();
    this.sharingState.removeParticipant(budgetId, participantId, creatorId);
  }
}
