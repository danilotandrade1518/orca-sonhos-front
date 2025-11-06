import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsCardComponent } from '../os-card/os-card.component';
import { AccountTypeBadgeComponent } from '../../atoms/account-type-badge/account-type-badge.component';
import { OsMoneyDisplayComponent } from '../os-money-display/os-money-display.component';
import { OsButtonComponent } from '../../atoms/os-button';
import { AccountDto } from '../../../../../dtos/account/account-types';

@Component({
  selector: 'os-account-card',
  standalone: true,
  imports: [
    CommonModule,
    OsCardComponent,
    AccountTypeBadgeComponent,
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
      <div class="os-account-card__content">
        <div class="os-account-card__header">
          <div class="os-account-card__title-section">
            <h3 class="os-account-card__name">{{ account().name }}</h3>
            <os-account-type-badge [type]="account().type!" [size]="'sm'" />
          </div>
        </div>

        <div class="os-account-card__balance">
          <span class="os-account-card__balance-label">Saldo</span>
          <os-money-display
            [value]="account().balance || 0"
            [currency]="'BRL'"
            [size]="'lg'"
            [ariaLabel]="getBalanceAriaLabel()"
          />
        </div>
      </div>

      @if (actions()?.edit || actions()?.delete) {
      <div class="os-account-card__actions" slot="actions">
        @if (actions()?.edit) {
        <os-button
          variant="tertiary"
          size="small"
          [icon]="'edit'"
          [ariaLabel]="'Editar conta ' + account().name"
          (click)="onEdit()"
        />
        } @if (actions()?.delete) {
        <os-button
          variant="danger"
          size="small"
          [icon]="'delete'"
          [ariaLabel]="'Excluir conta ' + account().name"
          (click)="onDelete()"
        />
        }
      </div>
      }
    </os-card>
  `,
  styleUrls: ['./account-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCardComponent {
  account = input.required<AccountDto>();
  actions = input<{ edit: boolean; delete: boolean } | undefined>(undefined);

  edit = output<AccountDto>();
  delete = output<AccountDto>();

  ariaLabelText = computed(() => {
    const acc = this.account();
    if (!acc) return 'Card de conta';
    return `Conta ${acc.name}, tipo ${acc.type}, saldo ${this.formatBalance(acc.balance)}`;
  });

  getBalanceAriaLabel = computed(() => {
    const acc = this.account();
    if (!acc) return 'Saldo da conta';
    return `Saldo da conta ${acc.name}: ${this.formatBalance(acc.balance)}`;
  });

  onEdit(): void {
    const acc = this.account();
    if (acc) {
      this.edit.emit(acc);
    }
  }

  onDelete(): void {
    const acc = this.account();
    if (acc) {
      this.delete.emit(acc);
    }
  }

  private formatBalance(balance: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(balance);
  }
}
