import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type OsMoneyDisplayVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type OsMoneyDisplaySize = 'small' | 'medium' | 'large';

@Component({
  selector: 'os-money-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="os-money-display"
      [class]="displayClasses()"
      [attr.data-variant]="variant()"
      [attr.data-size]="size()"
    >
      <span class="os-money-display__currency">{{ currencySymbol() }}</span>
      <span class="os-money-display__value">{{ formattedValue() }}</span>
    </div>
  `,
  styleUrl: './os-money-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-money-display-host',
  },
})
export class OsMoneyDisplayComponent {
  value = input<number>(0);
  currency = input<string>('BRL');
  locale = input<string>('pt-BR');
  variant = input<OsMoneyDisplayVariant>('default');
  size = input<OsMoneyDisplaySize>('medium');
  showCurrency = input<boolean>(true);
  precision = input<number>(2);

  currencySymbol = computed(() => {
    if (!this.showCurrency()) return '';

    const currencyMap: Record<string, string> = {
      BRL: 'R$',
      USD: '$',
      EUR: '€',
      GBP: '£',
    };

    return currencyMap[this.currency()] || this.currency();
  });

  formattedValue = computed(() => {
    const value = this.value();
    const locale = this.locale();
    const precision = this.precision();

    try {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(value);
    } catch {
      return value.toFixed(precision);
    }
  });

  displayClasses = () => {
    const classes = ['os-money-display'];

    if (this.variant() !== 'default') {
      classes.push(`os-money-display--${this.variant()}`);
    }

    if (this.size() !== 'medium') {
      classes.push(`os-money-display--${this.size()}`);
    }

    return classes.join(' ');
  };
}
