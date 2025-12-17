import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';

import { BudgetParticipantDto } from '../../../../dtos/budget';
import { BudgetService } from '../budget/budget.service';
import { BudgetState } from '../budget/budget.state';
import { NotificationService } from '../notification/notification.service';
import { SharingService } from './sharing.service';

@Injectable({
  providedIn: 'root',
})
export class SharingState {
  private readonly sharingService = inject(SharingService);
  private readonly budgetService = inject(BudgetService);
  private readonly budgetState = inject(BudgetState);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  private pollingSubscription: Subscription | null = null;
  private currentBudgetId: string | null = null;
  private readonly POLLING_INTERVAL = 30000;

  private readonly _participants = signal<BudgetParticipantDto[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly participants = this._participants.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasParticipants = computed(() => this._participants().length > 0);
  readonly participantsCount = computed(() => this._participants().length);

  constructor() {
    effect(() => {
      const participants = this._participants();
      const count = participants.length;
      if (this.currentBudgetId && count >= 0) {
        this.budgetState.updateBudgetParticipantsCount(this.currentBudgetId, count);
      }
    });
  }

  isCreator(userId: string): boolean {
    const participants = this._participants();
    const creator = participants.find((p) => p.id === userId);
    return creator !== undefined;
  }

  loadParticipants(budgetId: string): void {
    this.currentBudgetId = budgetId;
    this._loading.set(true);
    this._error.set(null);

    this.budgetService
      .getBudgetOverview(budgetId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (overview) => {
          if (overview) {
            this._participants.set(overview.participants || []);
          } else {
            this._participants.set([]);
          }
          this._loading.set(false);
        },
        error: (error) => {
          this._error.set(error?.message || 'Failed to load participants');
          this._loading.set(false);

          this._participants.set([]);
        },
      });
  }

  addParticipant(budgetId: string, participantId: string): void {
    const currentParticipants = this._participants();
    const isAlreadyParticipant = currentParticipants.some((p) => p.id === participantId);

    if (isAlreadyParticipant) {
      this._error.set('Este usuário já é participante do orçamento');
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    this.sharingService
      .addParticipant(budgetId, participantId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          if (success) {
            this.notificationService.showSuccess('Participante adicionado com sucesso!');
            this.loadParticipants(budgetId);
            this.budgetState.loadBudgets();
          } else {
            this._error.set('Falha ao adicionar participante. Tente novamente.');
            this._loading.set(false);
          }
        },
        error: (error) => {
          const errorMessage =
            error?.message ||
            error?.error?.message ||
            'Falha ao adicionar participante. Tente novamente.';
          this._error.set(errorMessage);
          this._loading.set(false);
        },
      });
  }

  removeParticipant(budgetId: string, participantId: string, creatorId?: string | null): void {
    if (creatorId && participantId === creatorId) {
      this._error.set('Não é possível remover o criador do orçamento');
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    this.sharingService
      .removeParticipant(budgetId, participantId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          if (success) {
            this.notificationService.showSuccess('Participante removido com sucesso!');
            this.loadParticipants(budgetId);
            this.budgetState.loadBudgets();
          } else {
            this._error.set('Falha ao remover participante. Tente novamente.');
            this._loading.set(false);
          }
        },
        error: (error) => {
          const errorMessage =
            error?.message ||
            error?.error?.message ||
            'Falha ao remover participante. Tente novamente.';
          this._error.set(errorMessage);
          this._loading.set(false);
        },
      });
  }

  clearParticipants(): void {
    this._participants.set([]);
  }

  clearError(): void {
    this._error.set(null);
  }
}
