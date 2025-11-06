import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsCardComponent } from '../os-card/os-card.component';
import { OsMoneyDisplayComponent } from '../os-money-display/os-money-display.component';
import { OsButtonComponent } from '../../atoms/os-button';
import { CreditCardDto } from '../../../../../dtos/credit-card/credit-card-types';

@Component({
  selector: 'os-credit-card-card',
  imports: [
    CommonModule,
    OsCardComponent,
    OsMoneyDisplayComponent,
    OsButtonComponent,
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
            [value]="creditCard().limit"
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
  creditCard = input.required<CreditCardDto>();
  actions = input<{ edit: boolean; delete: boolean } | undefined>(undefined);

  edit = output<CreditCardDto>();
  delete = output<CreditCardDto>();

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

  private formatLimit(limit: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(limit);
  }
}

