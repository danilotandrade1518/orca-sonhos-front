import { Component, input, output, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OsCardComponent } from '../os-card/os-card.component';
import { AccountTypeBadgeComponent } from '../../atoms/account-type-badge/account-type-badge.component';
import { OsMoneyDisplayComponent } from '../os-money-display/os-money-display.component';
import { OsDeleteButtonComponent } from '../../atoms/os-delete-button';
import { OsEditButtonComponent } from '../../atoms/os-edit-button';
import { LocaleService } from '@shared/formatting';
import { AccountDto } from '../../../../../dtos/account/account-types';

@Component({
  selector: 'os-account-card',
  standalone: true,
  imports: [
    CommonModule,
    OsCardComponent,
    AccountTypeBadgeComponent,
    OsMoneyDisplayComponent,
    OsDeleteButtonComponent,
    OsEditButtonComponent,
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
        <os-edit-button
          [ariaLabel]="'Editar conta ' + account().name"
          (editClick)="onEdit($event)"
        />
        } @if (actions()?.delete) {
        <os-delete-button
          [ariaLabel]="'Excluir conta ' + account().name"
          (deleteClick)="onDelete()"
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
  private readonly localeService = inject(LocaleService);

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

  onEdit(event?: MouseEvent): void {
    event?.stopPropagation();
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
    return this.localeService.formatCurrency(balance, 'BRL');
  }
}
