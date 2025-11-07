import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BudgetParticipantDto } from '../../../../dtos/budget';
import { BudgetService } from '../budget/budget.service';
import { SharingService } from './sharing.service';

@Injectable({
  providedIn: 'root',
})
export class SharingState {
  private readonly sharingService = inject(SharingService);
  private readonly budgetService = inject(BudgetService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _participants = signal<BudgetParticipantDto[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly participants = this._participants.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasParticipants = computed(() => this._participants().length > 0);
  readonly participantsCount = computed(() => this._participants().length);

  isCreator(userId: string): boolean {
    const participants = this._participants();
    const creator = participants.find((p) => p.id === userId);
    return creator !== undefined;
  }

  loadParticipants(budgetId: string): void {
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
        },
      });
  }

  addParticipant(budgetId: string, participantId: string): void {
    this._loading.set(true);
    this._error.set(null);

    this.sharingService
      .addParticipant(budgetId, participantId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          if (success) {
            this.loadParticipants(budgetId);
          } else {
            this._error.set('Failed to add participant');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Failed to add participant');
          this._loading.set(false);
        },
      });
  }

  removeParticipant(budgetId: string, participantId: string): void {
    this._loading.set(true);
    this._error.set(null);

    this.sharingService
      .removeParticipant(budgetId, participantId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          if (success) {
            this.loadParticipants(budgetId);
          } else {
            this._error.set('Failed to remove participant');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Failed to remove participant');
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

