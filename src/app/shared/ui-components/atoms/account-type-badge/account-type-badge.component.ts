import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

import { OsBadgeComponent } from '../os-badge/os-badge.component';
import { AccountType } from '../../../../../dtos/account/account-types';

@Component({
  selector: 'os-account-type-badge',
  standalone: true,
  imports: [OsBadgeComponent],
  template: `
    <os-badge
      [variant]="badgeVariant()"
      [size]="size()"
      [icon]="iconName()"
      [ariaLabel]="ariaLabelText()"
      [role]="'status'"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountTypeBadgeComponent {
  type = input.required<AccountType>();
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');

  iconName = computed(() => {
    const type = this.type();
    const iconMap: Record<AccountType, string> = {
      CHECKING_ACCOUNT: 'account_balance',
      SAVINGS_ACCOUNT: 'savings',
      PHYSICAL_WALLET: 'account_balance_wallet',
      DIGITAL_WALLET: 'wallet',
      INVESTMENT_ACCOUNT: 'trending_up',
      OTHER: 'credit_card',
    };
    return iconMap[type] || 'credit_card';
  });

  badgeVariant = computed(() => {
    const type = this.type();
    const variantMap: Record<AccountType, 'primary' | 'success' | 'warning' | 'secondary' | 'info' | 'default'> = {
      CHECKING_ACCOUNT: 'primary',
      SAVINGS_ACCOUNT: 'success',
      PHYSICAL_WALLET: 'warning',
      DIGITAL_WALLET: 'secondary',
      INVESTMENT_ACCOUNT: 'info',
      OTHER: 'default',
    };
    return variantMap[type] || 'default';
  });

  ariaLabelText = computed(() => {
    const type = this.type();
    const labelMap: Record<AccountType, string> = {
      CHECKING_ACCOUNT: 'Conta Corrente',
      SAVINGS_ACCOUNT: 'Conta Poupança',
      PHYSICAL_WALLET: 'Carteira Física',
      DIGITAL_WALLET: 'Carteira Digital',
      INVESTMENT_ACCOUNT: 'Conta de Investimento',
      OTHER: 'Outro tipo de conta',
    };
    return `Tipo de conta: ${labelMap[type] || 'Desconhecido'}`;
  });
}
