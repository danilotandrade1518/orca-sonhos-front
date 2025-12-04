import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import type {
  CreateEnvelopeRequestDto,
  DeleteEnvelopeRequestDto,
  EnvelopeDto,
  UpdateEnvelopeRequestDto,
} from '../../../../../dtos/envelope';
import { BudgetSelectionService } from '../../budget-selection/budget-selection.service';
import { EnvelopesApiService } from '../envelopes-api/envelopes-api.service';

@Injectable({
  providedIn: 'root',
})
export class EnvelopeState {
  private readonly envelopesApi = inject(EnvelopesApiService);
  private readonly budgetSelectionService = inject(BudgetSelectionService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _envelopes = signal<EnvelopeDto[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly envelopes = this._envelopes.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasEnvelopes = computed(() => this._envelopes().length > 0);
  readonly envelopesCount = computed(() => this._envelopes().length);

  readonly envelopesByBudgetId = computed(() => {
    const budgetId = this.budgetSelectionService.selectedBudgetId();
    if (!budgetId) {
      return [];
    }
    return this._envelopes();
  });

  readonly overBudgetEnvelopes = computed(() =>
    this._envelopes().filter((e) => e.usagePercentage > 100)
  );

  readonly nearLimitEnvelopes = computed(() =>
    this._envelopes().filter((e) => e.usagePercentage >= 80 && e.usagePercentage <= 100)
  );

  readonly totalAllocated = computed(() =>
    this._envelopes().reduce((sum, e) => sum + e.limit, 0)
  );

  readonly totalSpent = computed(() =>
    this._envelopes().reduce((sum, e) => sum + e.currentUsage, 0)
  );

  readonly selectedBudgetId = this.budgetSelectionService.selectedBudgetId;

  loadEnvelopes(force = false): void {
    const budgetId = this.budgetSelectionService.selectedBudgetId();

    if (!budgetId) {
      this._error.set('Nenhum orçamento selecionado');
      this._envelopes.set([]);
      this._loading.set(false);
      return;
    }

    if (!force && this._loading()) {
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    this.envelopesApi
      .listEnvelopes(budgetId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (envelopes) => {
          this._envelopes.set(envelopes);
          this._loading.set(false);
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao carregar envelopes');
          this._loading.set(false);
          this._envelopes.set([]);
        },
      });
  }

  createEnvelope(dto: CreateEnvelopeRequestDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.envelopesApi
      .createEnvelope(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (envelopeId) => {
          if (envelopeId) {
            this.loadEnvelopes(true);
          } else {
            this._error.set('Falha ao criar envelope');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao criar envelope');
          this._loading.set(false);
        },
      });
  }

  updateEnvelope(dto: UpdateEnvelopeRequestDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.envelopesApi
      .updateEnvelope(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          if (success) {
            this.loadEnvelopes(true);
          } else {
            this._error.set('Falha ao atualizar envelope');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao atualizar envelope');
          this._loading.set(false);
        },
      });
  }

  deleteEnvelope(dto: DeleteEnvelopeRequestDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.envelopesApi
      .deleteEnvelope(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          if (success) {
            this.loadEnvelopes(true);
          } else {
            this._error.set('Falha ao excluir envelope');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao excluir envelope');
          this._loading.set(false);
        },
      });
  }

  clearError(): void {
    this._error.set(null);
  }
}
