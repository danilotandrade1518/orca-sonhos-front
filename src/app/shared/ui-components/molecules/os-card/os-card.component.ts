import { Component, input, output, ChangeDetectionStrategy, computed } from '@angular/core';

export type OsCardVariant = 'default' | 'outlined' | 'elevated' | 'flat';
export type OsCardSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'os-card',
  standalone: true,
  imports: [],
  template: `
    <div
      [class]="cardClasses()"
      [attr.data-variant]="variant()"
      [attr.data-size]="size()"
      [attr.role]="clickable() ? 'button' : null"
      [attr.tabindex]="clickable() ? '0' : null"
      [attr.aria-disabled]="disabled() ? 'true' : null"
      [attr.aria-selected]="selected() ? 'true' : null"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-describedby]="ariaDescribedBy()"
      (click)="onCardClick()"
      (keydown.enter)="onCardClick()"
      (keydown.space)="onCardClick()"
    >
      @if (header()) {
      <div class="os-card__header">
        <ng-content select="[slot=header]" />
      </div>
      }

      <div class="os-card__content">
        <ng-content />
      </div>

      @if (actions()) {
      <div class="os-card__actions">
        <ng-content select="[slot=actions]" />
      </div>
      }
    </div>
  `,
  styleUrl: './os-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-card-host',
  },
})
export class OsCardComponent {
  
  variant = input<OsCardVariant>('default');
  size = input<OsCardSize>('medium');
  header = input<boolean>(false);
  actions = input<boolean>(false);
  clickable = input<boolean>(false);
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  selected = input<boolean>(false);
  ariaLabel = input<string | null>(null);
  ariaDescribedBy = input<string | null>(null);
  
  cardClick = output<void>();
  
  cardClasses = computed(() => {
    const classes = ['os-card'];
    
    if (this.variant() !== 'default') {
      classes.push(`os-card--${this.variant()}`);
    }
    
    if (this.size() !== 'medium') {
      classes.push(`os-card--${this.size()}`);
    }
    
    if (this.clickable()) {
      classes.push('os-card--clickable');
    }

    if (this.loading()) {
      classes.push('os-card--loading');
    }

    return classes.join(' ');
  });
  
  onCardClick(): void {
    if (this.clickable() && !this.disabled() && !this.loading()) {
      this.cardClick.emit();
    }
  }
}
