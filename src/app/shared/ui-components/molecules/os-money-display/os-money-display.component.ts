import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

export type OsMoneyDisplayVariant =
  | 'default'
  | 'positive'
  | 'negative'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';
export type OsMoneyDisplaySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'small' | 'medium' | 'large';

@Component({
  selector: 'os-money-display',
  standalone: true,
  imports: [],
  template: `
    <div
      class="os-money-display"
      [class]="displayClasses()"
      [attr.data-variant]="effectiveVariant()"
      [attr.data-size]="effectiveSize()"
      [attr.role]="role()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-describedby]="ariaDescribedBy()"
    >
      <span class="os-money-display__currency" [attr.aria-hidden]="!showCurrency()">{{
        currencySymbol()
      }}</span>
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
  size = input<OsMoneyDisplaySize>('md');
  showCurrency = input<boolean>(true);
  precision = input<number>(2);
  autoVariant = input<boolean>(true);
  highlightLarge = input<boolean>(true);
  largeThreshold = input<number>(10000);
  role = input<string>('text');
  ariaLabel = input<string>('');
  ariaDescribedBy = input<string>('');

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

  isLargeValue = computed(() => {
    return this.highlightLarge() && Math.abs(this.value()) >= this.largeThreshold();
  });

  effectiveVariant = computed(() => {
    if (!this.autoVariant()) return this.variant();

    const value = this.value();
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
  });

  effectiveSize = computed(() => {
    if (this.isLargeValue()) return 'xl';
    
    const sizeMapping: Record<string, string> = {
      small: 'sm',
      medium: 'md',
      large: 'lg',
    };

    const currentSize = this.size();
    return sizeMapping[currentSize] || currentSize;
  });

  displayClasses = computed(() => {
    const classes = ['os-money-display'];
    const effectiveVariant = this.effectiveVariant();
    const effectiveSize = this.effectiveSize();

    if (effectiveVariant !== 'default') {
      classes.push(`os-money-display--${effectiveVariant}`);
    }

    if (effectiveSize !== 'md') {
      classes.push(`os-money-display--${effectiveSize}`);
    }

    if (this.isLargeValue()) {
      classes.push('os-money-display--large-value');
    }

    return classes.join(' ');
  });
}
