import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

export type OsTooltipPosition = 'above' | 'below' | 'left' | 'right' | 'before' | 'after';
export type OsTooltipSize = 'small' | 'medium' | 'large';
export type OsTooltipVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'error'
  | 'warning'
  | 'info'
  | 'success';

@Component({
  selector: 'os-tooltip',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  template: `
    <div
      [class]="containerClass()"
      [attr.data-variant]="variant()"
      [attr.data-size]="size()"
      [attr.data-position]="position()"
      [matTooltip]="tooltipText()"
      [matTooltipPosition]="matPosition()"
      [matTooltipDisabled]="disabled()"
      [matTooltipHideDelay]="hideDelay()"
      [matTooltipShowDelay]="showDelay()"
      [matTooltipTouchGestures]="touchGestures()"
      [matTooltipClass]="tooltipClass()"
    >
      <ng-content />
    </div>
  `,
  styleUrls: ['./os-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'os-tooltip-host',
  },
})
export class OsTooltipComponent {
  tooltipText = input<string>('');
  position = input<OsTooltipPosition>('above');
  size = input<OsTooltipSize>('medium');
  variant = input<OsTooltipVariant>('default');
  disabled = input(false);
  hideDelay = input<number>(0);
  showDelay = input<number>(0);
  touchGestures = input<'auto' | 'on' | 'off'>('auto');
  maxWidth = input<number>(200);

  private _isVisible = signal(false);

  isVisible = computed(() => this._isVisible());

  containerClass = computed(() => {
    const classes = ['os-tooltip'];

    if (this.variant() !== 'default') {
      classes.push(`os-tooltip--${this.variant()}`);
    }

    if (this.size() !== 'medium') {
      classes.push(`os-tooltip--${this.size()}`);
    }

    if (this.disabled()) {
      classes.push('os-tooltip--disabled');
    }

    return classes.join(' ');
  });

  tooltipClass = computed(() => {
    const classes = ['os-tooltip__content'];

    if (this.variant() !== 'default') {
      classes.push(`os-tooltip__content--${this.variant()}`);
    }

    if (this.size() !== 'medium') {
      classes.push(`os-tooltip__content--${this.size()}`);
    }

    return classes.join(' ');
  });

  matPosition = computed(() => {
    switch (this.position()) {
      case 'above':
        return 'above';
      case 'below':
        return 'below';
      case 'left':
        return 'left';
      case 'right':
        return 'right';
      case 'before':
        return 'before';
      case 'after':
        return 'after';
      default:
        return 'above';
    }
  });

  constructor() {
    effect(() => {
      if (this.tooltipText()) {
        this._isVisible.set(true);
      } else {
        this._isVisible.set(false);
      }
    });
  }
}
