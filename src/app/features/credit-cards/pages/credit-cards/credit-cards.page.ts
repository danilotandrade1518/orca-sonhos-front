import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CreditCardState } from '@core/services/credit-card/credit-card-state/credit-card.state';
import { BudgetSelectionService } from '@core/services/budget-selection/budget-selection.service';
import { CreditCardCardComponent } from '@shared/ui-components/molecules/credit-card-card';
import { CreditCardFormComponent } from '../../components/credit-card-form';
import { CreditCardBillFormComponent } from '../../components/credit-card-bill-form';
import { PayBillModalComponent } from '../../components/pay-bill-modal';
import { ReopenBillModalComponent } from '../../components/reopen-bill-modal';
import { ConfirmDeleteCreditCardModalComponent } from '../../components/confirm-delete-modal';
import type { CreditCardDto } from '../../../../../dtos/credit-card/credit-card-types';
import type { CreditCardBillDto } from '../../../../../dtos/credit-card';

@Component({
  selector: 'os-credit-cards-page',
  standalone: true,
  imports: [
    CommonModule,
    CreditCardCardComponent,
    CreditCardFormComponent,
    CreditCardBillFormComponent,
    PayBillModalComponent,
    ReopenBillModalComponent,
    ConfirmDeleteCreditCardModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="os-credit-cards" role="main" aria-label="Página de cartões de crédito">
      <a href="#main-content" class="os-credit-cards__skip-link">Pular para conteúdo principal</a>

      <header class="os-credit-cards__header">
        <div class="os-credit-cards__header-content">
          <div>
            <h1 class="os-credit-cards__title">Cartões de Crédito</h1>
            <p class="os-credit-cards__subtitle">Gerencie seus cartões e faturas</p>
          </div>
          <div class="os-credit-cards__actions">
            <button
              type="button"
              class="os-credit-cards__action-button os-credit-cards__action-button--primary"
              (click)="openCreateModal()"
              [disabled]="!selectedBudgetId()"
              aria-label="Criar novo cartão de crédito"
            >
              Novo Cartão
            </button>
            <button
              type="button"
              class="os-credit-cards__action-button os-credit-cards__action-button--secondary"
              (click)="openCreateBillModal()"
              [disabled]="!selectedBudgetId() || !hasCreditCards()"
              aria-label="Criar nova fatura"
            >
              Nova Fatura
            </button>
          </div>
        </div>
      </header>

      <div
        class="os-credit-cards__live-region"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        [attr.aria-label]="state.loading() ? 'Carregando cartões de crédito' : ''"
      >
        {{ state.loading() ? 'Carregando cartões de crédito...' : '' }}
      </div>

      @if (state.error()) {
      <div
        class="os-credit-cards__live-region os-credit-cards__live-region--error"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        {{ state.error() }}
      </div>
      }

      <div id="main-content" tabindex="-1" class="os-credit-cards__content">
        @switch (currentState()) { @case ('loading') {
        <div
          class="os-credit-cards__loading"
          role="status"
          aria-live="polite"
          aria-label="Carregando cartões de crédito"
        >
          <div class="os-credit-cards__spinner" aria-hidden="true"></div>
          <p>Carregando cartões de crédito...</p>
        </div>
        } @case ('error') {
        <div class="os-credit-cards__error" role="alert" aria-live="assertive">
          <p class="os-credit-cards__error-message">{{ errorMessage() }}</p>
          <button
            type="button"
            class="os-credit-cards__retry-button"
            (click)="retry()"
            aria-label="Tentar carregar cartões de crédito novamente"
          >
            Tentar Novamente
          </button>
        </div>
        } @case ('empty') {
        <div class="os-credit-cards__empty" role="status" aria-live="polite">
          <div class="os-credit-cards__empty-icon" aria-hidden="true">💳</div>
          <h2 class="os-credit-cards__empty-title">Nenhum cartão cadastrado</h2>
          <p class="os-credit-cards__empty-description">
            Crie seu primeiro cartão para começar a gerenciar suas faturas
          </p>
          <button
            type="button"
            class="os-credit-cards__create-button"
            (click)="openCreateModal()"
            [disabled]="!selectedBudgetId()"
            aria-label="Criar primeiro cartão de crédito"
          >
            Criar primeiro cartão
          </button>
        </div>
        } @default {
        <div class="os-credit-cards__grid">
          @for (creditCard of creditCards(); track creditCard.id) {
          <os-credit-card-card
            [creditCard]="creditCard"
            [actions]="{ edit: true, delete: true }"
            [showBills]="true"
            (edit)="onEditCreditCard($event)"
            (delete)="onDeleteCreditCard($event)"
            (payBill)="onPayBill($event)"
            (reopenBill)="onReopenBill($event)"
          />
          }
        </div>
        } }
      </div>

      @if (showCreateModal()) {
      <os-credit-card-form [mode]="'create'" (saved)="onFormSaved()" (cancelled)="onFormCancelled()" />
      } @if (showEditModal() && editingCreditCard()) {
      <os-credit-card-form
        [creditCard]="editingCreditCard()!"
        [mode]="'edit'"
        (saved)="onFormSaved()"
        (cancelled)="onFormCancelled()"
      />
      } @if (showCreateBillModal()) {
      <os-credit-card-bill-form [mode]="'create'" (saved)="onBillFormSaved()" (cancelled)="onBillFormCancelled()" />
      } @if (showDeleteModal() && deletingCreditCard()) {
      <os-confirm-delete-credit-card-modal
        [creditCard]="deletingCreditCard()!"
        (closed)="closeDeleteModal()"
      />
      } @if (showPayBillModal() && payingBill()) {
      <os-pay-bill-modal [creditCardBill]="payingBill()!" (closed)="closePayBillModal()" />
      } @if (showReopenBillModal() && reopeningBill()) {
      <os-reopen-bill-modal [creditCardBill]="reopeningBill()!" (closed)="closeReopenBillModal()" />
      }
    </section>
  `,
  styleUrl: './credit-cards.page.scss',
})
export class CreditCardsPage implements OnInit {
  readonly state = inject(CreditCardState);
  private readonly budgetSelection = inject(BudgetSelectionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private _lastBudgetId: string | null = null;

  readonly selectedBudgetId = this.budgetSelection.selectedBudgetId;
  readonly creditCards = computed(() => this.state.creditCardsByBudgetId());
  readonly hasCreditCards = computed(() => this.creditCards().length > 0);

  readonly editingCreditCard = signal<CreditCardDto | null>(null);
  readonly deletingCreditCard = signal<CreditCardDto | null>(null);
  readonly payingBill = signal<CreditCardBillDto | null>(null);
  readonly reopeningBill = signal<CreditCardBillDto | null>(null);

  readonly showCreateModal = computed(() => {
    return this.route.snapshot.data['modalMode'] === 'create';
  });

  readonly showEditModal = computed(() => {
    return this.route.snapshot.data['modalMode'] === 'edit' && this.editingCreditCard() !== null;
  });

  readonly showCreateBillModal = signal(false);
  readonly showDeleteModal = signal(false);
  readonly showPayBillModal = signal(false);
  readonly showReopenBillModal = signal(false);

  readonly currentState = computed(() => {
    if (this.state.loading()) return 'loading';
    if (this.state.error()) return 'error';
    if (!this.selectedBudgetId()) return 'empty';
    if (this.creditCards().length === 0) return 'empty';
    return 'success';
  });

  readonly errorMessage = computed(() => this.state.error() || 'Erro ao carregar cartões de crédito');

  constructor() {
    effect(() => {
      const budgetId = this.selectedBudgetId();

      if (budgetId === this._lastBudgetId || this.state.loading()) {
        return;
      }

      untracked(() => {
        if (budgetId) {
          this._lastBudgetId = budgetId;
          this.state.loadCreditCards();
        } else {
          this._lastBudgetId = null;
        }
      });
    });
  }

  ngOnInit(): void {
    const budgetId = this.selectedBudgetId();
    if (budgetId) {
      this.state.loadCreditCards();
    }

    const creditCardId = this.route.snapshot.paramMap.get('id');
    if (creditCardId && this.route.snapshot.data['modalMode'] === 'edit') {
      const creditCards = this.state.creditCards();
      const creditCard = creditCards.find((cc) => cc.id === creditCardId);
      if (creditCard) {
        this.editingCreditCard.set(creditCard);
      }
    }
  }

  retry(): void {
    this.state.loadCreditCards(true);
  }

  openCreateModal(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  openCreateBillModal(): void {
    if (!this.selectedBudgetId() || !this.hasCreditCards()) {
      return;
    }
    this.showCreateBillModal.set(true);
  }

  onEditCreditCard(creditCard: CreditCardDto): void {
    this.editingCreditCard.set(creditCard);
    this.router.navigate([creditCard.id, 'edit'], { relativeTo: this.route });
  }

  onDeleteCreditCard(creditCard: CreditCardDto): void {
    this.deletingCreditCard.set(creditCard);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.deletingCreditCard.set(null);
  }

  onFormSaved(): void {
    this.editingCreditCard.set(null);
    this.router.navigate(['/credit-cards'], { replaceUrl: true });
  }

  onFormCancelled(): void {
    this.editingCreditCard.set(null);
    this.router.navigate(['/credit-cards'], { replaceUrl: true });
  }

  onBillFormSaved(): void {
    this.showCreateBillModal.set(false);
    this.router.navigate(['/credit-cards'], { replaceUrl: true });
  }

  onBillFormCancelled(): void {
    this.showCreateBillModal.set(false);
    this.router.navigate(['/credit-cards'], { replaceUrl: true });
  }

  openPayBillModal(bill: CreditCardBillDto): void {
    this.payingBill.set(bill);
    this.showPayBillModal.set(true);
  }

  closePayBillModal(): void {
    this.showPayBillModal.set(false);
    this.payingBill.set(null);
  }

  openReopenBillModal(bill: CreditCardBillDto): void {
    this.reopeningBill.set(bill);
    this.showReopenBillModal.set(true);
  }

  closeReopenBillModal(): void {
    this.showReopenBillModal.set(false);
    this.reopeningBill.set(null);
  }

  onPayBill(bill: CreditCardBillDto): void {
    this.openPayBillModal(bill);
  }

  onReopenBill(bill: CreditCardBillDto): void {
    this.openReopenBillModal(bill);
  }
}
