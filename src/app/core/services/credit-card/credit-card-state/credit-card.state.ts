import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import type {
  CreditCardBillDto,
  CreditCardDto,
  CreateCreditCardBillRequestDto,
  CreateCreditCardRequestDto,
  DeleteCreditCardBillRequestDto,
  DeleteCreditCardRequestDto,
  PayCreditCardBillRequestDto,
  ReopenCreditCardBillRequestDto,
  UpdateCreditCardBillRequestDto,
  UpdateCreditCardRequestDto,
} from '../../../../../dtos/credit-card';
import { AuthService } from '../../auth/auth.service';
import { BudgetSelectionService } from '../../budget-selection/budget-selection.service';
import { CreditCardApiService } from '../credit-card-api/credit-card-api.service';

@Injectable({
  providedIn: 'root',
})
export class CreditCardState {
  private readonly creditCardApi = inject(CreditCardApiService);
  private readonly budgetSelectionService = inject(BudgetSelectionService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _creditCards = signal<CreditCardDto[]>([]);
  private readonly _bills = signal<CreditCardBillDto[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly creditCards = this._creditCards.asReadonly();
  readonly bills = this._bills.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly hasCreditCards = computed(() => this._creditCards().length > 0);
  readonly creditCardsCount = computed(() => this._creditCards().length);

  readonly creditCardsByBudgetId = computed(() => {
    const budgetId = this.budgetSelectionService.selectedBudgetId();
    if (!budgetId) {
      return [];
    }
    return this._creditCards();
  });

  billsByCreditCardId(creditCardId: string): CreditCardBillDto[] {
    return this._bills().filter((bill) => bill.creditCardId === creditCardId);
  }

  readonly selectedBudgetId = this.budgetSelectionService.selectedBudgetId;

  loadCreditCards(force = false): void {
    const budgetId = this.budgetSelectionService.selectedBudgetId();

    if (!budgetId) {
      this._error.set('Nenhum orçamento selecionado');
      return;
    }

    if (!force && this._loading()) {
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    this.creditCardApi
      .listCreditCards(budgetId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (creditCards) => {
          this._creditCards.set(creditCards);
          this._loading.set(false);
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao carregar cartões de crédito');
          this._loading.set(false);
        },
      });
  }

  loadCreditCardBills(creditCardId?: string, budgetId?: string): void {
    const selectedBudgetId = budgetId || this.budgetSelectionService.selectedBudgetId();

    if (!selectedBudgetId && !creditCardId) {
      this._error.set('Nenhum orçamento ou cartão selecionado');
      return;
    }

    if (this._loading()) {
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    this.creditCardApi
      .listCreditCardBills(creditCardId, selectedBudgetId || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (bills) => {
          this._bills.set(bills);
          this._loading.set(false);
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao carregar faturas');
          this._loading.set(false);
        },
      });
  }

  createCreditCard(dto: CreateCreditCardRequestDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.creditCardApi
      .createCreditCard(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (creditCardId) => {
          if (creditCardId) {
            this.loadCreditCards(true);
          } else {
            this._error.set('Falha ao criar cartão de crédito');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao criar cartão de crédito');
          this._loading.set(false);
        },
      });
  }

  updateCreditCard(dto: UpdateCreditCardRequestDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.creditCardApi
      .updateCreditCard(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          if (success) {
            this.loadCreditCards(true);
          } else {
            this._error.set('Falha ao atualizar cartão de crédito');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao atualizar cartão de crédito');
          this._loading.set(false);
        },
      });
  }

  deleteCreditCard(dto: DeleteCreditCardRequestDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.creditCardApi
      .deleteCreditCard(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          if (success) {
            this.loadCreditCards(true);
          } else {
            this._error.set(
              'Falha ao excluir cartão de crédito. O cartão pode ter faturas vinculadas.'
            );
            this._loading.set(false);
          }
        },
        error: (error) => {
          const errorMessage = error?.message || '';
          if (errorMessage.includes('bills') || errorMessage.includes('faturas')) {
            this._error.set('O cartão possui faturas vinculadas e não pode ser excluído.');
          } else {
            this._error.set(
              errorMessage ||
                'Erro ao excluir cartão de crédito. O cartão pode ter faturas vinculadas e não pode ser excluído.'
            );
          }
          this._loading.set(false);
        },
      });
  }

  createCreditCardBill(dto: CreateCreditCardBillRequestDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.creditCardApi
      .createCreditCardBill(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (billId) => {
          if (billId) {
            this.loadCreditCardBills(dto.creditCardId);
          } else {
            this._error.set('Falha ao criar fatura');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao criar fatura');
          this._loading.set(false);
        },
      });
  }

  updateCreditCardBill(dto: UpdateCreditCardBillRequestDto): void {
    this._loading.set(true);
    this._error.set(null);

    const bill = this._bills().find((b) => b.id === dto.id);
    const creditCardId = bill?.creditCardId;

    this.creditCardApi
      .updateCreditCardBill(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          if (success) {
            if (creditCardId) {
              this.loadCreditCardBills(creditCardId);
            } else {
              this.loadCreditCardBills();
            }
          } else {
            this._error.set('Falha ao atualizar fatura');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao atualizar fatura');
          this._loading.set(false);
        },
      });
  }

  deleteCreditCardBill(dto: DeleteCreditCardBillRequestDto): void {
    this._loading.set(true);
    this._error.set(null);

    const bill = this._bills().find((b) => b.id === dto.id);
    const creditCardId = bill?.creditCardId;

    this.creditCardApi
      .deleteCreditCardBill(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          if (success) {
            if (creditCardId) {
              this.loadCreditCardBills(creditCardId);
            } else {
              this.loadCreditCardBills();
            }
          } else {
            this._error.set('Falha ao excluir fatura');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao excluir fatura');
          this._loading.set(false);
        },
      });
  }

  payCreditCardBill(dto: PayCreditCardBillRequestDto): void {
    const user = this.authService.user();

    if (!user) {
      this._error.set('Usuário não autenticado');
      return;
    }

    const payDto: PayCreditCardBillRequestDto = {
      ...dto,
      userId: user.id,
    };

    this._loading.set(true);
    this._error.set(null);

    this.creditCardApi
      .payCreditCardBill(payDto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          if (success) {
            const bill = this._bills().find((b) => b.id === dto.creditCardBillId);
            if (bill) {
              this.loadCreditCardBills(bill.creditCardId);
            } else {
              this.loadCreditCardBills();
            }
          } else {
            this._error.set('Falha ao pagar fatura');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao pagar fatura');
          this._loading.set(false);
        },
      });
  }

  reopenCreditCardBill(dto: ReopenCreditCardBillRequestDto): void {
    const user = this.authService.user();

    if (!user) {
      this._error.set('Usuário não autenticado');
      return;
    }

    const reopenDto: ReopenCreditCardBillRequestDto = {
      ...dto,
      userId: user.id,
    };

    this._loading.set(true);
    this._error.set(null);

    this.creditCardApi
      .reopenCreditCardBill(reopenDto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (success) => {
          if (success) {
            const bill = this._bills().find((b) => b.id === dto.creditCardBillId);
            if (bill) {
              this.loadCreditCardBills(bill.creditCardId);
            } else {
              this.loadCreditCardBills();
            }
          } else {
            this._error.set('Falha ao reabrir fatura');
            this._loading.set(false);
          }
        },
        error: (error) => {
          this._error.set(error?.message || 'Erro ao reabrir fatura');
          this._loading.set(false);
        },
      });
  }

  clearError(): void {
    this._error.set(null);
  }

  refreshCreditCards(): void {
    this.loadCreditCards(true);
  }

  refreshBills(creditCardId?: string): void {
    this.loadCreditCardBills(creditCardId);
  }
}
