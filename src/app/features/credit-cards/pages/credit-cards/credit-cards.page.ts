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
import { OsPageComponent } from '@shared/ui-components/organisms/os-page/os-page.component';
import { OsPageHeaderComponent, PageHeaderAction } from '@shared/ui-components/organisms/os-page-header/os-page-header.component';
import { OsButtonComponent } from '@shared/ui-components/atoms/os-button/os-button.component';
import { OsEntityListComponent } from '@shared/ui-components/organisms/os-entity-list/os-entity-list.component';
import { OsEmptyStateComponent } from '@shared/ui-components/molecules/os-empty-state/os-empty-state.component';
import { OsSkeletonComponent } from '@shared/ui-components/atoms/os-skeleton/os-skeleton.component';
import { OsAlertComponent } from '@shared/ui-components/molecules/os-alert/os-alert.component';
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
    OsPageComponent,
    OsPageHeaderComponent,
    OsButtonComponent,
    OsEntityListComponent,
    OsEmptyStateComponent,
    OsSkeletonComponent,
    OsAlertComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <os-page variant="default" size="medium" ariaLabel="Página de cartões de crédito">
      <os-page-header
        title="Cartões de Crédito"
        subtitle="Gerencie seus cartões e faturas"
        [actions]="pageHeaderActions()"
        (actionClick)="onPageHeaderActionClick($event)"
      />

      @if (currentState() === 'error') {
      <os-alert
        type="error"
        [title]="'Erro ao carregar cartões de crédito'"
        [role]="'alert'"
        [ariaLive]="'assertive'"
        [showIcon]="true"
        [dismissible]="false"
      >
        {{ errorMessage() }}
        <div class="credit-cards-page__error-action">
          <os-button
            variant="primary"
            size="medium"
            icon="refresh"
            (buttonClick)="retry()"
            [attr.aria-label]="'Tentar carregar cartões de crédito novamente'"
          >
            Tentar Novamente
          </os-button>
        </div>
      </os-alert>
      }

      <os-entity-list
        layout="grid"
        size="medium"
        [isLoading]="currentState() === 'loading'"
        [isEmpty]="currentState() === 'empty'"
        loadingText="Carregando cartões de crédito..."
        emptyTitle="Nenhum cartão cadastrado"
        emptyText="Crie seu primeiro cartão para começar a gerenciar suas faturas"
        emptyIcon="credit_card"
        [emptyAction]="!!selectedBudgetId()"
        emptyActionLabel="Criar primeiro cartão"
        emptyActionIcon="plus"
        ariaLabel="Lista de cartões de crédito"
        (emptyActionClick)="openCreateModal()"
      >
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
      </os-entity-list>

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
    </os-page>
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

  readonly pageHeaderActions = computed<PageHeaderAction[]>(() => {
    return [
      {
        label: 'Novo Cartão',
        icon: 'credit_card',
        variant: 'primary',
        size: 'medium',
        disabled: !this.selectedBudgetId(),
      },
      {
        label: 'Nova Fatura',
        icon: 'receipt',
        variant: 'secondary',
        size: 'medium',
        disabled: !this.selectedBudgetId() || !this.hasCreditCards(),
      },
    ];
  });

  onPageHeaderActionClick(action: PageHeaderAction): void {
    if (action.label === 'Novo Cartão') {
      this.openCreateModal();
    } else if (action.label === 'Nova Fatura') {
      this.openCreateBillModal();
    }
  }

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
