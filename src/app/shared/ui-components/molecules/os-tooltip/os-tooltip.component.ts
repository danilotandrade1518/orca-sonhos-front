import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
export type OsTooltipRole = 'tooltip' | 'status' | 'alert';

@Component({
  selector: 'os-tooltip',
  standalone: true,
  imports: [MatTooltipModule],
  template: `
    <div
      [class]="containerClass()"
      [attr.data-variant]="variant()"
      [attr.data-size]="size()"
      [attr.data-position]="effectivePosition()"
      [attr.data-mobile]="isMobile()"
      [attr.data-interactive]="interactive()"
      [attr.role]="role()"
      [attr.aria-describedby]="ariaDescribedby()"
      [attr.aria-label]="ariaLabel()"
      [matTooltip]="tooltipText()"
      [matTooltipPosition]="matPosition()"
      [matTooltipDisabled]="disabled()"
      [matTooltipHideDelay]="effectiveHideDelay()"
      [matTooltipShowDelay]="effectiveShowDelay()"
      [matTooltipTouchGestures]="effectiveTouchGestures()"
      [matTooltipClass]="tooltipClass()"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
      (click)="onMobileClick()"
      (keydown)="onKeydown($event)"
      tabindex="0"
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
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);

  tooltipText = input<string>('');
  position = input<OsTooltipPosition>('above');
  size = input<OsTooltipSize>('medium');
  variant = input<OsTooltipVariant>('default');
  role = input<OsTooltipRole>('tooltip');
  disabled = input(false);
  hideDelay = input<number>(0);
  showDelay = input<number>(0);
  touchGestures = input<'auto' | 'on' | 'off'>('auto');
  maxWidth = input<number>(200);
  smartPositioning = input(true);
  interactive = input(false);
  ariaLabel = input<string | null>(null);
  ariaDescribedby = input<string | null>(null);
  animated = input(true);

  tooltipShow = output<void>();
  tooltipHide = output<void>();

  private _isVisible = signal(false);
  private _isMobile = signal(false);
  private _effectivePosition = signal<OsTooltipPosition>('above');

  isVisible = computed(() => this._isVisible());
  isMobile = computed(() => this._isMobile());
  effectivePosition = computed(() => this._effectivePosition());

  effectiveHideDelay = computed(() => {
    return this.isMobile() ? 1500 : this.hideDelay();
  });

  effectiveShowDelay = computed(() => {
    return this.isMobile() ? 0 : this.showDelay();
  });

  effectiveTouchGestures = computed(() => {
    if (this.touchGestures() !== 'auto') {
      return this.touchGestures();
    }
    return this.isMobile() ? 'on' : 'off';
  });

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

    if (this.isMobile()) {
      classes.push('os-tooltip--mobile');
    }

    if (this.interactive()) {
      classes.push('os-tooltip--interactive');
    }

    if (this.animated()) {
      classes.push('os-tooltip--animated');
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

    if (this.interactive()) {
      classes.push('os-tooltip__content--interactive');
    }

    if (this.animated()) {
      classes.push('os-tooltip__content--animated');
    }

    return classes.join(' ');
  });

  matPosition = computed(() => {
    const position = this.effectivePosition();
    switch (position) {
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
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        this._isMobile.set(result.matches);
      });

    effect(() => {
      if (this.tooltipText()) {
        this._isVisible.set(true);
      } else {
        this._isVisible.set(false);
      }
    });

    effect(() => {
      if (this.smartPositioning()) {
        this._effectivePosition.set(this.calculateSmartPosition());
      } else {
        this._effectivePosition.set(this.position());
      }
    });
  }

  onMouseEnter(): void {
    if (!this.disabled() && !this.isMobile()) {
      this.tooltipShow.emit();
    }
  }

  onMouseLeave(): void {
    if (!this.disabled() && !this.isMobile()) {
      this.tooltipHide.emit();
    }
  }

  onMobileClick(): void {
    if (this.isMobile() && !this.disabled()) {
      this.tooltipShow.emit();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onMobileClick();
    }
  }

  private calculateSmartPosition(): OsTooltipPosition {
    const requestedPosition = this.position();
    return requestedPosition;
  }
}
