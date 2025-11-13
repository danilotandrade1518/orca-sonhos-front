import { Component, input, output, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsMoneyDisplayComponent } from '../os-money-display/os-money-display.component';
import { OsButtonComponent } from '../../atoms/os-button';
import { OsBadgeComponent } from '../../atoms/os-badge/os-badge.component';
import { CreditCardBillDto } from '../../../../../dtos/credit-card/credit-card-bill-types';
import { LocaleService } from '@shared/formatting';

@Component({
  selector: 'os-credit-card-bill-item',
  imports: [
    CommonModule,
    OsMoneyDisplayComponent,
    OsButtonComponent,
    OsBadgeComponent,
  ],
  template: `
    <div class="os-credit-card-bill-item" [attr.aria-label]="ariaLabelText()">
      <div class="os-credit-card-bill-item__content">
        <div class="os-credit-card-bill-item__header">
          <div class="os-credit-card-bill-item__amount">
            <os-money-display
              [value]="bill().amount / 100"
              [currency]="'BRL'"
              [size]="'md'"
              [ariaLabel]="getAmountAriaLabel()"
            />
          </div>
          <os-badge
            [variant]="statusBadgeVariant()"
            [size]="'sm'"
            [text]="statusBadgeText()"
            [attr.aria-label]="getStatusAriaLabel()"
          />
        </div>

        <div class="os-credit-card-bill-item__info">
          <div class="os-credit-card-bill-item__info-item">
            <span class="os-credit-card-bill-item__info-label">Vencimento</span>
            <span class="os-credit-card-bill-item__info-value">{{ formattedDueDate() }}</span>
          </div>
          @if (bill().closingDate) {
          <div class="os-credit-card-bill-item__info-item">
            <span class="os-credit-card-bill-item__info-label">Fechamento</span>
            <span class="os-credit-card-bill-item__info-value">{{ formattedClosingDate() }}</span>
          </div>
          }
        </div>
      </div>

      <div class="os-credit-card-bill-item__actions">
        @if (!bill().paid && actions()?.pay) {
        <os-button
          variant="primary"
          size="small"
          [icon]="'payment'"
          [ariaLabel]="'Pagar fatura de ' + formattedAmount()"
          (buttonClick)="onPay()"
        >
          Pagar
        </os-button>
        } @if (bill().paid && actions()?.reopen) {
        <os-button
          variant="secondary"
          size="small"
          [icon]="'refresh'"
          [ariaLabel]="'Reabrir fatura de ' + formattedAmount()"
          (buttonClick)="onReopen()"
        >
          Reabrir
        </os-button>
        }
      </div>
    </div>
  `,
  styleUrls: ['./credit-card-bill-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardBillItemComponent {
  private readonly localeService = inject(LocaleService);

  bill = input.required<CreditCardBillDto>();
  actions = input<{ pay: boolean; reopen: boolean } | undefined>(undefined);

  pay = output<CreditCardBillDto>();
  reopen = output<CreditCardBillDto>();

  ariaLabelText = computed(() => {
    const billData = this.bill();
    if (!billData) return 'Item de fatura de cartão de crédito';
    const status = billData.paid ? 'paga' : 'aberta';
    return `Fatura de ${this.formattedAmount()}, vencimento ${this.formattedDueDate()}, status ${status}`;
  });

  getAmountAriaLabel = computed(() => {
    const billData = this.bill();
    if (!billData) return 'Valor da fatura';
    return `Valor da fatura: ${this.formattedAmount()}`;
  });

  getStatusAriaLabel = computed(() => {
    const billData = this.bill();
    if (!billData) return 'Status da fatura';
    return `Status da fatura: ${billData.paid ? 'Paga' : 'Aberta'}`;
  });

  statusBadgeVariant = computed(() => {
    return this.bill().paid ? 'success' : 'warning';
  });

  statusBadgeText = computed(() => {
    return this.bill().paid ? 'Paga' : 'Aberta';
  });

  formattedAmount = computed(() => {
    return this.localeService.formatCurrency(this.bill().amount / 100, 'BRL');
  });

  formattedDueDate = computed(() => {
    return this.localeService.formatDateShort(this.bill().dueDate);
  });

  formattedClosingDate = computed(() => {
    if (!this.bill().closingDate) return '';
    return this.localeService.formatDateShort(this.bill().closingDate);
  });

  onPay(): void {
    const billData = this.bill();
    if (billData) {
      this.pay.emit(billData);
    }
  }

  onReopen(): void {
    const billData = this.bill();
    if (billData) {
      this.reopen.emit(billData);
    }
  }
}
