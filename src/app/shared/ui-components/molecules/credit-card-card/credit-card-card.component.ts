import { Component, input, output, computed, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsCardComponent } from '../os-card/os-card.component';
import { OsMoneyDisplayComponent } from '../os-money-display/os-money-display.component';
import { OsButtonComponent } from '../../atoms/os-button';
import { OsIconComponent } from '../../atoms/os-icon/os-icon.component';
import { CreditCardBillItemComponent } from '../credit-card-bill-item/credit-card-bill-item.component';
import { LocaleService } from '@shared/formatting';
import { CreditCardDto } from '../../../../../dtos/credit-card/credit-card-types';
import { CreditCardBillDto } from '../../../../../dtos/credit-card/credit-card-bill-types';
import { CreditCardState } from '../../../../core/services/credit-card/credit-card-state/credit-card.state';

@Component({
  selector: 'os-credit-card-card',
  imports: [
    CommonModule,
    OsCardComponent,
    OsMoneyDisplayComponent,
    OsButtonComponent,
    OsIconComponent,
    CreditCardBillItemComponent,
  ],
  template: `
    <os-card
      [variant]="'default'"
      [size]="'medium'"
      [clickable]="false"
      [actions]="!!(actions()?.edit || actions()?.delete)"
      [ariaLabel]="ariaLabelText()"
    >
      <div class="os-credit-card-card__content">
        <div class="os-credit-card-card__header">
          <div class="os-credit-card-card__title-section">
            <h3 class="os-credit-card-card__name">{{ creditCard().name }}</h3>
            <span class="os-credit-card-card__type">Cartão de Crédito</span>
          </div>
        </div>

        <div class="os-credit-card-card__limit">
          <span class="os-credit-card-card__limit-label">Limite</span>
          <os-money-display
            [value]="creditCard().limit / 100"
            [currency]="'BRL'"
            [size]="'lg'"
            [ariaLabel]="getLimitAriaLabel()"
          />
        </div>

        <div class="os-credit-card-card__info">
          <div class="os-credit-card-card__info-item">
            <span class="os-credit-card-card__info-label">Fechamento</span>
            <span class="os-credit-card-card__info-value">Dia {{ creditCard().closingDay }}</span>
          </div>
          <div class="os-credit-card-card__info-item">
            <span class="os-credit-card-card__info-label">Vencimento</span>
            <span class="os-credit-card-card__info-value">Dia {{ creditCard().dueDay }}</span>
          </div>
        </div>

        @if (showBills()) {
        <div class="os-credit-card-card__bills-section">
          <button
            type="button"
            class="os-credit-card-card__expand-button"
            [attr.aria-expanded]="isExpanded()"
            [attr.aria-label]="getExpandButtonAriaLabel()"
            (click)="toggleExpanded()"
          >
            <span class="os-credit-card-card__expand-label">Faturas ({{ billsCount() }})</span>
            <os-icon
              [name]="isExpanded() ? 'expand_less' : 'expand_more'"
              [size]="'sm'"
              [attr.aria-hidden]="true"
            />
          </button>

          @if (isExpanded()) {
          <div class="os-credit-card-card__bills-list" role="list" [attr.aria-label]="'Lista de faturas'">
            @if (bills().length === 0) {
            <p class="os-credit-card-card__bills-empty">Nenhuma fatura encontrada</p>
            } @else {
            @for (bill of bills(); track bill.id) {
            <div class="os-credit-card-card__bill-item" role="listitem">
              <os-credit-card-bill-item
                [bill]="bill"
                [actions]="{ pay: true, reopen: true }"
                (pay)="onPayBill($event)"
                (reopen)="onReopenBill($event)"
              />
            </div>
            }
            }
          </div>
          }
        </div>
        }
      </div>

      @if (actions()?.edit || actions()?.delete) {
      <div class="os-credit-card-card__actions" slot="actions">
        @if (actions()?.edit) {
        <os-button
          variant="tertiary"
          size="small"
          [icon]="'edit'"
          [ariaLabel]="'Editar cartão ' + creditCard().name"
          (buttonClick)="onEdit()"
        />
        } @if (actions()?.delete) {
        <os-button
          variant="danger"
          size="small"
          [icon]="'delete'"
          [ariaLabel]="'Excluir cartão ' + creditCard().name"
          (buttonClick)="onDelete()"
        />
        }
      </div>
      }
    </os-card>
  `,
  styleUrls: ['./credit-card-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardCardComponent {
  private readonly creditCardState = inject(CreditCardState);
  private readonly localeService = inject(LocaleService);

  creditCard = input.required<CreditCardDto>();
  actions = input<{ edit: boolean; delete: boolean } | undefined>(undefined);
  showBills = input<boolean>(true);

  edit = output<CreditCardDto>();
  delete = output<CreditCardDto>();
  payBill = output<CreditCardBillDto>();
  reopenBill = output<CreditCardBillDto>();

  private readonly _isExpanded = signal<boolean>(false);
  readonly isExpanded = this._isExpanded.asReadonly();

  readonly bills = computed(() => {
    if (!this.showBills()) return [];
    return this.creditCardState.billsByCreditCardId(this.creditCard().id);
  });

  readonly billsCount = computed(() => this.bills().length);

  ariaLabelText = computed(() => {
    const card = this.creditCard();
    if (!card) return 'Card de cartão de crédito';
    return `Cartão de crédito ${card.name}, limite ${this.formatLimit(card.limit)}, fechamento dia ${card.closingDay}, vencimento dia ${card.dueDay}`;
  });

  getLimitAriaLabel = computed(() => {
    const card = this.creditCard();
    if (!card) return 'Limite do cartão';
    return `Limite do cartão ${card.name}: ${this.formatLimit(card.limit)}`;
  });

  onEdit(): void {
    const card = this.creditCard();
    if (card) {
      this.edit.emit(card);
    }
  }

  onDelete(): void {
    const card = this.creditCard();
    if (card) {
      this.delete.emit(card);
    }
  }

  toggleExpanded(): void {
    const newExpanded = !this._isExpanded();
    this._isExpanded.set(newExpanded);
    if (newExpanded && this.showBills()) {
      this.creditCardState.loadCreditCardBills(this.creditCard().id);
    }
  }

  onPayBill(bill: CreditCardBillDto): void {
    this.payBill.emit(bill);
  }

  onReopenBill(bill: CreditCardBillDto): void {
    this.reopenBill.emit(bill);
  }

  getExpandButtonAriaLabel = computed(() => {
    const count = this.billsCount();
    const expanded = this.isExpanded();
    return expanded
      ? `Recolher lista de faturas (${count} faturas)`
      : `Expandir lista de faturas (${count} faturas)`;
  });

  private formatLimit(limit: number): string {
    return this.localeService.formatCurrency(limit / 100, 'BRL');
  }
}
