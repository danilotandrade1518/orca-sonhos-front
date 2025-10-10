import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type OsCardVariant = 'default' | 'outlined' | 'elevated' | 'flat';
export type OsCardSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'os-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="cardClasses()"
      [attr.data-variant]="variant()"
      [attr.data-size]="size()"
      [attr.role]="clickable() ? 'button' : null"
      [attr.tabindex]="clickable() ? '0' : null"
      (click)="onCardClick()"
      (keydown.enter)="onCardClick()"
      (keydown.space)="onCardClick()"
    >
      @if (header()) {
      <div class="os-card__header">
        <ng-content select="[slot=header]"></ng-content>
      </div>
      }

      <div class="os-card__content">
        <ng-content></ng-content>
      </div>

      @if (actions()) {
      <div class="os-card__actions">
        <ng-content select="[slot=actions]"></ng-content>
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

  cardClick = output<void>();

  cardClasses = () => {
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

    return classes.join(' ');
  };

  onCardClick(): void {
    if (this.clickable()) {
      this.cardClick.emit();
    }
  }
}
